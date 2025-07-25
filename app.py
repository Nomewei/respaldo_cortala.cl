import flask
from flask import send_from_directory, request
import os
import mercadopago
import json
import uuid
import gspread
from google.oauth2.service_account import Credentials
from cryptography.fernet import Fernet
from datetime import datetime
import pytz
import sendgrid
from sendgrid.helpers.mail import Mail

app = flask.Flask(__name__, static_folder='dist', static_url_path='/')

# --- CONFIGURACIÓN (Como en tu versión original) ---
mp_token = os.environ.get("MERCADOPAGO_TOKEN")
sdk = mercadopago.SDK(mp_token) if mp_token else None
encryption_key = os.environ.get("ENCRYPTION_KEY")
fernet = Fernet(encryption_key.encode()) if encryption_key else None
worksheet = None
try:
    creds_json_str = os.environ.get('GOOGLE_CREDENTIALS_JSON')
    sheet_url = os.environ.get('GOOGLE_SHEET_URL')
    if creds_json_str and sheet_url:
        creds_info = json.loads(creds_json_str)
        scopes = ['https://www.googleapis.com/auth/spreadsheets']
        creds = Credentials.from_service_account_info(creds_info, scopes=scopes)
        gc = gspread.authorize(creds)
        spreadsheet = gc.open_by_url(sheet_url)
        worksheet = spreadsheet.sheet1
except Exception as e:
    print(f"ERROR al configurar Google Sheets: {e}")

pending_orders = {}

# --- RUTAS DE LA API ---
@app.route("/create_preference", methods=["POST"])
def create_preference():
    try:
        data = flask.request.get_json()
        external_reference_id = str(uuid.uuid4())
        
        # Guardamos los datos temporalmente
        pending_orders[external_reference_id] = {
            "contacts": data.get("contacts_to_protect", []),
            "payer_firstname": data.get("payer_firstname"),
            "payer_lastname": data.get("payer_lastname"),
            "price": data.get("price"),
            "referral_code_used": data.get("referral_code")
        }

        preference_data = {
            "external_reference": external_reference_id,
            "items": [{"title": data["title"], "quantity": 1, "unit_price": float(data["price"]), "currency_id": "CLP"}],
            "payer": {"first_name": data["payer_firstname"], "last_name": data["payer_lastname"]},
            "back_urls": {"success": f"{flask.request.host_url}?status=success"},
            "auto_return": "approved",
            "notification_url": f"{flask.request.host_url}webhook"
        }
        
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]
        return flask.jsonify({"init_point": preference["init_point"]})
    except Exception as e:
        return flask.jsonify({"error": str(e)}), 500

@app.route("/webhook", methods=["POST"])
def receive_webhook():
    # Dejamos la lógica completa del webhook para la Fase 2 de automatización
    print("Webhook recibido")
    return flask.Response(status=200)

# --- RUTA PARA SERVIR LA APP DE REACT ---
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(port=5000)
