from ..extensions import db


class Automovel(db.Model):
    """Entidade que representa um automóvel disponível para aluguel."""

    __tablename__ = 'automoveis'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    matricula = db.Column(db.String(50), nullable=False)
    ano = db.Column(db.Integer, nullable=False)
    marca = db.Column(db.String(100), nullable=False)
    modelo = db.Column(db.String(100), nullable=False)
    placa = db.Column(db.String(20), nullable=False, unique=True)
    disponivel = db.Column(db.Boolean, default=True, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'matricula': self.matricula,
            'ano': self.ano,
            'marca': self.marca,
            'modelo': self.modelo,
            'placa': self.placa,
            'disponivel': self.disponivel,
        }
