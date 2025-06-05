from enum import Enum

from sqlalchemy import Column, String, Float, Integer, Date

from finance.historic.model.base import Base


class HistoricColumnsEnum(Enum):
    UUID = 'uuid'
    DATE = 'date'
    AMOUNT = 'amount'
    DESCRIPTION_BANK = 'description_bank'
    DESCRIPTION_CUSTOM = 'description_custom'


class Historic(Base):
    __tablename__ = 'tb_historic'
    uuid = Column(String, primary_key=True)
    date = Column(Date)
    user = Column(Integer)
    amount = Column(Float)
    description_bank = Column(String)
    description_custom = Column(String, nullable=True)

    def __init__(self, uuid, date, amount, description_bank, description_custom, user=1, **kw):
        super().__init__(**kw)
        self.uuid = uuid
        self.date = date
        self.amount = amount
        self.description_bank = description_bank
        self.description_custom = description_custom
        self.user = user
