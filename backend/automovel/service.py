import base64

from ..extensions import db
from .model import Automovel


class AutomovelService:
    """Logica de negocio do modulo de automoveis."""

    def listar_todos(self):
        return [a.to_dict() for a in Automovel.query.order_by(Automovel.id.desc()).all()]

    def buscar_por_id(self, id):
        automovel = db.session.get(Automovel, id)
        return automovel.to_dict() if automovel else None

    def buscar_modelo(self, id):
        return db.session.get(Automovel, id)

    def buscar_foto(self, id):
        automovel = db.session.get(Automovel, id)
        if not automovel or not automovel.foto:
            return None
        return automovel.foto, automovel.foto_tipo or 'image/jpeg'

    def criar(self, data, user=None):
        placa = self._normalizar_placa(data.get('placa', ''))
        if Automovel.query.filter_by(placa=placa).first():
            raise ValueError(f"Placa ja cadastrada: {data.get('placa')}")

        automovel = Automovel()
        if user and user.get('tipoUsuario') == 'CLIENTE':
            automovel.anunciante_id = user['id']

        self._preencher(automovel, data)
        db.session.add(automovel)
        db.session.commit()
        return automovel.to_dict()

    def atualizar(self, id, data):
        automovel = db.session.get(Automovel, id)
        if not automovel:
            raise ValueError(f'Automovel nao encontrado: {id}')

        placa = self._normalizar_placa(data.get('placa', ''))
        if automovel.placa != placa and Automovel.query.filter(
            Automovel.placa == placa, Automovel.id != id
        ).first():
            raise ValueError('Placa ja cadastrada para outro automovel.')

        self._preencher(automovel, data)
        db.session.commit()
        return automovel.to_dict()

    def deletar(self, id):
        from ..pedido.model import Pedido

        automovel = db.session.get(Automovel, id)
        if not automovel:
            raise ValueError(f'Automovel nao encontrado: {id}')

        Pedido.query.filter_by(automovel_id=id).delete(synchronize_session=False)
        db.session.delete(automovel)
        db.session.commit()

    def colocar_em_negociacao(self, automovel):
        automovel.status_anuncio = 'EM_NEGOCIACAO'

    def liberar_negociacao(self, automovel):
        if automovel.status_anuncio == 'EM_NEGOCIACAO':
            automovel.status_anuncio = 'DISPONIVEL'

    def _preencher(self, automovel, data):
        automovel.matricula = data['matricula']
        automovel.ano = int(data['ano'])
        automovel.marca = data['marca']
        automovel.modelo = data['modelo']
        automovel.placa = self._normalizar_placa(data.get('placa', ''))
        automovel.quilometragem = int(data.get('quilometragem', 0))
        automovel.disponivel = data.get('disponivel', True)
        automovel.status_anuncio = data.get('statusAnuncio') or automovel.status_anuncio or 'DISPONIVEL'
        automovel.aceita_aluguel = self._to_bool(data.get('aceitaAluguel'), automovel.aceita_aluguel if automovel.id else True)
        automovel.aceita_compra = self._to_bool(data.get('aceitaCompra'), automovel.aceita_compra if automovel.id else True)
        if not automovel.aceita_aluguel and not automovel.aceita_compra:
            raise ValueError('Selecione pelo menos uma modalidade: aluguel ou compra.')
        self._processar_foto(automovel, data.get('fotoBase64'), data.get('removerFoto'))

    def _normalizar_placa(self, value):
        return value.upper().strip()

    def _to_bool(self, value, default=False):
        if value is None:
            return default
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            return value.strip().lower() in {'1', 'true', 'sim', 'yes', 'on'}
        return bool(value)

    def _processar_foto(self, automovel, foto_b64, remover_foto=False):
        if remover_foto:
            automovel.foto = None
            automovel.foto_tipo = None
            return

        if not foto_b64:
            return

        try:
            if ',' in foto_b64:
                header, data = foto_b64.split(',', 1)
                automovel.foto_tipo = header.split(':')[1].split(';')[0] if ':' in header else 'image/jpeg'
                automovel.foto = base64.b64decode(data)
            else:
                automovel.foto_tipo = 'image/jpeg'
                automovel.foto = base64.b64decode(foto_b64)
        except Exception:
            pass
