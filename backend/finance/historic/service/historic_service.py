import pandas as pd
from sqlalchemy.orm import Session

from finance.historic.model.historic import Historic, HistoricColumnsEnum
from finance.historic.schemas.schemas import HistoricUserless


class HistoricService:
    def __init__(self, db: Session, engine):
        self.db = db
        self.engine = engine

    def check_existing_primary_keys(self, keys: list[str]) -> list[str]:
        rows = self.db.query(Historic.uuid).filter(Historic.uuid.in_(keys)).all()
        return [row.uuid for row in rows]

    def bulk_insert(self, data: pd.DataFrame):
        data[HistoricColumnsEnum.DATE.value] = pd.to_datetime(data[HistoricColumnsEnum.DATE.value], format='%d/%m/%Y', errors='coerce').dt.date
        records = data.to_dict(orient='records')

        # Remove existing UUIDs
        existing_uuids = self.check_existing_primary_keys(data[HistoricColumnsEnum.UUID.value].tolist())
        new_records = [r for r in records if r[HistoricColumnsEnum.UUID.value] not in existing_uuids]

        # Remove when description is Pagamento de fatura
        new_records = [r for r in new_records if r[HistoricColumnsEnum.DESCRIPTION_BANK.value] != 'Pagamento de fatura']

        if new_records:
            self.db.bulk_insert_mappings(Historic, new_records)
            self.db.commit()
        return new_records

    def get_by_date(self, date: str) -> list[dict]:
        # Convert date string to datetime.date
        start_date = pd.to_datetime(date, format='%m-%Y').date()
        end_date = start_date + pd.DateOffset(months=1)

        query = (
            self.db.query(Historic.uuid, Historic.date, Historic.amount, Historic.description_bank, Historic.description_custom)
            .filter(Historic.date >= start_date, Historic.date < end_date)
            .all()
        )

        return [HistoricUserless.from_orm(record) for record in query]

    def update(self, historic: HistoricUserless):
        # Assuming the update method is implemented in HistoricService
        existing_record = self.db.query(Historic).filter(Historic.uuid == historic.uuid).first()
        if not existing_record:
            return None

        # Update fields
        if historic.date is not None:
            existing_record.date = historic.date
        if historic.amount is not None:
            existing_record.amount = historic.amount
        if historic.description_bank is not None:
            existing_record.description_bank = historic.description_bank
        if historic.description_custom is not None:
            existing_record.description_custom = historic.description_custom
        self.db.merge(existing_record)
        self.db.commit()
        return existing_record
