import math
from flask import Blueprint, jsonify, request
from models import db, Account, Student, Professor, Course
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/student', methods=['POST'])
@jwt_required()
def create_student():
    try:
        identity = get_jwt_identity()
        role = identity.split()[0]
        if role != "admin":
            return jsonify({"error": "Invalid role"}), 400

        data = request.get_json()
        if "first_name" not in data or "last_name" not in data or "email" not in data or "password" not in data or "class_name" not in data or "student_id" not in data:
            return jsonify({"error": "Missing required fields"}), 400
        first_name = data["first_name"]
        last_name = data["last_name"]
        email = data["email"]
        password = data["password"]
        class_name = data["class_name"]
        student_id = data["student_id"]

        if len(first_name) == 0 or len(last_name) == 0 or len(email) == 0 or len(password) == 0 or len(class_name) == 0 or len(student_id) == 0:
            return jsonify({"error": "Empty fields"}), 400

        existing_account = Account.query.filter_by(email=email).first()
        if existing_account is not None:
            return jsonify({"error": "Email already exists"}), 400
        existing_student = Student.query.filter_by(student_id=student_id).first()
        if existing_student is not None:
            return jsonify({"error": "Student ID already exists"}), 400
        
        account = Account(email, password, "student")
        student = Student(first_name, last_name, email, student_id, class_name)
        db.session.add(account)
        db.session.add(student)
        db.session.commit()
        return jsonify({"message": "Student created successfully"}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    

@admin_bp.route('/admin/professor', methods=['POST'])
@jwt_required()
def create_professor():
    try:
        identity = get_jwt_identity()
        role = identity.split()[0]
        if role != "admin":
            return jsonify({"error": "Invalid role"}), 400

        data = request.get_json()
        if "first_name" not in data or "last_name" not in data or "email" not in data or "password" not in data or "professor_id" not in data:
            return jsonify({"error": "Missing required fields"}), 400
        first_name = data["first_name"]
        last_name = data["last_name"]
        email = data["email"]
        password = data["password"]
        professor_id = data["professor_id"]

        if len(first_name) == 0 or len(last_name) == 0 or len(email) == 0 or len(password) == 0 or len(professor_id) == 0:
            return jsonify({"error": "Empty fields"}), 400

        existing_account = Account.query.filter_by(email=email).first()
        if existing_account is not None:
            return jsonify({"error": "Email already exists"}), 400
        existing_professor = Professor.query.filter_by(professor_id=professor_id).first()
        if existing_professor is not None:
            return jsonify({"error": "Professor ID already exists"}), 400
        
        account = Account(email, password, "professor")
        professor = Professor(first_name, last_name, email, professor_id)
        db.session.add(account)
        db.session.add(professor)
        db.session.commit()
        return jsonify({"message": "Professor created successfully"}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    

def is_number(value):
    try:
        int(value)
        return True
    except ValueError:
        return False
    

@admin_bp.route('/admin/course', methods=['POST'])
@jwt_required()
def create_course():
    try:
        identity = get_jwt_identity()
        role = identity.split()[0]
        if role != "admin":
            return jsonify({"error": "Invalid role"}), 400
        
        data = request.get_json()
        if "course_id" not in data or "professor_id" not in data or "course_name" not in data or "course_description" not in data or "course_credits" not in data or "grade_components" not in data:
            return jsonify({"error": "Missing required fields"}), 400
        
        course_id = data["course_id"]
        professor_id = data["professor_id"]
        course_name = data["course_name"]
        course_description = data["course_description"]
        course_credits = data["course_credits"]
        grade_components = data["grade_components"]
        
        if len(course_id) == 0 or len(professor_id) == 0 or len(course_name) == 0 or len(course_description) == 0 or len(grade_components) == 0:
            return jsonify({"error": "Empty fields"}), 400
        if not is_number(course_credits):
            return jsonify({"error": "Invalid course credits"}), 400
        
        existing_course = Course.query.filter_by(course_id=course_id).first()
        if existing_course is not None:
            return jsonify({"error": "Course ID already exists"}), 400
        existing_professor = Professor.query.filter_by(professor_id=professor_id).first()
        if existing_professor is None:
            return jsonify({"error": "Professor not found"}), 404
        
        sum = 0
        for component in grade_components:
            if "name" not in component or "weight" not in component:
                return jsonify({"error": "Missing grade component fields"}), 400
            if not is_number(component["weight"]):
                return jsonify({"error": "Invalid grade component"}), 400
            if len(component["name"]) == 0:
                return jsonify({"error": "Empty grade component name"}), 400
            sum += int(component["weight"])
        
        if not math.isclose(sum, 100.0):
            return jsonify({"error": "Grade components do not sum up to 100"}), 400
        course = Course(course_id, professor_id, course_name, course_description, int(course_credits), [[int(component["weight"]) / 100, component["name"]] for component in grade_components])
        db.session.add(course)
        db.session.commit()
        return jsonify({"message": "Course created successfully"}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500