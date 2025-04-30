from fastapi import Depends, FastAPI, File, HTTPException, Header, UploadFile, Form
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

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")
    token = authorization.replace("Bearer ", "")
    return verify_google_token(token)

@app.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...), user=Depends(get_current_user)):
    try:
        sheet_controller.upload_csv(file)
        return {"status": "CSV file uploaded successfully."}
    except Exception as e:
        return {"error": str(e)}

@app.get("/data/{month}")
async def get_data(month: str, user=Depends(get_current_user)):
    try:
        if not Month.is_valid(month):
            return {"error": "Invalid month provided."}
        data = sheet_controller.get_month_data(month)
        if data.empty:
            return {"error": "No data found for the specified month."}
        return data
    except Exception as e:
        return {"error": str(e)}

@app.post("/categorize/", user=Depends(get_current_user))
async def categorize(uuid: str = Form(...), category: str = Form(...)):
    pass

@app.get("/categories/", user=Depends(get_current_user))
async def categories():
    pass
