from datetime import date

from ..automovel.service import AutomovelService
from ..extensions import db
from .model import Pedido, STATUS_CHOICES, TIPO_PEDIDO_CHOICES


class PedidoService:
    """Logica de negocio do modulo de pedidos de aluguel e compra."""

    def __init__(self):
        self._automovel_service = AutomovelService()

    def listar_todos(self):
        return [p.to_dict() for p in Pedido.query.order_by(Pedido.data_criacao.desc()).all()]

    def listar_por_cliente(self, cliente_id):
        return [
            p.to_dict()
            for p in Pedido.query.filter_by(cliente_id=cliente_id).order_by(Pedido.data_criacao.desc()).all()
        ]

    def listar_por_anunciante(self, anunciante_id):
        from ..automovel.model import Automovel

        return [
            p.to_dict()
            for p in Pedido.query.join(Pedido.automovel)
            .filter(Automovel.anunciante_id == anunciante_id)
            .order_by(Pedido.data_criacao.desc())
            .all()
        ]

    def buscar_modelo(self, id):
        return db.session.get(Pedido, id)

    def buscar_por_id(self, id):
        pedido = db.session.get(Pedido, id)
        return pedido.to_dict() if pedido else None

    def criar(self, data):
        from ..cliente.model import Cliente
        from ..automovel.model import Automovel

        cliente_id = data.get('clienteId')
        automovel_id = data.get('automovelId')
        tipo_pedido = (data.get('tipoPedido') or 'ALUGUEL').upper()

        cliente = db.session.get(Cliente, cliente_id)
        automovel = db.session.get(Automovel, automovel_id)

        if not cliente:
            raise ValueError(f'Cliente nao encontrado: {cliente_id}')
        if not automovel:
            raise ValueError(f'Automovel nao encontrado: {automovel_id}')
        if automovel.anunciante_id == cliente_id:
            raise ValueError('Voce nao pode abrir pedido para o proprio anuncio.')
        if tipo_pedido not in TIPO_PEDIDO_CHOICES:
            raise ValueError(f'Tipo de pedido invalido: {tipo_pedido}')
        if not automovel.disponivel:
            raise ValueError('Este carro nao esta disponivel para novos pedidos no momento.')
        if automovel.status_anuncio == 'EM_NEGOCIACAO':
            raise ValueError('Este carro esta em negociacao e nao aceita novos pedidos.')
        if tipo_pedido == 'ALUGUEL' and not automovel.aceita_aluguel:
            raise ValueError('Este anuncio nao aceita pedidos de aluguel.')
        if tipo_pedido == 'COMPRA' and not automovel.aceita_compra:
            raise ValueError('Este anuncio nao aceita pedidos de compra.')

        inicio, fim = self._resolver_periodo(data, tipo_pedido)

        if tipo_pedido == 'ALUGUEL' and self._tem_conflito_de_periodo(automovel_id, inicio, fim):
            raise ValueError('Ja existe um aluguel aprovado para este carro no periodo selecionado.')

        pedido = Pedido()
        pedido.cliente_id = cliente_id
        pedido.automovel_id = automovel_id
        pedido.tipo_pedido = tipo_pedido
        pedido.data_inicio = inicio
        pedido.data_fim = fim
        pedido.status = 'PENDENTE'
        pedido.observacao = data.get('observacao')

        db.session.add(pedido)
        db.session.commit()
        return pedido.to_dict()

    def atualizar_status(self, id, novo_status):
        if novo_status not in STATUS_CHOICES:
            raise ValueError(f'Status invalido: {novo_status}')
        pedido = db.session.get(Pedido, id)
        if not pedido:
            raise ValueError(f'Pedido nao encontrado: {id}')
        pedido.status = novo_status
        db.session.commit()
        return pedido.to_dict()

    def decidir(self, id, novo_status):
        if novo_status not in ('APROVADO', 'REPROVADO'):
            raise ValueError('A decisao deve ser APROVADO ou REPROVADO.')

        pedido = db.session.get(Pedido, id)
        if not pedido:
            raise ValueError(f'Pedido nao encontrado: {id}')
        if pedido.status not in ('PENDENTE', 'EM_ANALISE'):
            raise ValueError('Este pedido nao pode mais ser analisado.')

        automovel = pedido.automovel
        if not automovel:
            raise ValueError('Automovel do pedido nao encontrado.')

        if novo_status == 'REPROVADO':
            pedido.status = 'REPROVADO'
            db.session.commit()
            return pedido.to_dict()

        if pedido.tipo_pedido == 'ALUGUEL':
            if not automovel.disponivel:
                raise ValueError('O carro nao esta disponivel para aprovar aluguel.')
            if automovel.status_anuncio == 'EM_NEGOCIACAO':
                raise ValueError('O carro esta em negociacao e nao pode ser alugado.')
            if self._tem_conflito_de_periodo(automovel.id, pedido.data_inicio, pedido.data_fim, ignorar_pedido_id=pedido.id):
                raise ValueError('Ja existe outro aluguel aprovado para este periodo.')
        else:
            if automovel.status_anuncio == 'EM_NEGOCIACAO':
                raise ValueError('O carro ja esta em negociacao.')
            self._automovel_service.colocar_em_negociacao(automovel)

        pedido.status = 'APROVADO'
        db.session.commit()
        return pedido.to_dict()

    def cancelar(self, id):
        pedido = db.session.get(Pedido, id)
        if not pedido:
            raise ValueError(f'Pedido nao encontrado: {id}')
        if pedido.status not in ('PENDENTE', 'EM_ANALISE'):
            raise ValueError('Pedido nao pode ser cancelado neste status.')
        pedido.status = 'CANCELADO'
        db.session.commit()
        return pedido.to_dict()

    def deletar(self, id):
        pedido = db.session.get(Pedido, id)
        if not pedido:
            raise ValueError(f'Pedido nao encontrado: {id}')

        automovel = pedido.automovel
        liberar_negociacao = (
            automovel
            and pedido.tipo_pedido == 'COMPRA'
            and pedido.status == 'APROVADO'
            and automovel.status_anuncio == 'EM_NEGOCIACAO'
            and not self._tem_outra_compra_aprovada(automovel.id, pedido.id)
        )

        db.session.delete(pedido)

        if liberar_negociacao:
            self._automovel_service.liberar_negociacao(automovel)

        db.session.commit()

    def _resolver_periodo(self, data, tipo_pedido):
        if tipo_pedido == 'COMPRA':
            hoje = date.today()
            return hoje, hoje

        inicio = date.fromisoformat(data['dataInicio'])
        fim = date.fromisoformat(data['dataFim'])
        if fim < inicio:
            raise ValueError('Data fim deve ser posterior a data inicio.')
        return inicio, fim

    def _tem_conflito_de_periodo(self, automovel_id, inicio, fim, ignorar_pedido_id=None):
        query = Pedido.query.filter_by(automovel_id=automovel_id, status='APROVADO', tipo_pedido='ALUGUEL')
        if ignorar_pedido_id is not None:
            query = query.filter(Pedido.id != ignorar_pedido_id)

        for pedido in query.all():
            if pedido.data_inicio <= fim and pedido.data_fim >= inicio:
                return True
        return False

    def _tem_outra_compra_aprovada(self, automovel_id, ignorar_pedido_id):
        return Pedido.query.filter_by(
            automovel_id=automovel_id,
            status='APROVADO',
            tipo_pedido='COMPRA',
        ).filter(Pedido.id != ignorar_pedido_id).first() is not None
