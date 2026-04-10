from flask import Blueprint, jsonify, request

from ..security import get_current_user, require_same_cliente_or_admin
from .service import PedidoService

bp = Blueprint('pedidos', __name__, url_prefix='/api/pedidos')
_svc = PedidoService()


def _can_access_pedido(user, pedido):
    if not user:
        return False
    if user['tipoUsuario'] == 'ADMIN':
        return True
    return user['id'] in {pedido['clienteId'], pedido.get('anuncianteId')}


def _can_manage_pedido(user, pedido):
    if not user:
        return False
    if user['tipoUsuario'] == 'ADMIN':
        return True
    return user['tipoUsuario'] == 'CLIENTE' and user['id'] == pedido.get('anuncianteId')


@bp.get('/')
def listar():
    user = get_current_user()
    cliente_id = request.args.get('clienteId', type=int)
    anunciante_id = request.args.get('anuncianteId', type=int)

    if cliente_id:
        forbidden = require_same_cliente_or_admin(cliente_id)
        if forbidden:
            return forbidden
        return jsonify(_svc.listar_por_cliente(cliente_id))

    if anunciante_id:
        if not user:
            return jsonify({'message': 'Voce precisa estar autenticado.'}), 401
        if user['tipoUsuario'] != 'ADMIN' and user['id'] != anunciante_id:
            return jsonify({'message': 'Voce nao tem permissao para ver estes pedidos.'}), 403
        return jsonify(_svc.listar_por_anunciante(anunciante_id))

    if not user or user['tipoUsuario'] != 'ADMIN':
        return jsonify({'message': 'Acesso permitido apenas para administradores.'}), 403
    return jsonify(_svc.listar_todos())


@bp.post('/')
def criar():
    user = get_current_user()
    cliente_id = (request.json or {}).get('clienteId')
    forbidden = require_same_cliente_or_admin(cliente_id)
    if forbidden:
        return forbidden
    if user and user['tipoUsuario'] == 'ADMIN':
        return jsonify({'message': 'Administradores nao podem criar pedidos.'}), 403

    try:
        return jsonify(_svc.criar(request.json or {})), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@bp.get('/<int:id>')
def buscar(id):
    pedido = _svc.buscar_por_id(id)
    if not pedido:
        return jsonify({'message': f'Pedido nao encontrado: {id}'}), 404

    user = get_current_user()
    if not _can_access_pedido(user, pedido):
        return jsonify({'message': 'Voce nao tem permissao para ver este pedido.'}), 403

    return jsonify(pedido)


@bp.patch('/<int:id>/status')
def atualizar_status(id):
    pedido = _svc.buscar_por_id(id)
    if not pedido:
        return jsonify({'message': f'Pedido nao encontrado: {id}'}), 404

    user = get_current_user()
    if not _can_manage_pedido(user, pedido):
        return jsonify({'message': 'Voce nao pode decidir este pedido.'}), 403

    try:
        return jsonify(_svc.decidir(id, (request.json or {}).get('status')))
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@bp.post('/<int:id>/cancelar')
def cancelar(id):
    pedido = _svc.buscar_por_id(id)
    if not pedido:
        return jsonify({'message': f'Pedido nao encontrado: {id}'}), 404

    user = get_current_user()
    if not user or (user['tipoUsuario'] != 'ADMIN' and user['id'] != pedido['clienteId']):
        return jsonify({'message': 'Voce nao pode cancelar este pedido.'}), 403

    try:
        return jsonify(_svc.cancelar(id))
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@bp.delete('/<int:id>')
def deletar(id):
    pedido = _svc.buscar_por_id(id)
    if not pedido:
        return jsonify({'message': f'Pedido nao encontrado: {id}'}), 404

    user = get_current_user()
    if not user or user['tipoUsuario'] != 'ADMIN':
        return jsonify({'message': 'Apenas administradores podem excluir pedidos.'}), 403

    try:
        _svc.deletar(id)
        return '', 204
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
