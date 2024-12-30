from flask import Blueprint, jsonify, request
from models import db, Account, Student, Professor, Admin
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import InputRequired, Length
import jwt
import time
import os
import pyotp

from io import BytesIO
from base64 import b64encode
import qrcode

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        account = Account.query.filter_by(email=email).first()
        if account is None:
            return jsonify({"error": "Account not found"}), 404
        if account.password != password:
            return jsonify({"error": "Invalid password"}), 400
        
        if account.role == "student":
            student = Student.query.filter_by(email=account.email).first()
            if student is None:
                return jsonify({"error": "Student not found"}), 404
        
        if account.role == "professor":
            professor = Professor.query.filter_by(email=account.email).first()
            if professor is None:
                return jsonify({"error": "Professor not found"}), 404
        
        if account.role == "admin":
            admin = Admin.query.filter_by(email=account.email).first()
            if admin is None:
                return jsonify({"error": "Admin not found"}), 404
            
        if account.role not in ["student", "professor", "admin"]:
            return jsonify({"error": "Invalid role"}), 400
        
        if not account.is_two_factor_authentication_enabled:
            token = create_access_token(identity=f"{account.role} {account.account_id}")
            return jsonify({"token": token}), 200
        
        temp_token = jwt.encode({"account_id": account.account_id, "exp": time.time() + 300}, os.getenv("JWT_2FA_SECRET_KEY"), algorithm="HS256")
        return jsonify({"message": "Two factor authentication is enabled", "temp_token": temp_token}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    

@login_bp.route('/verify-account', methods=['GET'])
@jwt_required()
def verify_account():
    try:
        identity = get_jwt_identity()
        role = identity.split()[0]
        id = identity.split()[1]

        if role == "student":
            student = Student.query.filter_by(student_id=id).first()
            if student:
                return jsonify({"message": "Account is valid", "role": role, "id": id}), 200
            
        if role == "professor":
            professor = Professor.query.filter_by(professor_id=id).first()
            if professor:
                return jsonify({"message": "Account is valid", "role": role, "id": id}), 200
            
        if role == "admin":
            admin = Admin.query.filter_by(admin_id=id).first()
            if admin:
                return jsonify({"message": "Account is valid", "role": role, "id": id}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Invalid account"}), 400


def get_b64encoded_qr_image(data):
    print(data)
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color='black', back_color='white')
    buffered = BytesIO()
    img.save(buffered)
    return b64encode(buffered.getvalue()).decode("utf-8")


@login_bp.route('/setup-create-authenticator', methods=['GET'])
@jwt_required()
def setup_two_factor_auth():
    try:
        identity = get_jwt_identity()
        account_id = identity.split()[1]
        current_user = Account.query.filter_by(account_id=account_id).first()
        if current_user is None:
            return jsonify({"error": "Account not found"}), 404

        secret = current_user.secret_token
        uri = current_user.get_authentication_setup_uri()
        base64_qr_image = get_b64encoded_qr_image(uri)
        return jsonify({"secret": secret, "qr_image": base64_qr_image}), 200 
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    

class TwoFactorForm(FlaskForm):
    otp = StringField('Enter OTP', validators=[
                      InputRequired(), Length(min=6, max=6)])


@login_bp.route("/setup-verify-otp", methods=["GET", "POST"])
@jwt_required()
def verify_two_factor_auth():
    try:
        identity = get_jwt_identity()
        account_id = identity.split()[1]
        current_user = Account.query.filter_by(account_id=account_id).first()
        if current_user is None:
            return jsonify({"error": "Account not found"}), 404

        data = request.get_json()
        if "otp" not in data:
            return jsonify({"error": "OTP is required"}), 400
        otp = data.get("otp")
        print(otp)
        if current_user.is_otp_valid(otp):
            if not current_user.is_two_factor_authentication_enabled:
                current_user.is_two_factor_authentication_enabled = True
                db.session.commit()
            return jsonify({"message": "OTP is valid"}), 200
        else:
            return jsonify({"error": "Invalid OTP"}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    

@login_bp.route('/login-verify-otp', methods=['POST'])
def login_verify_otp():
    try:
        data = request.get_json()
        print(data)
        if "temp_token" not in data:
            return jsonify({"error": "Temp token is required"}), 400
        if "otp" not in data:
            return jsonify({"error": "OTP is required"}),
        
        temp_token = data.get("temp_token")
        otp = data.get("otp")
        try:
            payload = jwt.decode(temp_token, os.getenv("JWT_2FA_SECRET_KEY"), algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"status": "error", "error": "Temporary token expired"}), 401
        
        account_id = payload.get("account_id")
        current_user = Account.query.filter_by(account_id=account_id).first()
        if current_user is None:
            return jsonify({"error": "Account not found"}), 404
        
        totp = pyotp.TOTP(current_user.secret_token)
        if not totp.verify(otp):
            return jsonify({"status": "error", "error": "Invalid OTP"}), 401

        token = create_access_token(identity=f"{current_user.role} {current_user.account_id}")
        return jsonify({"token": token}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
