from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from finance.historic.database.sqlalchemy import engine, SessionLocal
from finance.historic.model.historic import Base
from finance.historic.schemas.schemas import HistoricUserless
from finance.historic.service.historic_service import HistoricService
from finance.historic_controller import HistoricController

Base.metadata.create_all(bind=engine)
db = SessionLocal()

historic_service = HistoricService(db, engine)
historic_controller = HistoricController(historic_service)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/historic")
async def save_historic(file: UploadFile = File(...)):
    try:
        content = await file.read()
        historic_controller.save_historic(content)
        return {"status": "CSV file uploaded successfully."}
    except Exception as e:
        return {"error": str(e)}


@app.get("/api/historic/date/{date}")
async def get_data(date: str):
    try:
        return historic_controller.get_by_date(date)
    except Exception as e:
        return {"error": str(e)}

@app.put("/api/historic")
async def update_historic(historic: HistoricUserless):
    try:
        # Assuming the update method is implemented in HistoricService
        historic_controller.update(historic)
        return {"status": "Historic entry updated successfully."}
    except Exception as e:
        return {"error": str(e)}
