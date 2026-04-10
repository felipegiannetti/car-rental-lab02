from flask import Blueprint, jsonify, request

from .service import AuthService

bp = Blueprint('auth', __name__, url_prefix='/api/auth')
_svc = AuthService()


@bp.post('/login')
def login():
    data = request.json or {}
    user = _svc.autenticar(
        data.get('nomeUsuario', ''),
        data.get('senha', ''),
    )
    if user:
        return jsonify(user)
    return jsonify({'message': 'Usuário ou senha inválidos.'}), 401
