import base64
import re

from werkzeug.security import check_password_hash, generate_password_hash

from ..extensions import db
from .model import Cliente, Renda


class ClienteService:
    """Lógica de negócio do módulo de clientes."""

    def listar_todos(self):
        return [c.to_dict() for c in Cliente.query.all()]

    def buscar_por_id(self, id):
        c = db.session.get(Cliente, id)
        return c.to_dict() if c else None

    def buscar_por_cpf(self, cpf):
        cpf_norm = self._normalizar(cpf)
        c = Cliente.query.filter_by(cpf=cpf_norm).first()
        return c.to_dict() if c else None

    def buscar_foto(self, id):
        c = db.session.get(Cliente, id)
        if not c or not c.foto:
            return None
        return c.foto, c.foto_tipo or 'image/jpeg'

    def criar(self, data):
        cpf_norm = self._normalizar(data.get('cpf', ''))
        if Cliente.query.filter_by(cpf=cpf_norm).first():
            raise ValueError(f"CPF já cadastrado: {data.get('cpf')}")
        c = Cliente()
        c.tipo_usuario = 'CLIENTE'
        self._preencher(c, data)
        db.session.add(c)
        db.session.commit()
        return c.to_dict()

    def atualizar(self, id, data):
        c = db.session.get(Cliente, id)
        if not c:
            raise ValueError(f'Cliente não encontrado: {id}')
        cpf_norm = self._normalizar(data.get('cpf', ''))
        if c.cpf != cpf_norm and Cliente.query.filter(
            Cliente.cpf == cpf_norm, Cliente.id != id
        ).first():
            raise ValueError('CPF já cadastrado para outro cliente.')
        self._preencher(c, data)
        db.session.commit()
        return c.to_dict()

    def deletar(self, id):
        c = db.session.get(Cliente, id)
        if not c:
            raise ValueError(f'Cliente não encontrado: {id}')
        db.session.delete(c)
        db.session.commit()

    def verificar_credenciais(self, nome_usuario, senha):
        c = Cliente.query.filter_by(nome_usuario=nome_usuario).first()
        if not c:
            return None
        if c.senha.startswith('pbkdf2:') or c.senha.startswith('scrypt:'):
            if not check_password_hash(c.senha, senha):
                return None
        else:
            if c.senha != senha:
                return None
        return c.to_dict()

    # ── helpers ──────────────────────────────────────────────────────────────

    def _preencher(self, c, data):
        c.nome_usuario = data['nomeUsuario']
        if data.get('senha'):
            c.senha = generate_password_hash(data['senha'])
        elif not getattr(c, 'senha', None):
            c.senha = generate_password_hash('changeme')
        c.nome = data['nome']
        c.rg = self._normalizar(data.get('rg', ''))
        c.cpf = self._normalizar(data.get('cpf', ''))
        c.endereco = data['endereco']
        c.profissao = data.get('profissao') or 'Sem profissão'
        self._processar_foto(c, data.get('fotoBase64'))
        c.rendas.clear()
        for n in range(1, 4):
            ent = data.get(f'renda{n}Entidade')
            val = data.get(f'renda{n}Valor')
            if ent and val is not None:
                r = Renda()
                r.entidade_empregadora = ent
                r.valor_rendimento = float(val)
                r.cliente = c
                c.rendas.append(r)

    def _processar_foto(self, c, foto_b64):
        if not foto_b64:
            return
        try:
            if ',' in foto_b64:
                header, data = foto_b64.split(',', 1)
                tipo = header.split(':')[1].split(';')[0] if ':' in header else 'image/jpeg'
                c.foto_tipo = tipo
                c.foto = base64.b64decode(data)
            else:
                c.foto_tipo = 'image/jpeg'
                c.foto = base64.b64decode(foto_b64)
        except Exception:
            pass

    def _normalizar(self, v):
        return re.sub(r'\D', '', v or '')
