from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    groq_api_key: str = ""
    gemini_api_key: str = ""
    database_url: str = "sqlite:///./matrix.db"
    app_env: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
