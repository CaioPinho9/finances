# schemas/historic.py

from pydantic_sqlalchemy import sqlalchemy_to_pydantic

from finance.historic.model.historic import Historic

# Read model (all fields)
HistoricAllFields = sqlalchemy_to_pydantic(Historic)

# Write/update model (exclude user)
HistoricUserless = sqlalchemy_to_pydantic(Historic, exclude=["user"])
