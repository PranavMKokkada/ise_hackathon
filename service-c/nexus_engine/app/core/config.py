from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Nexus Intelligence Engine"
    API_V1_STR: str = "/api/v1/nexus"
    
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "nexus_user"
    POSTGRES_PASSWORD: str = "nexus_password"
    POSTGRES_DB: str = "nexus_db"
    POSTGRES_PORT: str = "5432"
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    RABBITMQ_HOST: str = "localhost"
    RABBITMQ_PORT: int = 5672
    
    SERVICE_A_URL: str = "http://localhost:8001/api/v1/biological-weather"
    SERVICE_B_URL: str = "http://localhost:8002/api/v1/supply-chain"

    class Config:
        env_file = ".env"

    def __init__(self, **data):
        super().__init__(**data)
        if not self.SQLALCHEMY_DATABASE_URI:
            self.SQLALCHEMY_DATABASE_URI = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

settings = Settings()
