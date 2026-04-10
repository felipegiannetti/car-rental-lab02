from datetime import date, datetime

from ..extensions import db


class Automovel(db.Model):
    """Entidade que representa um automovel anunciado para aluguel ou venda."""

    __tablename__ = 'automoveis'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    matricula = db.Column(db.String(50), nullable=False)
    ano = db.Column(db.Integer, nullable=False)
    marca = db.Column(db.String(100), nullable=False)
    modelo = db.Column(db.String(100), nullable=False)
    placa = db.Column(db.String(20), nullable=False, unique=True)
    quilometragem = db.Column(db.Integer, nullable=False, default=0)
    disponivel = db.Column(db.Boolean, default=True, nullable=False)
    status_anuncio = db.Column(db.String(30), nullable=False, default='DISPONIVEL')
    aceita_aluguel = db.Column(db.Boolean, default=True, nullable=False)
    aceita_compra = db.Column(db.Boolean, default=True, nullable=False)
    anunciante_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=True)
    foto = db.Column(db.LargeBinary)
    foto_tipo = db.Column(db.String(100))
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    anunciante = db.relationship(
        'Cliente',
        backref=db.backref('automoveis_anunciados', lazy=True),
        foreign_keys=[anunciante_id],
    )

    def status_atual(self):
        if (self.status_anuncio or 'DISPONIVEL') == 'EM_NEGOCIACAO':
            return 'EM_NEGOCIACAO'

        today = date.today()
        for pedido in getattr(self, 'pedidos', []) or []:
            if pedido.status == 'APROVADO' and pedido.tipo_pedido == 'ALUGUEL' and pedido.data_fim and pedido.data_fim >= today:
                return 'EM_USO'

        if not self.disponivel:
            return 'INDISPONIVEL'

        return 'DISPONIVEL'

    def to_dict(self):
        return {
            'id': self.id,
            'matricula': self.matricula,
            'ano': self.ano,
            'marca': self.marca,
            'modelo': self.modelo,
            'placa': self.placa,
            'quilometragem': self.quilometragem,
            'disponivel': self.disponivel,
            'statusAnuncio': self.status_atual(),
            'aceitaAluguel': self.aceita_aluguel,
            'aceitaCompra': self.aceita_compra,
            'anuncianteId': self.anunciante_id,
            'anuncianteNome': self.anunciante.nome if self.anunciante else None,
            'temFoto': bool(self.foto),
            'dataAtualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None,
            'fotoVersao': self.data_atualizacao.isoformat() if self.foto and self.data_atualizacao else None,
        }
