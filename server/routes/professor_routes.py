from flask import Blueprint, jsonify
from models import db, Professor, Course, Enrolment, Grade, Student
from flask_jwt_extended import jwt_required, get_jwt_identity

professor_bp = Blueprint('professor', __name__)


@professor_bp.route('/professor/details', methods=['GET'])
@jwt_required()
def get_professor_details():
    try:
        identity = get_jwt_identity()
        role = identity.split()[0]
        professor_id = identity.split()[1]
        if role != "professor":
            return jsonify({"error": "Invalid role"}), 400
        
        print(professor_id)

        professor = Professor.query.filter_by(professor_id=professor_id).first()
        if professor is None:
            return jsonify({"error": "Professor not found"}), 404

        return jsonify({"first_name": professor.first_name, "last_name": professor.last_name, "email": professor.email, "professor_id": professor.professor_id}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    

@professor_bp.route('/professor/courses', methods=['GET'])
@jwt_required()
def get_professor_courses():
    try:
        identity = get_jwt_identity()
        print(identity)
        role = identity.split()[0]
        professor_id = identity.split()[1]
        if role != "professor":
            return jsonify({"error": "Invalid role"}), 400

        professor = Professor.query.filter_by(professor_id=professor_id).first()
        if professor is None:
            return jsonify({"error": "Professor not found"}), 404
        
        courses = Course.query.filter_by(professor_id=professor.professor_id).all()
        result = []
        for course in courses:
            obj = {}
            obj["courseName"] = course.course_name
            obj["courseCode"] = course.course_id
            obj["courseDescription"] = course.course_description
            obj["courseCredits"] = course.course_credits
            obj["gradeComponents"] = course.grade_components

            enroled_students = Enrolment.query.filter_by(course_id=course.course_id).all()
            obj["enroledStudents"] = []
            for enrolment in enroled_students:
                student = Student.query.filter_by(student_id=enrolment.student_id).first()
                grades = Grade.query.filter_by(student_id=student.student_id, course_id=course.course_id).all()
                student_obj = {}
                student_obj["studentId"] = student.student_id
                student_obj["studentFirstName"] = student.first_name
                student_obj["studentLastName"] = student.last_name
                student_grades = []
                for grade in grades:
                    student_grades.append({"grade": grade.grade, "date": grade.date, "index": grade.index})
                student_obj["grades"] = student_grades
                obj["enroledStudents"].append(student_obj)

            result.append(obj)

        return jsonify({"courses": result}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
