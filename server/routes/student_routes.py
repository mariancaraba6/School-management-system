from flask import Blueprint, jsonify
from models import db, Student, Grade
from flask_jwt_extended import jwt_required, get_jwt_identity

student_bp = Blueprint('student', __name__)

@student_bp.route('/student/grades', methods=['GET'])
@jwt_required()
def get_student_grades():
    try:
        student_id = get_jwt_identity()
        student = Student.query.filter_by(student_id=student_id).first()
        if student is None:
            return jsonify({"error": "Student not found"}), 404

        grades = Grade.query.filter_by(student_id=student.student_id).all()
        return jsonify({"grades": [(grade.course_id, grade.grade) for grade in grades]}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    

@student_bp.route('/student/details', methods=['GET'])
@jwt_required()
def get_student_details():
    try:
        student_id = get_jwt_identity()
        student = Student.query.filter_by(student_id=student_id).first()
        if student is None:
            return jsonify({"error": "Student not found"}), 404

        return jsonify({"first_name": student.first_name, "last_name": student.last_name, "email": student.email, "student_id": student.student_id}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500