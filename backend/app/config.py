from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = 'DHAN API'
    # SQLite works out of the box for local/demo use. For production, set
    # DATABASE_URL to a PostgreSQL DSN, e.g.
    # postgresql+psycopg://postgres:postgres@localhost:5432/dhan
    database_url: str = 'sqlite:///./dhan.db'
    jwt_secret: str = 'change-me-in-production'
    jwt_algorithm: str = 'HS256'
    access_token_expire_minutes: int = 60
    cors_origins: str = 'http://localhost:3000,http://127.0.0.1:3000'
    upload_dir: str = './storage/uploads'
    max_upload_size: int = 5 * 1024 * 1024
    ocr_tesseract_enabled: bool = False

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')


@lru_cache
def get_settings() -> Settings:
    return Settings()
