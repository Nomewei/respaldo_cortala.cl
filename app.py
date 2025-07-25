import flask
from flask import send_from_directory
import mercadopago
import os
import json
import uuid
import gspread
from google.oauth2.service_account import Credentials
from cryptography.fernet import Fernet
from datetime import datetime
import pytz
import sendgrid
from sendgrid.helpers.mail import Mail

# --- CONFIGURACIÓN INICIAL ---

# Le decimos a Flask que nuestra "página web" (el frontend)
# está en la carpeta 'dist' que React crea para nosotros.
app = flask.Flask(__name__, static_folder='dist', static_url_path='/')

# --- El resto de la configuración que ya conoces ---
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
    else:
        print("ADVERTENCIA: Faltan variables de entorno para Google Sheets.")
except Exception as e:
    print(f"ERROR al configurar Google Sheets: {e}")

pending_orders = {}

# --- FUNCIONES AUXILIARES (Sin cambios) ---
def encrypt_data(data):
    if not fernet: return "ENCRYPTION_KEY_NOT_SET"
    return fernet.encrypt(json.dumps(data).encode('utf-8')).decode('utf-8')

def decrypt_data(encrypted_data):
    if not fernet: return None
    try:
        return json.loads(fernet.decrypt(encrypted_data.encode('utf-8')).decode('utf-8'))
    except Exception:
        return None

def send_confirmation_email(customer_email, data):
    pass # La lógica de SendGrid va aquí

# --- RUTAS DE LA API (Sin cambios) ---
@app.route("/create_preference", methods=["POST"])
def create_preference():
    try:
        data = flask.request.get_json()
        external_reference_id = str(uuid.uuid4())
        
        success_url = data.pop("back_urls", {}).get("success", f"{flask.request.host_url}?status=success")

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
            "back_urls": {"success": success_url},
            "auto_return": "approved",
            "notification_url": f"{flask.request.host_url}webhook"
        }
        
        preference_response = sdk.preference().create(preference_data)
        preference = preference_response["response"]
        return flask.jsonify({"init_point": preference["init_point"]})
    except Exception as e:
        print(f"Error en /create_preference: {e}")
        return flask.jsonify({"error": str(e)}), 500

@app.route("/webhook", methods=["POST"])
def receive_webhook():
    # La lógica del webhook va aquí
    return flask.Response(status=200)

# --- RUTA PARA SERVIR LA APP DE REACT ---
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# --- ARRANQUE ---
if __name__ == "__main__":
    app.run(port=5000, debug=False)
