import uvicorn
import os
from app.main import app
from app.core.config import settings
from app.core.database import Base, engine
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 1. Configure SQLite
settings.SQLALCHEMY_DATABASE_URI = "sqlite:///./local_nexus.db"

# 2. Re-create engine and bind
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, connect_args={"check_same_thread": False})
Base.metadata.bind = engine

# 3. Patch dependency
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from app.core.database import get_db
app.dependency_overrides[get_db] = override_get_db

# 4. Create Tables
print("Creating local database tables...")
Base.metadata.create_all(bind=engine)
print("Tables created.")

if __name__ == "__main__":
    print("Starting Local Nexus Engine on http://127.0.0.1:8003")
    print("Swagger UI: http://127.0.0.1:8003/docs")
    uvicorn.run(app, host="127.0.0.1", port=8003, log_level="info")
