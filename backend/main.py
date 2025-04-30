from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

from finance.enum.month import Month
from finance.google_sheet_service import GoogleSheetService
from finance.sheet_controller import SheetController

sheet_service = GoogleSheetService()
sheet_controller = SheetController(sheet_service)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...)):
    try:
        sheet_controller.upload_csv(file)
        return {"status": "CSV file uploaded successfully."}
    except Exception as e:
        return {"error": str(e)}

@app.get("/data/{month}")
async def get_data(month: str):
    try:
        if not Month.is_valid(month):
            return {"error": "Invalid month provided."}
        data = sheet_controller.get_month_data(month)
        if data.empty:
            return {"error": "No data found for the specified month."}
        return data
    except Exception as e:
        return {"error": str(e)}

@app.post("/categorize/")
async def categorize(uuid: str = Form(...), category: str = Form(...)):
    pass

@app.get("/categories/")
async def categories():
    pass
