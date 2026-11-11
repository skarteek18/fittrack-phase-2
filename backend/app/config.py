from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # Application Configuration
    APP_NAME: str = "FitTrack"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = True

    # Database Configuration
    DATABASE_URL: str = "sqlite:///./fittrack.db"

    # JWT Authentication Configuration
    SECRET_KEY: str = "change_this_to_a_secure_random_secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS Configuration
    FRONTEND_URL: str = "http://localhost:5173"

    # Password Configuration
    PASSWORD_MIN_LENGTH: int = 8

    # Environment Configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",