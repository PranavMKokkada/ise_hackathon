from sqlalchemy.orm import Session
from sklearn.cluster import KMeans
import numpy as np

def detect_patterns(db: Session):
    """
    Use clustering to find correlated events.
    """
    # Mock data: [rainfall, cases]
    X = np.array([
        [100, 20], [120, 25], [110, 22], # Cluster 1: High rain, moderate cases
        [50, 5], [60, 8], [55, 6],       # Cluster 2: Low rain, low cases
        [200, 100], [220, 110], [210, 105] # Cluster 3: Extreme rain, outbreak
    ])
    
    kmeans = KMeans(n_clusters=3, random_state=0, n_init="auto").fit(X)
    
    patterns = []
    centers = kmeans.cluster_centers_
    
    for i, center in enumerate(centers):
        rainfall = center[0]
        cases = center[1]
        
        description = "Unknown"
        if rainfall > 150:
            description = "Extreme Rainfall -> Major Outbreak"
        elif rainfall > 80:
            description = "High Rainfall -> Moderate Cases"
        else:
            description = "Low Rainfall -> Low Risk"
            
        patterns.append({
            "cluster_id": i,
            "centroid": {"rainfall": rainfall, "cases": cases},
            "pattern_description": description
        })
        
    return patterns
