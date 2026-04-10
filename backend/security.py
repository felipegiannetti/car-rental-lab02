from flask import jsonify, request


def get_current_user():
    role = (request.headers.get('X-User-Role') or '').strip().upper()
    raw_id = (request.headers.get('X-User-Id') or '').strip()

    if not role or not raw_id:
        return None

    try:
        user_id = int(raw_id)
    except ValueError:
        return None

    return {
        'id': user_id,
        'tipoUsuario': role,
    }


def require_authenticated():
    user = get_current_user()
    if not user:
        return jsonify({'message': 'Voce precisa estar autenticado.'}), 401
    return None


def require_admin():
    user = get_current_user()
    if not user or user['tipoUsuario'] != 'ADMIN':
        return jsonify({'message': 'Acesso permitido apenas para administradores.'}), 403
    return None


def require_same_cliente_or_admin(cliente_id):
    user = get_current_user()
    if not user:
        return jsonify({'message': 'Voce precisa estar autenticado.'}), 401
    if user['tipoUsuario'] == 'ADMIN':
        return None
    if user['tipoUsuario'] != 'CLIENTE' or user['id'] != cliente_id:
        return jsonify({'message': 'Voce nao tem permissao para acessar este recurso.'}), 403
    return None


def require_admin_or_same_cliente(cliente_id):
    user = get_current_user()
    if not user:
        return jsonify({'message': 'Voce precisa estar autenticado.'}), 401
    if user['tipoUsuario'] == 'ADMIN':
        return None
    if cliente_id is None:
        return jsonify({'message': 'Apenas administradores podem alterar este recurso.'}), 403
    if user['tipoUsuario'] != 'CLIENTE' or user['id'] != cliente_id:
        return jsonify({'message': 'Voce nao tem permissao para alterar este recurso.'}), 403
    return None
