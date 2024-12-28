from flask import Blueprint, jsonify, request
from models import db, Professor, Course, Enrolment, Grade, Student, Absence
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date

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
        role = identity.split()[0]
        professor_id = identity.split()[1]
        if role != "professor":
            return jsonify({"error": "Invalid role"}), 400

        professor = Professor.query.filter_by(professor_id=professor_id).first()
        if professor is None:
            return jsonify({"error": "Professor not found"}), 404
        
        courses = Course.query.filter_by(professor_id=professor.professor_id).all()
        result = {}
        for course in courses:
            obj = {}
            obj["courseName"] = course.course_name
            obj["courseCode"] = course.course_id
            obj["courseDescription"] = course.course_description
            obj["courseCredits"] = course.course_credits

            enroled_students = Enrolment.query.filter_by(course_id=course.course_id).all()
            obj["enroledStudents"] = []
            for enrolment in enroled_students:
                student = Student.query.filter_by(student_id=enrolment.student_id).first()
                grades = Grade.query.filter_by(student_id=student.student_id, course_id=course.course_id).all()
                index_to_grade = {}
                for grade in grades:
                    index_to_grade[grade.index] = grade
                student_obj = {}
                student_obj["studentId"] = student.student_id
                student_obj["studentFirstName"] = student.first_name
                student_obj["studentLastName"] = student.last_name
                student_grades = []
                for i in range(len(course.grade_components)):
                    component = {}
                    component["description"] = course.grade_components[i][1]
                    component["percentage"] = course.grade_components[i][0]
                    component["index"] = i
                    if i in index_to_grade:
                        grade = index_to_grade[i]
                        component["grade"] = grade.grade
                        component["date"] = grade.date
                    else:
                        component["grade"] = 0
                        component["date"] = "null"
                    student_grades.append(component)
                student_obj["grades"] = student_grades

                absences = Absence.query.filter_by(student_id=student.student_id, course_id=course.course_id).order_by(Absence.date).all()
                student_obj["absences"] = [{"id": absence.id, "date": absence.date, "motivated": absence.motivated}  for absence in absences]

                obj["enroledStudents"].append(student_obj)

            result[course.course_id] = obj

        return jsonify({"courses": result}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


@professor_bp.route('/professor/grades', methods=['POST'])
@jwt_required()
def post_professor_grades():
    try:
        identity = get_jwt_identity()
        role = identity.split()[0]
        professor_id = identity.split()[1]
        if role != "professor":
            return jsonify({"error": "Invalid role"}), 400

        data = request.get_json()
        if "studentId" not in data or "courseId" not in data or "grades" not in data:
            return jsonify({"error": "Invalid request fields"}), 400
        student_id = data["studentId"]
        course_id = data["courseId"]
        grades = data["grades"]

        professor = Professor.query.filter_by(professor_id=professor_id).first()
        if professor is None:
            return jsonify({"error": "Professor not found"}), 404
        course = Course.query.filter_by(course_id=course_id).first()
        if course is None:
            return jsonify({"error": "Course not found"}), 404
        if course.professor_id != professor.professor_id:
            return jsonify({"error": "Course not assigned to professor"}), 400
        
        student = Student.query.filter_by(student_id=student_id).first()
        if student is None:
            return jsonify({"error": "Student not found"}), 404
        enrolment = Enrolment.query.filter_by(student_id=student.student_id, course_id=course.course_id).first()
        if enrolment is None:
            return jsonify({"error": "Student not enroled in course"}), 400
        
        current_grades = Grade.query.filter_by(student_id=student.student_id, course_id=course.course_id).all()
        index_to_grade = {}
        for grade in current_grades:
            index_to_grade[grade.index] = grade

        for grade in grades:
            if grade["grade"] < 0 or grade["grade"] > 10:
                return jsonify({"error": "Invalid grade"}), 400
            if grade["index"] not in index_to_grade:
                if grade["grade"] == 0:
                    continue
                new_grade = Grade(student.student_id, course.course_id, grade["grade"], grade["index"], date.today())
                db.session.add(new_grade)
            else:
                if grade["grade"] == 0:
                    db.session.delete(index_to_grade[grade["index"]])
                elif index_to_grade[grade["index"]].grade != grade["grade"]:
                    current_grade = index_to_grade[grade["index"]]
                    current_grade.grade = grade["grade"]
                    current_grade.date = date.today()
        db.session.commit()
        return jsonify({"message": "Grades updated"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
        

@professor_bp.route('/professor/absences', methods=['POST'])
@jwt_required()
def post_professor_absences():
    try:
        identity = get_jwt_identity()
        role = identity.split()[0]
        professor_id = identity.split()[1]
        if role != "professor":
            return jsonify({"error": "Invalid role"}), 400

        data = request.get_json()
        if "studentId" not in data or "courseId" not in data or "absences" not in data:
            return jsonify({"error": "Invalid request fields"}), 400
        
        student_id = data["studentId"]
        course_id = data["courseId"]
        absences = data["absences"]

        professor = Professor.query.filter_by(professor_id=professor_id).first()
        if professor is None:
            return jsonify({"error": "Professor not found"}), 404
        course = Course.query.filter_by(course_id=course_id).first()
        if course is None:
            return jsonify({"error": "Course not found"}), 404
        if course.professor_id != professor.professor_id:
            return jsonify({"error": "Course not assigned to professor"}), 400
        
        enrolment = Enrolment.query.filter_by(student_id=student_id, course_id=course.course_id).first()
        if enrolment is None:
            return jsonify({"error": "Student not enroled in course"}), 400
        
        current_absences = Absence.query.filter_by(student_id=student_id, course_id=course_id).all()
        id_to_absence = {absence.id: absence for absence in current_absences}

        for absence in absences:
            if "id" in absence:
                if absence["id"] not in id_to_absence:
                    return jsonify({"error": "Invalid absence id"}), 400
                if absence["motivated"] not in [True, False]:
                    return jsonify({"error": "Invalid absence motivated field"}), 400
                if absence["motivated"] != id_to_absence[absence["id"]].motivated:
                    id_to_absence[absence["id"]].motivated = absence["motivated"]
            else:
                new_absence = Absence(course.course_id, student_id, date.today(), False)
                db.session.add(new_absence)
        db.session.commit()

        return jsonify({"message": "Absence registered"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    

