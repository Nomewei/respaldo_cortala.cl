import flask
from flask import send_from_directory
import os

app = flask.Flask(__name__, static_folder='dist')

# Esta es la ruta para la API que tu frontend llama
@app.route("/create_preference", methods=["POST"])
def create_preference():
    # La lógica de Mercado Pago irá aquí en el futuro.
    # Por ahora, devolvemos una respuesta simulada.
    return flask.jsonify({"init_point": "https://www.mercadopago.cl/checkout/v1/redirect?pref_id=TEST-ID"})

# Esta ruta "catch-all" sirve tu aplicación de React
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(port=5000)
