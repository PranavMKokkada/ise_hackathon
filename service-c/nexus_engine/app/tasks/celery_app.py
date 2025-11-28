from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "nexus_worker",
    broker=f"amqp://guest:guest@{settings.RABBITMQ_HOST}:{settings.RABBITMQ_PORT}//",
    backend=f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/0"
)

celery_app.conf.task_routes = {
    "app.tasks.*": {"queue": "nexus_queue"},
}

celery_app.conf.beat_schedule = {
    "run-collision-detection-every-30-mins": {
        "task": "app.tasks.data_ingestion.run_collision_detection",
        "schedule": 1800.0,
    },
}
