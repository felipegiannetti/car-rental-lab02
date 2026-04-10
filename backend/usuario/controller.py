from flask import Blueprint, jsonify, request

from ..security import require_admin
from .service import UsuarioService

bp = Blueprint('usuarios', __name__, url_prefix='/api/usuarios')
_svc = UsuarioService()


@bp.get('/')
def listar():
    forbidden = require_admin()
    if forbidden:
        return forbidden
    return jsonify(_svc.listar_todos())


@bp.post('/')
def criar():
    forbidden = require_admin()
    if forbidden:
        return forbidden
    try:
        return jsonify(_svc.criar(request.json or {})), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@bp.get('/<tipo>/<int:id>')
def buscar(tipo, id):
    forbidden = require_admin()
    if forbidden:
        return forbidden
    usuario = _svc.buscar(tipo, id)
    if usuario:
        return jsonify(usuario)
    return jsonify({'message': 'Usuario nao encontrado.'}), 404


@bp.put('/<tipo>/<int:id>')
def atualizar(tipo, id):
    forbidden = require_admin()
    if forbidden:
        return forbidden
    try:
        return jsonify(_svc.atualizar(tipo, id, request.json or {}))
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@bp.delete('/<tipo>/<int:id>')
def deletar(tipo, id):
    forbidden = require_admin()
    if forbidden:
        return forbidden
    try:
        _svc.deletar(tipo, id)
        return '', 204
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
