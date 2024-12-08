from flask import Blueprint, jsonify, request
from models import db, Account, Student
from flask_jwt_extended import create_access_token

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
            token = create_access_token(identity=student.student_id)
            return jsonify({"token": token}), 200
        
        return jsonify({"error": "Invalid role"}), 400

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500