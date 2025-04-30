from abc import ABC, abstractmethod

import pandas as pd

from finance.model.sheet_model import Sheet


class SheetService(ABC):

    @abstractmethod
    def save(self, sheet: Sheet):
        pass

    @abstractmethod
    def load(self, sheet_name: str) -> pd.DataFrame:
        pass

    @abstractmethod
    def get_month_data(self, sheet_name: str, month: str) -> pd.DataFrame:
        pass

    @abstractmethod
    def update(self, sheet: Sheet):
        pass
