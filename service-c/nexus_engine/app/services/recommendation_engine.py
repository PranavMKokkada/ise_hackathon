from sqlalchemy.orm import Session
from app.models.recommendation import Recommendation
from typing import List

def generate_recommendations(db: Session, risk_calculations: List):
    # Placeholder: Generate recommendations based on risk calculations
    recommendations = []
    
    for risk in risk_calculations:
        if risk.alert_severity in ["HIGH", "CRITICAL"]:
            rec = Recommendation(
                target_entity_type="HOSPITAL",
                target_entity_id=risk.region_id, # Assuming hospital in region
                recommendation_type="STOCKPILE",
                priority="HIGH",
                action_items=[f"Increase stock of {risk.item_id}"],
                expected_impact="Reduce shortage risk by 50%"
            )
            db.add(rec)
            recommendations.append(rec)
            
    db.commit()
    return recommendations
