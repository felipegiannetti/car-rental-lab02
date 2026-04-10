from datetime import datetime

from ..extensions import db

STATUS_CHOICES = ['PENDENTE', 'EM_ANALISE', 'APROVADO', 'REPROVADO', 'CANCELADO']


class Pedido(db.Model):
    """Entidade que representa um pedido de aluguel de automóvel."""

    __tablename__ = 'pedidos'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    automovel_id = db.Column(db.Integer, db.ForeignKey('automoveis.id'), nullable=False)
    data_inicio = db.Column(db.Date, nullable=False)
    data_fim = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='PENDENTE')
    observacao = db.Column(db.Text)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    cliente = db.relationship('Cliente', backref=db.backref('pedidos', lazy=True))
    automovel = db.relationship('Automovel', backref=db.backref('pedidos', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'clienteId': self.cliente_id,
            'clienteNome': self.cliente.nome if self.cliente else None,
            'automovelId': self.automovel_id,
            'automovelInfo': (
                f'{self.automovel.marca} {self.automovel.modelo} — {self.automovel.placa}'
                if self.automovel else None
            ),
            'dataInicio': self.data_inicio.isoformat() if self.data_inicio else None,
            'dataFim': self.data_fim.isoformat() if self.data_fim else None,
            'status': self.status,
            'observacao': self.observacao,
            'dataCriacao': self.data_criacao.isoformat() if self.data_criacao else None,
        }
