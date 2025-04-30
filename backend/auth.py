import os
from dotenv import load_dotenv
from google.oauth2 import service_account
import gspread
from google.oauth2 import id_token
from google.auth.transport import requests

load_dotenv()

# Access variables
client_id = os.getenv("GOOGLE_CLIENT_ID")
service_account_path = os.getenv("SERVICE_ACCOUNT_FILE")

SERVICE_ACCOUNT_FILE = 'service_account.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']

def get_gspread_client():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    return gspread.authorize(creds)

def verify_google_token(token: str):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        # ID token is valid. Return user info
        return {
            "user_id": idinfo["sub"],
            "email": idinfo["email"],
            "name": idinfo.get("name"),
            "picture": idinfo.get("picture"),
        }
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid ID token")