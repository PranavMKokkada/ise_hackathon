from app.tasks.celery_app import celery_app
from app.core.database import SessionLocal
from app.services.collision_detection import detect_collisions
from app.services.recommendation_engine import generate_recommendations

@celery_app.task
def run_collision_detection():
    db = SessionLocal()
    try:
        collisions = detect_collisions(db)
        if collisions:
            generate_recommendations(db, collisions)
    finally:
        db.close()
