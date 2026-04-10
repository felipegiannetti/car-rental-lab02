from flask import Flask
from flask_cors import CORS

from .config import Config
from .extensions import db


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r'/api/*': {'origins': '*'}})
    db.init_app(app)

    from .cliente.controller import bp as cliente_bp
    from .automovel.controller import bp as automovel_bp
    from .pedido.controller import bp as pedido_bp
    from .auth.controller import bp as auth_bp

    app.register_blueprint(cliente_bp)
    app.register_blueprint(automovel_bp)
    app.register_blueprint(pedido_bp)
    app.register_blueprint(auth_bp)

    with app.app_context():
        db.create_all()

    return app
