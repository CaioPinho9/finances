from sqlalchemy import Integer, String, Column

from finance.historic.model.base import Base


class Category(Base):
    __tablename__ = 'tb_category'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)

    def __init__(self, name: str, description: str = None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.name = name
        self.description = description
