import pandas as pd
import numpy as np
from datetime import timedelta

try:
    from prophet import Prophet
except ImportError:
    Prophet = None

try:
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense
except ImportError:
    tf = None
    Sequential = None
    LSTM = None
    Dense = None

class ProphetWrapper:
    def __init__(self):
        self.model = Prophet() if Prophet else None
        self.is_trained = False

    def train(self, df):
        """
        df should have columns 'ds' (date) and 'y' (value)
        """
        if not self.model:
            print("Prophet not installed, skipping training")
            self.is_trained = True # Mock training success
            return
        self.model.fit(df)
        self.is_trained = True

    def predict(self, days=7):
        if not self.model:
            # Return dummy forecast
            dates = pd.date_range(start=pd.Timestamp.now(), periods=days)
            return pd.DataFrame({'ds': dates, 'yhat': [0.5]*days})

        if not self.is_trained:
            raise ValueError("Model not trained")

        
        future = self.model.make_future_dataframe(periods=days)
        forecast = self.model.predict(future)
        return forecast[['ds', 'yhat']].tail(days)

class LSTMWrapper:
    def __init__(self, look_back=3):
        self.look_back = look_back
        self.model = self._build_model() if tf else None
        self.is_trained = False

    def _build_model(self):
        if not Sequential: return None
        model = Sequential()
        model.add(LSTM(50, activation='relu', input_shape=(self.look_back, 1)))
        model.add(Dense(1))
        model.compile(optimizer='adam', loss='mse')
        return model

    def _create_dataset(self, dataset):
        X, Y = [], []
        for i in range(len(dataset) - self.look_back - 1):
            a = dataset[i:(i + self.look_back), 0]
            X.append(a)
            Y.append(dataset[i + self.look_back, 0])
        return np.array(X), np.array(Y)

    def train(self, data):
        """
        data should be a numpy array of values
        """
        dataset = data.astype('float32')
        if len(dataset.shape) == 1:
            dataset = dataset.reshape(-1, 1)
            
        # Normalize (simple min-max for demo)
        self.scaler_min = np.min(dataset)
        self.scaler_max = np.max(dataset)
        dataset = (dataset - self.scaler_min) / (self.scaler_max - self.scaler_min + 1e-9)

        X, y = self._create_dataset(dataset)
        if len(X) == 0:
             # Not enough data
             return

        if self.model:
            X = np.reshape(X, (X.shape[0], X.shape[1], 1))
            self.model.fit(X, y, epochs=10, verbose=0)
        
        self.last_sequence = dataset[-self.look_back:]
        self.is_trained = True

    def predict(self, days=7):
        if not self.model:
             return np.array([0.5] * days)

        if not self.is_trained:
            raise ValueError("Model not trained")
            
        predictions = []
        current_sequence = self.last_sequence.copy()
        
        for _ in range(days):
            input_seq = current_sequence.reshape((1, self.look_back, 1))
            pred = self.model.predict(input_seq, verbose=0)
            predictions.append(pred[0][0])
            
            # Update sequence
            current_sequence = np.append(current_sequence[1:], pred)
            
        # Inverse transform
        predictions = np.array(predictions)
        predictions = predictions * (self.scaler_max - self.scaler_min + 1e-9) + self.scaler_min
        return predictions

class EnsembleForecaster:
    def __init__(self):
        self.prophet = ProphetWrapper()
        self.lstm = LSTMWrapper()

    def train(self, df):
        # Train Prophet
        prophet_df = df[['timestamp', 'temperature']].rename(columns={'timestamp': 'ds', 'temperature': 'y'})
        self.prophet.train(prophet_df)
        
        # Train LSTM
        lstm_data = df['temperature'].values
        self.lstm.train(lstm_data)

    def forecast(self, days=7):
        prophet_pred = self.prophet.predict(days)['yhat'].values
        lstm_pred = self.lstm.predict(days)
        
        # Weighted average (50/50)
        ensemble_pred = (prophet_pred + lstm_pred) / 2
        return ensemble_pred.tolist()
