from flask import Blueprint, jsonify
from models import db, Student, Grade, Course
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
        results = []
        for grade in grades:
            course = Course.query.filter_by(course_id=grade.course_id).first()
            if course:
                results.append({"courseName": course.course_name, "courseCode": course.course_id, "finalGrade": grade.grade, "absences": []})
        return jsonify({"grades": results}), 200
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

        return jsonify({"first_name": student.first_name, "last_name": student.last_name, "email": student.email, "student_id": student.student_id, 
                        "class_name": student.class_name}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500