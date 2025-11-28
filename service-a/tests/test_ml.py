import pytest
import pandas as pd
import numpy as np
from app.ml.ml_engine import ProphetWrapper, LSTMWrapper

def test_prophet_wrapper():
    # Create mock data
    df = pd.DataFrame({
        'ds': pd.date_range(start='2023-01-01', periods=20),
        'y': np.random.rand(20)
    })
    
    wrapper = ProphetWrapper()
    wrapper.train(df)
    
    assert wrapper.is_trained
    
    forecast = wrapper.predict(days=5)
    assert len(forecast) == 5
    assert 'yhat' in forecast.columns

def test_lstm_wrapper():
    # Create mock data
    data = np.random.rand(50)
    
    wrapper = LSTMWrapper(look_back=3)
    wrapper.train(data)
    
    assert wrapper.is_trained
    
    forecast = wrapper.predict(days=5)
    assert len(forecast) == 5
    assert isinstance(forecast, np.ndarray)
