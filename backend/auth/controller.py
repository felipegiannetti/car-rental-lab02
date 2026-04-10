from flask import Blueprint, jsonify, request

from ..cliente.service import ClienteService

bp = Blueprint('auth', __name__, url_prefix='/api/auth')
_svc = ClienteService()


@bp.post('/login')
def login():
    data = request.json or {}
    user = _svc.verificar_credenciais(
        data.get('nomeUsuario', ''),
        data.get('senha', ''),
    )
    if user:
        return jsonify(user)
    return jsonify({'message': 'Usuário ou senha inválidos.'}), 401
