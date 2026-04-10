from werkzeug.security import check_password_hash, generate_password_hash

from ..admin.model import Admin
from ..cliente.model import Cliente
from ..extensions import db


class AuthService:
    """Operacoes de autenticacao e bootstrap de usuarios."""

    def autenticar(self, nome_usuario, senha):
        user = Admin.query.filter_by(nome_usuario=nome_usuario).first()
        if not user:
            user = Cliente.query.filter_by(nome_usuario=nome_usuario).first()
        if not user or not self._senha_confere(user.senha, senha):
            return None
        return user.to_dict()

    def garantir_admin_padrao(self):
        admin = Admin.query.filter_by(nome_usuario='admin').first()
        if admin:
            return admin

        admin = Admin()
        admin.nome = 'Administrador'
        admin.nome_usuario = 'admin'
        admin.tipo_usuario = 'ADMIN'
        admin.senha = generate_password_hash('admin')

        db.session.add(admin)
        db.session.commit()
        return admin

    def _senha_confere(self, senha_salva, senha_digitada):
        if senha_salva.startswith('pbkdf2:') or senha_salva.startswith('scrypt:'):
            return check_password_hash(senha_salva, senha_digitada)
        return senha_salva == senha_digitada
