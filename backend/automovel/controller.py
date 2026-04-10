from flask import Blueprint, jsonify, request

from .service import AutomovelService

bp = Blueprint('automoveis', __name__, url_prefix='/api/automoveis')
_svc = AutomovelService()


@bp.get('/')
def listar():
    return jsonify(_svc.listar_todos())


@bp.post('/')
def criar():
    try:
        return jsonify(_svc.criar(request.json)), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@bp.get('/<int:id>')
def buscar(id):
    a = _svc.buscar_por_id(id)
    if a:
        return jsonify(a)
    return jsonify({'message': f'Automóvel não encontrado: {id}'}), 404


@bp.put('/<int:id>')
def atualizar(id):
    try:
        return jsonify(_svc.atualizar(id, request.json))
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@bp.delete('/<int:id>')
def deletar(id):
    try:
        _svc.deletar(id)
        return '', 204
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
