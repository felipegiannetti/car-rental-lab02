import base64
import re

from werkzeug.security import check_password_hash, generate_password_hash

from ..extensions import db
from .model import Cliente, Renda


class ClienteService:
    """Logica de negocio do modulo de clientes."""

    def listar_todos(self):
        return [c.to_dict() for c in Cliente.query.all()]

    def buscar_por_id(self, id):
        cliente = db.session.get(Cliente, id)
        return cliente.to_dict() if cliente else None

    def buscar_por_cpf(self, cpf):
        cpf_norm = self._normalizar(cpf)
        cliente = Cliente.query.filter_by(cpf=cpf_norm).first()
        return cliente.to_dict() if cliente else None

    def buscar_foto(self, id):
        cliente = db.session.get(Cliente, id)
        if not cliente or not cliente.foto:
            return None
        return cliente.foto, cliente.foto_tipo or 'image/jpeg'

    def criar(self, data):
        cpf_norm = self._normalizar(data.get('cpf', ''))
        if Cliente.query.filter_by(cpf=cpf_norm).first():
            raise ValueError(f"CPF ja cadastrado: {data.get('cpf')}")
        cliente = Cliente()
        cliente.tipo_usuario = 'CLIENTE'
        self._preencher(cliente, data)
        db.session.add(cliente)
        db.session.commit()
        return cliente.to_dict()

    def atualizar(self, id, data):
        cliente = db.session.get(Cliente, id)
        if not cliente:
            raise ValueError(f'Cliente nao encontrado: {id}')

        cpf_norm = self._normalizar(data.get('cpf', ''))
        if cliente.cpf != cpf_norm and Cliente.query.filter(
            Cliente.cpf == cpf_norm, Cliente.id != id
        ).first():
            raise ValueError('CPF ja cadastrado para outro cliente.')

        self._preencher(cliente, data)
        db.session.commit()
        return cliente.to_dict()

    def deletar(self, id):
        cliente = db.session.get(Cliente, id)
        if not cliente:
            raise ValueError(f'Cliente nao encontrado: {id}')
        db.session.delete(cliente)
        db.session.commit()

    def verificar_credenciais(self, nome_usuario, senha):
        cliente = Cliente.query.filter_by(nome_usuario=nome_usuario).first()
        if not cliente:
            return None
        if cliente.senha.startswith('pbkdf2:') or cliente.senha.startswith('scrypt:'):
            if not check_password_hash(cliente.senha, senha):
                return None
        else:
            if cliente.senha != senha:
                return None
        return cliente.to_dict()

    def _preencher(self, cliente, data):
        cliente.nome_usuario = data['nomeUsuario']
        cliente.senha = self._preencher_senha(getattr(cliente, 'senha', None), data.get('senha'))
        cliente.nome = data['nome']
        cliente.rg = self._normalizar(data.get('rg', ''))
        cliente.cpf = self._normalizar(data.get('cpf', ''))
        cliente.endereco = data['endereco']
        cliente.email = data.get('email')
        cliente.telefone = data.get('telefone')
        cliente.profissao = data.get('profissao') or 'Sem profissao'
        self._processar_foto(cliente, data.get('fotoBase64'))
        cliente.rendas.clear()
        for n in range(1, 4):
            entidade = data.get(f'renda{n}Entidade')
            valor = data.get(f'renda{n}Valor')
            if entidade and valor is not None:
                renda = Renda()
                renda.entidade_empregadora = entidade
                renda.valor_rendimento = float(valor)
                renda.cliente = cliente
                cliente.rendas.append(renda)

    def _processar_foto(self, cliente, foto_b64):
        if not foto_b64:
            return
        try:
            if ',' in foto_b64:
                header, data = foto_b64.split(',', 1)
                tipo = header.split(':')[1].split(';')[0] if ':' in header else 'image/jpeg'
                cliente.foto_tipo = tipo
                cliente.foto = base64.b64decode(data)
            else:
                cliente.foto_tipo = 'image/jpeg'
                cliente.foto = base64.b64decode(foto_b64)
        except Exception:
            pass

    def _preencher_senha(self, senha_atual, nova_senha):
        if nova_senha:
            return generate_password_hash(nova_senha)
        if senha_atual:
            return senha_atual
        return generate_password_hash('changeme')

    def _normalizar(self, value):
        return re.sub(r'\D', '', value or '')
