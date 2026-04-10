from ..admin.model import Admin
from ..cliente.model import Cliente
from ..cliente.service import ClienteService
from ..extensions import db


class UsuarioService:
    """Gerenciamento administrativo de usuarios."""

    def __init__(self):
        self._cliente_service = ClienteService()

    def listar_todos(self):
        usuarios = [admin.to_dict() for admin in Admin.query.all()]
        usuarios.extend(cliente.to_dict() for cliente in Cliente.query.all())
        return sorted(
            usuarios,
            key=lambda usuario: (
                usuario.get('nome', '').lower(),
                usuario.get('nomeUsuario', '').lower(),
            ),
        )

    def buscar(self, tipo, id):
        usuario = self._obter_modelo(tipo, id)
        return usuario.to_dict() if usuario else None

    def criar(self, data):
        tipo = self._normalizar_tipo(data.get('tipoUsuario'))
        nome_usuario = (data.get('nomeUsuario') or '').strip()
        if not nome_usuario:
            raise ValueError('Nome de usuario e obrigatorio.')
        self._validar_nome_usuario_unico(nome_usuario)

        if tipo == 'ADMIN':
            admin = Admin()
            admin.nome = (data.get('nome') or '').strip()
            admin.nome_usuario = nome_usuario
            admin.tipo_usuario = 'ADMIN'
            senha = data.get('senha')
            if not senha:
                raise ValueError('Senha e obrigatoria para administradores.')
            admin.senha = self._cliente_service._preencher_senha(None, senha)
            db.session.add(admin)
            db.session.commit()
            return admin.to_dict()

        cliente = Cliente()
        cliente.tipo_usuario = 'CLIENTE'
        self._validar_cpf_unico(None, data.get('cpf'))
        self._cliente_service._preencher(cliente, data)
        db.session.add(cliente)
        db.session.commit()
        return cliente.to_dict()

    def atualizar(self, tipo, id, data):
        tipo_normalizado = self._normalizar_tipo(tipo)

        if tipo_normalizado == 'ADMIN':
            admin = db.session.get(Admin, id)
            if not admin:
                raise ValueError(f'Administrador nao encontrado: {id}')
            nome_usuario = (data.get('nomeUsuario') or '').strip()
            if not nome_usuario:
                raise ValueError('Nome de usuario e obrigatorio.')
            self._validar_nome_usuario_unico(nome_usuario, tipo_normalizado, id)
            admin.nome = (data.get('nome') or '').strip()
            admin.nome_usuario = nome_usuario
            if data.get('senha'):
                admin.senha = self._cliente_service._preencher_senha(admin.senha, data['senha'])
            db.session.commit()
            return admin.to_dict()

        cliente = db.session.get(Cliente, id)
        if not cliente:
            raise ValueError(f'Cliente nao encontrado: {id}')
        nome_usuario = (data.get('nomeUsuario') or '').strip()
        if not nome_usuario:
            raise ValueError('Nome de usuario e obrigatorio.')
        self._validar_nome_usuario_unico(nome_usuario, tipo_normalizado, id)
        self._validar_cpf_unico(id, data.get('cpf'))
        self._cliente_service._preencher(cliente, data)
        db.session.commit()
        return cliente.to_dict()

    def deletar(self, tipo, id):
        tipo_normalizado = self._normalizar_tipo(tipo)
        modelo = Admin if tipo_normalizado == 'ADMIN' else Cliente
        usuario = db.session.get(modelo, id)
        if not usuario:
            raise ValueError('Usuario nao encontrado.')
        db.session.delete(usuario)
        db.session.commit()

    def _normalizar_tipo(self, tipo):
        valor = (tipo or 'CLIENTE').strip().upper()
        if valor not in ('ADMIN', 'CLIENTE'):
            raise ValueError(f'Tipo de usuario invalido: {tipo}')
        return valor

    def _obter_modelo(self, tipo, id):
        tipo_normalizado = self._normalizar_tipo(tipo)
        modelo = Admin if tipo_normalizado == 'ADMIN' else Cliente
        return db.session.get(modelo, id)

    def _validar_nome_usuario_unico(self, nome_usuario, tipo_atual=None, id_atual=None):
        admin = Admin.query.filter_by(nome_usuario=nome_usuario).first()
        if admin and (tipo_atual != 'ADMIN' or admin.id != id_atual):
            raise ValueError('Nome de usuario ja esta em uso.')

        cliente = Cliente.query.filter_by(nome_usuario=nome_usuario).first()
        if cliente and (tipo_atual != 'CLIENTE' or cliente.id != id_atual):
            raise ValueError('Nome de usuario ja esta em uso.')

    def _validar_cpf_unico(self, id_atual, cpf):
        cpf_norm = self._cliente_service._normalizar(cpf)
        if not cpf_norm:
            return
        existente = Cliente.query.filter_by(cpf=cpf_norm).first()
        if existente and existente.id != id_atual:
            raise ValueError('CPF ja cadastrado para outro cliente.')
