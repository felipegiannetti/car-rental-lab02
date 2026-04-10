import io

from flask import Blueprint, jsonify, request, send_file

from .service import ClienteService

bp = Blueprint('clientes', __name__, url_prefix='/api/clientes')
_svc = ClienteService()


@bp.get('/')
def listar():
    return jsonify(_svc.listar_todos())


@bp.post('/')
def criar():
    try:
        return jsonify(_svc.criar(request.json)), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400


@bp.get('/buscar-cpf/<cpf>')
def buscar_por_cpf(cpf):
    c = _svc.buscar_por_cpf(cpf)
    if c:
        return jsonify({'encontrado': True, 'id': c['id'], 'nome': c['nome']})
    return jsonify({'encontrado': False})


@bp.get('/<int:id>')
def buscar(id):
    c = _svc.buscar_por_id(id)
    if c:
        return jsonify(c)
    return jsonify({'message': f'Cliente não encontrado: {id}'}), 404


@bp.get('/<int:id>/foto')
def get_foto(id):
    result = _svc.buscar_foto(id)
    if not result:
        return '', 404
    data, tipo = result
    return send_file(io.BytesIO(data), mimetype=tipo, max_age=3600)


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
