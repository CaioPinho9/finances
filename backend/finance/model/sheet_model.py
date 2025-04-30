import pandas as pd


class Sheet:
    CSV_HEADER_MAP = {'date': 'date', 'amount': 'amount', 'description': 'description', 'uuid': 'uuid'}
    REQUIRED_FIELDS = ['date', 'amount', 'description', 'uuid']

    HISTORIC_SHEET_NAME = 'Historic'
    CATEGORIES_SHEET_NAME = 'Categories'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._sheet_name = kwargs.get('sheet_name', None)
        if self._sheet_name is None:
            raise ValueError("Sheet name must be provided.")
        self._data = None

    @property
    def name(self):
        return self._sheet_name

    @name.setter
    def name(self, value):
        if not isinstance(value, str):
            raise ValueError("Sheet name must be a string.")
        self._sheet_name = value

    @property
    def data(self):
        if self._data is None:
            raise ValueError("Data has not been loaded yet.")
        return self._data

    @data.setter
    def data(self, value):
        if not isinstance(value, pd.DataFrame):
            raise ValueError("Data must be a pandas DataFrame.")
        self._data = value
