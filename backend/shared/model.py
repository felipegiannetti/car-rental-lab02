from ..extensions import db


class Usuario(db.Model):
    """Superclasse mapeada para todos os usuários do sistema."""

    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome_usuario = db.Column('nome_usuario', db.String(100), nullable=False, unique=True)
    senha = db.Column('senha', db.String(255), nullable=False)
    tipo_usuario = db.Column('tipo_usuario', db.String(50), nullable=False)
