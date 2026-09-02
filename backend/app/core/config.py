import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "NeuroSense API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./neurosense.db"
    )
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Static Data Paths (Support both root and backend data directory structures)
    _root_data = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data"))
    _local_data = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
    DATA_DIR: str = os.getenv("DATA_DIR", _local_data if os.path.exists(_local_data) else _root_data)
    PROCESSED_DATA_DIR: str = os.path.join(DATA_DIR, "processed")
    STATIC_URL_PREFIX: str = "/static"
    
    # Security / CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # LLM & Embedding Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    model_config = SettingsConfigDict(case_sensitive=True)


settings = Settings()
os.makedirs(settings.PROCESSED_DATA_DIR, exist_ok=True)
