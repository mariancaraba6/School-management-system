from flask import Blueprint, jsonify, request
from models import db, Account, Student, Professor, Admin
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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
            token = create_access_token(identity=f"{account.role} {student.student_id}")
            return jsonify({"token": token}), 200
        
        if account.role == "professor":
            professor = Professor.query.filter_by(email=account.email).first()
            if professor is None:
                return jsonify({"error": "Professor not found"}), 404
            token = create_access_token(identity=f"{account.role} {professor.professor_id}")
            return jsonify({"token": token}), 200
        
        if account.role == "admin":
            admin = Admin.query.filter_by(email=account.email).first()
            if admin is None:
                return jsonify({"error": "Admin not found"}), 404
            token = create_access_token(identity=f"{account.role} {admin.admin_id}")
            return jsonify({"token": token}), 200
        
        return jsonify({"error": "Invalid role"}), 400

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