from ..extensions import db
from .model import Automovel


class AutomovelService:
    """Lógica de negócio do módulo de automóveis."""

    def listar_todos(self):
        return [a.to_dict() for a in Automovel.query.all()]

    def buscar_por_id(self, id):
        a = db.session.get(Automovel, id)
        return a.to_dict() if a else None

    def criar(self, data):
        placa = self._normalizar_placa(data.get('placa', ''))
        if Automovel.query.filter_by(placa=placa).first():
            raise ValueError(f"Placa já cadastrada: {data.get('placa')}")
        a = Automovel()
        self._preencher(a, data)
        db.session.add(a)
        db.session.commit()
        return a.to_dict()

    def atualizar(self, id, data):
        a = db.session.get(Automovel, id)
        if not a:
            raise ValueError(f'Automóvel não encontrado: {id}')
        placa = self._normalizar_placa(data.get('placa', ''))
        if a.placa != placa and Automovel.query.filter(
            Automovel.placa == placa, Automovel.id != id
        ).first():
            raise ValueError('Placa já cadastrada para outro automóvel.')
        self._preencher(a, data)
        db.session.commit()
        return a.to_dict()

    def deletar(self, id):
        a = db.session.get(Automovel, id)
        if not a:
            raise ValueError(f'Automóvel não encontrado: {id}')
        db.session.delete(a)
        db.session.commit()

    def _preencher(self, a, data):
        a.matricula = data['matricula']
        a.ano = int(data['ano'])
        a.marca = data['marca']
        a.modelo = data['modelo']
        a.placa = self._normalizar_placa(data.get('placa', ''))
        a.disponivel = data.get('disponivel', True)

    def _normalizar_placa(self, v):
        return v.upper().strip()
