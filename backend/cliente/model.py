from ..extensions import db
from ..shared.model import Usuario


class Cliente(Usuario):
    """Entidade que representa um cliente do sistema de aluguel."""

    __tablename__ = 'clientes'

    rg = db.Column(db.String(20), nullable=False)
    cpf = db.Column(db.String(14), nullable=False, unique=True)
    nome = db.Column(db.String(255), nullable=False)
    endereco = db.Column(db.String(500), nullable=False)
    profissao = db.Column(db.String(100))
    foto = db.Column(db.LargeBinary)
    foto_tipo = db.Column(db.String(100))

    rendas = db.relationship(
        'Renda',
        backref='cliente',
        cascade='all, delete-orphan',
        lazy='joined',
    )

    def to_dict(self):
        return {
            'id': self.id,
            'nomeUsuario': self.nome_usuario,
            'tipoUsuario': self.tipo_usuario,
            'nome': self.nome,
            'rg': self.rg,
            'cpf': self.cpf,
            'endereco': self.endereco,
            'profissao': self.profissao,
            'temFoto': bool(self.foto),
            'rendas': [r.to_dict() for r in self.rendas],
            'totalRendimentos': sum(r.valor_rendimento for r in self.rendas),
        }


class Renda(db.Model):
    """Entidade que representa um rendimento de um cliente (máx. 3 por cliente)."""

    __tablename__ = 'rendas'

    id_renda = db.Column(db.Integer, primary_key=True, autoincrement=True)
    entidade_empregadora = db.Column(db.String(255), nullable=False)
    valor_rendimento = db.Column(db.Float, nullable=False)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)

    def to_dict(self):
        return {
            'idRenda': self.id_renda,
            'entidadeEmpregadora': self.entidade_empregadora,
            'valorRendimento': self.valor_rendimento,
        }
