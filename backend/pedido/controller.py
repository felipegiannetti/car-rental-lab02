from flask import Blueprint, jsonify, request

from .service import PedidoService

bp = Blueprint('pedidos', __name__, url_prefix='/api/pedidos')
_svc = PedidoService()


@bp.get('/')
def listar():
    cliente_id = request.args.get('clienteId', type=int)
    if cliente_id:
        return jsonify(_svc.listar_por_cliente(cliente_id))
    return jsonify(_svc.listar_todos())


@bp.post('/')
def criar():
    try:
        return jsonify(_svc.criar(request.json)), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@bp.get('/<int:id>')
def buscar(id):
    p = _svc.buscar_por_id(id)
    if p:
        return jsonify(p)
    return jsonify({'message': f'Pedido não encontrado: {id}'}), 404


@bp.patch('/<int:id>/status')
def atualizar_status(id):
    try:
        return jsonify(_svc.atualizar_status(id, request.json.get('status')))
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@bp.post('/<int:id>/cancelar')
def cancelar(id):
    try:
        return jsonify(_svc.cancelar(id))
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
