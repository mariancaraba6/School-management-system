from flask import Blueprint, jsonify
from models import db, Student, Grade, Course, Absence, Enrolment
from flask_jwt_extended import jwt_required, get_jwt_identity

student_bp = Blueprint('student', __name__)

@student_bp.route('/student/grades', methods=['GET'])
@jwt_required()
def get_student_grades():
    try:
        identity = get_jwt_identity()
        role = identity.split()[0]
        student_id = identity.split()[1]
        if role != "student":
            return jsonify({"error": "Invalid role"}), 400

        student = Student.query.filter_by(student_id=student_id).first()
        if student is None:
            return jsonify({"error": "Student not found"}), 404

        all_grades = Grade.query.filter_by(student_id=student.student_id).all()
        enroled_courses = Enrolment.query.filter_by(student_id=student.student_id).all()
        all_absences = Absence.query.filter_by(student_id=student.student_id).order_by(Absence.date).all()
        result = []
        for enrolment in enroled_courses:
            grades_for_course = list(filter(lambda grade: grade.course_id == enrolment.course_id, all_grades))
            id_to_grade = {grade.index: (grade.grade, grade.date) for grade in grades_for_course}
            absences_for_course = list(filter(lambda absence: absence.course_id == enrolment.course_id, all_absences))
            course = Course.query.filter_by(course_id=enrolment.course_id).first()
            if course:
                result.append({"courseName": course.course_name, 
                                "courseCode": course.course_id, 
                                "grades": [{"grade": id_to_grade[index][0] if (index in id_to_grade) else "null", 
                                            "percentage": component[0], 
                                            "description": component[1], 
                                            "index": index, 
                                            "date": id_to_grade[index][1] if (index in id_to_grade) else "null"} for index, component in enumerate(course.grade_components)], 
                                "absences": [{"date": absence.date} for absence in absences_for_course]})
        return jsonify({"courses": result}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    

@student_bp.route('/student/details', methods=['GET'])
@jwt_required()
def get_student_details():
    try:
        identity = get_jwt_identity()
        role = identity.split()[0]
        student_id = identity.split()[1]
        if role != "student":
            return jsonify({"error": "Invalid role"}), 400

        student = Student.query.filter_by(student_id=student_id).first()
        if student is None:
            return jsonify({"error": "Student not found"}), 404

        return jsonify({"first_name": student.first_name, "last_name": student.last_name, "email": student.email, "student_id": student.student_id, 
                        "class_name": student.class_name}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500