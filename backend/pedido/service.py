from datetime import date

from ..extensions import db
from .model import Pedido, STATUS_CHOICES


class PedidoService:
    """Lógica de negócio do módulo de pedidos de aluguel."""

    def listar_todos(self):
        return [
            p.to_dict()
            for p in Pedido.query.order_by(Pedido.data_criacao.desc()).all()
        ]

    def listar_por_cliente(self, cliente_id):
        return [
            p.to_dict()
            for p in Pedido.query.filter_by(cliente_id=cliente_id)
            .order_by(Pedido.data_criacao.desc())
            .all()
        ]

    def buscar_por_id(self, id):
        p = db.session.get(Pedido, id)
        return p.to_dict() if p else None

    def criar(self, data):
        from ..cliente.model import Cliente
        from ..automovel.model import Automovel

        cliente_id = data.get('clienteId')
        automovel_id = data.get('automovelId')

        if not db.session.get(Cliente, cliente_id):
            raise ValueError(f'Cliente não encontrado: {cliente_id}')
        if not db.session.get(Automovel, automovel_id):
            raise ValueError(f'Automóvel não encontrado: {automovel_id}')

        inicio = date.fromisoformat(data['dataInicio'])
        fim = date.fromisoformat(data['dataFim'])
        if fim < inicio:
            raise ValueError('Data fim deve ser posterior à data início.')

        p = Pedido()
        p.cliente_id = cliente_id
        p.automovel_id = automovel_id
        p.data_inicio = inicio
        p.data_fim = fim
        p.status = 'PENDENTE'
        p.observacao = data.get('observacao')

        db.session.add(p)
        db.session.commit()
        return p.to_dict()

    def atualizar_status(self, id, novo_status):
        if novo_status not in STATUS_CHOICES:
            raise ValueError(f'Status inválido: {novo_status}')
        p = db.session.get(Pedido, id)
        if not p:
            raise ValueError(f'Pedido não encontrado: {id}')
        p.status = novo_status
        db.session.commit()
        return p.to_dict()

    def cancelar(self, id):
        p = db.session.get(Pedido, id)
        if not p:
            raise ValueError(f'Pedido não encontrado: {id}')
        if p.status not in ('PENDENTE', 'EM_ANALISE'):
            raise ValueError('Pedido não pode ser cancelado neste status.')
        p.status = 'CANCELADO'
        db.session.commit()
        return p.to_dict()
