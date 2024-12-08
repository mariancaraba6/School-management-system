from flask import Blueprint, jsonify, request
from models import db, Account

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        account = Account.query.filter_by(username=username).first()
        if account is None:
            return jsonify({"error": "Account not found"}), 404
        if account.password != password:
            return jsonify({"error": "Invalid password"}), 400
        return jsonify({"role": account.role}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500