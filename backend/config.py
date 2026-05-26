import os

class Config:
    _database_url = os.getenv('DATABASE_URL', 'sqlite:///carrental.db')
    # CODE_REVIEW (22): magic strings + ausencia de validacao -> Pydantic Settings + python-dotenv
    if _database_url.startswith('postgres://'):
        _database_url = _database_url.replace('postgres://', 'postgresql://', 1)

    SQLALCHEMY_DATABASE_URI = _database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # CODE_REVIEW (23): SECRET_KEY com default inseguro -> fail-fast em producao (FLASK_ENV=production)
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-prod')
    JSON_SORT_KEYS = False
