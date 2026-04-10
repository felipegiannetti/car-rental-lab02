from ..extensions import db
from ..shared.model import Usuario


class Admin(Usuario):
    """Conta administrativa do sistema."""

    __tablename__ = 'admins'

    nome = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'tipoRegistro': 'admin',
            'nomeUsuario': self.nome_usuario,
            'tipoUsuario': self.tipo_usuario,
            'nome': self.nome,
            'rg': None,
            'cpf': None,
            'endereco': None,
            'profissao': None,
            'temFoto': False,
            'rendas': [],
            'totalRendimentos': 0,
        }
