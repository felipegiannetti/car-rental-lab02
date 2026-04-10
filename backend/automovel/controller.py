import io

from flask import Blueprint, jsonify, request, send_file

from ..security import get_current_user, require_admin_or_same_cliente, require_authenticated
from .service import AutomovelService

bp = Blueprint('automoveis', __name__, url_prefix='/api/automoveis')
_svc = AutomovelService()


@bp.get('/')
def listar():
    return jsonify(_svc.listar_todos())


@bp.post('/')
def criar():
    forbidden = require_authenticated()
    if forbidden:
        return forbidden
    try:
        return jsonify(_svc.criar(request.json or {}, get_current_user())), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@bp.get('/<int:id>')
def buscar(id):
    automovel = _svc.buscar_por_id(id)
    if automovel:
        return jsonify(automovel)
    return jsonify({'message': f'Automovel nao encontrado: {id}'}), 404


@bp.get('/<int:id>/foto')
def foto(id):
    result = _svc.buscar_foto(id)
    if not result:
        return '', 404
    data, tipo = result
    return send_file(io.BytesIO(data), mimetype=tipo, max_age=3600)


@bp.put('/<int:id>')
def atualizar(id):
    automovel = _svc.buscar_modelo(id)
    if not automovel:
        return jsonify({'message': f'Automovel nao encontrado: {id}'}), 404

    forbidden = require_admin_or_same_cliente(automovel.anunciante_id)
    if forbidden:
        return forbidden

    try:
        return jsonify(_svc.atualizar(id, request.json or {}))
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@bp.delete('/<int:id>')
def deletar(id):
    automovel = _svc.buscar_modelo(id)
    if not automovel:
        return jsonify({'message': f'Automovel nao encontrado: {id}'}), 404

    forbidden = require_admin_or_same_cliente(automovel.anunciante_id)
    if forbidden:
        return forbidden
    try:
        _svc.deletar(id)
        return '', 204
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
