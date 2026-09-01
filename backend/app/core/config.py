import os
from decimal import Decimal
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    POSTGRES_HOST: str = Field(default="localhost", env="POSTGRES_HOST")
    POSTGRES_PORT: int = Field(default=5432, env="POSTGRES_PORT")
    POSTGRES_DB: str = Field(default="gharbudget_gaunsewa", env="POSTGRES_DB")
    POSTGRES_USER: str = Field(default="postgres", env="POSTGRES_USER")
    POSTGRES_PASSWORD: str = Field(default="password", env="POSTGRES_PASSWORD")

    APP_NAME: str = Field(default="GharBudget & GaunSewa", env="APP_NAME")
    APP_VERSION: str = Field(default="0.1.0", env="APP_VERSION")
    DEBUG: bool = Field(default=True, env="DEBUG")

    SECRET_KEY: str = Field(default="your-secret-key-change-in-production", env="SECRET_KEY")
    ALGORITHM: str = Field(default="HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")

    GEMINI_API_KEY: str = Field(default="", env="GEMINI_API_KEY")

    BACKEND_CORS_ORIGINS: list = Field(default=["http://localhost:3000", "http://127.0.0.1:3000"])

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()


def get_database_url() -> str:
    return f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"