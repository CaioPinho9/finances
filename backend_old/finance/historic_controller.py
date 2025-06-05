from io import StringIO

import pandas as pd
from fastapi import HTTPException

from finance.historic.model.NubankCSVEnum import NubankCSVEnum
from finance.historic.schemas.schemas import HistoricUserless
from finance.historic.service.historic_service import HistoricService


class HistoricController:
    def __init__(self, historic_service: HistoricService):
        self._historic_service = historic_service

    def save_historic(self, content: bytes):
        df = pd.read_csv(StringIO(content.decode('utf-8')))
        df.columns = df.columns.str.strip()
        df = df.rename(columns=NubankCSVEnum.relationship_historic())
        df['user'] = 1
        self._historic_service.bulk_insert(df)

    def get_by_date(self, date: str) -> list[dict]:
        # Check date format
        try:
            pd.to_datetime(date, format='%m-%Y')
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use MM-YYYY.")

        data = self._historic_service.get_by_date(date)
        if not data:
            raise HTTPException(status_code=404, detail="No data found for the specified month.")
        return data

    def update(self, historic: HistoricUserless):
        if not historic.uuid:
            raise HTTPException(status_code=400, detail="UUID is required for updating historic entry.")

        updated_historic = self._historic_service.update(historic)
        if not updated_historic:
            raise HTTPException(status_code=404, detail="Historic entry not found for the given UUID.")

        return updated_historic
