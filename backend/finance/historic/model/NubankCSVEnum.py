from enum import Enum

from finance.historic.model.historic import HistoricColumnsEnum


class NubankCSVEnum(Enum):
    DATE = "Data"
    DESCRIPTION = "Descrição"
    AMOUNT = "Valor"
    UUID = "Identificador"

    @classmethod
    def relationship_historic(cls):
        return {
            cls.DATE.value: HistoricColumnsEnum.DATE.value,
            cls.DESCRIPTION.value: HistoricColumnsEnum.DESCRIPTION_BANK.value,
            cls.AMOUNT.value: HistoricColumnsEnum.AMOUNT.value,
            cls.UUID.value: HistoricColumnsEnum.UUID.value,
        }
