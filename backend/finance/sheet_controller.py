from io import StringIO

import pandas as pd
from fastapi import HTTPException

from finance.model.sheet_model import Sheet


class SheetController:
    def __init__(self, sheet_service):
        self.sheet_service = sheet_service

    def upload_csv(self, file):
        content = file.read()
        df = pd.read_csv(StringIO(content.decode('utf-8')))
        df.rename(columns=Sheet.CSV_HEADER_MAP, inplace=True)
        if not all(field in df.columns for field in Sheet.REQUIRED_FIELDS):
            raise HTTPException(status_code=400, detail="Missing required CSV fields.")
        sheet = Sheet(sheet_name=Sheet.HISTORIC_SHEET_NAME, data=df)
        self.sheet_service.update(sheet)

    def get_month_data(self, month):
        data = self.sheet_service.get_month_data(Sheet.HISTORIC_SHEET_NAME, month)
        if data.empty:
            raise HTTPException(status_code=404, detail="No data found for the specified month.")
        return data
