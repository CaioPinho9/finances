import pandas as pd
from auth import get_gspread_client
from finance.model.sheet_model import Sheet
from finance.sheet_service import SheetService

SPREADSHEET_NAME = 'BankExtractData'

class GoogleSheetService(SheetService):
    def __init__(self):
        self.client = get_gspread_client()
        self.spreadsheet = self.client.open(SPREADSHEET_NAME)

    def save(self, sheet: Sheet):
        sheet = self.spreadsheet.worksheet(sheet.name)
        sheet.clear()
        sheet.update([sheet.data.columns.values.tolist()] + sheet.data.values.tolist())

    def load(self, sheet_name: str) -> pd.DataFrame:
        sheet = self.spreadsheet.worksheet(sheet_name)
        data = pd.DataFrame(sheet.get_all_records())
        return data

    def get_month_data(self, sheet_name: str, month: str) -> pd.DataFrame:
        data = self.load(sheet_name)
        data['date'] = pd.to_datetime(data['date'])
        month_data = data[data['date'].dt.month == int(month)]
        return month_data

    def update(self, sheet: Sheet):
        existing_data = self.load(sheet.name)
        updated_data = pd.concat([existing_data, sheet.data]).drop_duplicates(subset=['uuid'], keep='last')
        self.save(updated_data, sheet.name)
