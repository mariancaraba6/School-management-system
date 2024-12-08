from flask import Blueprint, jsonify
from models import db, Student

student_bp = Blueprint('student', __name__)

@student_bp.route('/student/<int:id>', methods=['GET'])
def get_student(id):
    try:
        print("GET /student/<id> route")
        student = Student.query.get(id)
        if student is None:
            return jsonify({"error": "Student not found"}), 404

        return jsonify(student.serialize()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

