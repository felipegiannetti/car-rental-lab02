from flask import Flask
from flask_cors import CORS
from sqlalchemy import inspect, text

from .config import Config
from .extensions import db


def _ensure_legacy_schema():
    inspector = inspect(db.engine)
    table_names = inspector.get_table_names()

    if 'clientes' in table_names:
        cliente_columns = {column['name'] for column in inspector.get_columns('clientes')}
        cliente_statements = []
        if 'email' not in cliente_columns:
            cliente_statements.append("ALTER TABLE clientes ADD COLUMN email VARCHAR(255)")
        if 'telefone' not in cliente_columns:
            cliente_statements.append("ALTER TABLE clientes ADD COLUMN telefone VARCHAR(30)")
        for statement in cliente_statements:
            db.session.execute(text(statement))
    if 'automoveis' in table_names:
        automovel_columns = {column['name'] for column in inspector.get_columns('automoveis')}
        automovel_statements = []
        if 'anunciante_id' not in automovel_columns:
            automovel_statements.append("ALTER TABLE automoveis ADD COLUMN anunciante_id INTEGER")
        if 'foto' not in automovel_columns:
            automovel_statements.append("ALTER TABLE automoveis ADD COLUMN foto BLOB")
        if 'foto_tipo' not in automovel_columns:
            automovel_statements.append("ALTER TABLE automoveis ADD COLUMN foto_tipo VARCHAR(100)")
        if 'quilometragem' not in automovel_columns:
            automovel_statements.append("ALTER TABLE automoveis ADD COLUMN quilometragem INTEGER DEFAULT 0")
        if 'status_anuncio' not in automovel_columns:
            automovel_statements.append("ALTER TABLE automoveis ADD COLUMN status_anuncio VARCHAR(30) DEFAULT 'DISPONIVEL'")
        if 'aceita_aluguel' not in automovel_columns:
            automovel_statements.append("ALTER TABLE automoveis ADD COLUMN aceita_aluguel BOOLEAN DEFAULT 1")
        if 'aceita_compra' not in automovel_columns:
            automovel_statements.append("ALTER TABLE automoveis ADD COLUMN aceita_compra BOOLEAN DEFAULT 1")
        for statement in automovel_statements:
            db.session.execute(text(statement))
        if 'status_anuncio' in {column['name'] for column in inspect(db.engine).get_columns('automoveis')}:
            db.session.execute(text("UPDATE automoveis SET status_anuncio = 'DISPONIVEL' WHERE status_anuncio IS NULL"))
        if 'quilometragem' in {column['name'] for column in inspect(db.engine).get_columns('automoveis')}:
            db.session.execute(text("UPDATE automoveis SET quilometragem = 0 WHERE quilometragem IS NULL"))
        automovel_columns = {column['name'] for column in inspect(db.engine).get_columns('automoveis')}
        if 'aceita_aluguel' in automovel_columns:
            db.session.execute(text("UPDATE automoveis SET aceita_aluguel = 1 WHERE aceita_aluguel IS NULL"))
        if 'aceita_compra' in automovel_columns:
            db.session.execute(text("UPDATE automoveis SET aceita_compra = 1 WHERE aceita_compra IS NULL"))

    if 'pedidos' in table_names:
        pedido_columns = {column['name'] for column in inspector.get_columns('pedidos')}
        pedido_statements = []
        if 'tipo_pedido' not in pedido_columns:
            pedido_statements.append("ALTER TABLE pedidos ADD COLUMN tipo_pedido VARCHAR(20) DEFAULT 'ALUGUEL'")
        if 'data_atualizacao' not in pedido_columns:
            pedido_statements.append("ALTER TABLE pedidos ADD COLUMN data_atualizacao DATETIME")
        for statement in pedido_statements:
            db.session.execute(text(statement))
        pedido_columns = {column['name'] for column in inspect(db.engine).get_columns('pedidos')}
        if 'tipo_pedido' in pedido_columns:
            db.session.execute(text("UPDATE pedidos SET tipo_pedido = 'ALUGUEL' WHERE tipo_pedido IS NULL"))
        if 'data_atualizacao' in pedido_columns:
            db.session.execute(text("UPDATE pedidos SET data_atualizacao = COALESCE(data_atualizacao, data_criacao)"))

    db.session.commit()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r'/api/*': {'origins': '*'}})
    db.init_app(app)

    from .cliente.controller import bp as cliente_bp
    from .automovel.controller import bp as automovel_bp
    from .pedido.controller import bp as pedido_bp
    from .auth.controller import bp as auth_bp
    from .usuario.controller import bp as usuario_bp
    from .admin.model import Admin
    from .auth.service import AuthService

    app.register_blueprint(cliente_bp)
    app.register_blueprint(automovel_bp)
    app.register_blueprint(pedido_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(usuario_bp)

    with app.app_context():
        _ = Admin
        db.create_all()
        _ensure_legacy_schema()
        AuthService().garantir_admin_padrao()

    return app
