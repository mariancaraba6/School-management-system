from flask import Blueprint, request, jsonify
from models import Student, db

# Create a Blueprint for student-related routes
student_bp = Blueprint('student', __name__)

@student_bp.route('/add_student', methods=['POST'])
def add_student():
    try:
        # Get data from the request
        data = request.json
        username = data['username']
        password = data['password']
        age = data['age']

        # Validate inputs
        if not username or not password or not isinstance(age, int):
            return jsonify({"error": "Invalid input"}), 400

        # Create a new student record
        new_student = Student(username=username, password=password, age=age)
        db.session.add(new_student)
        db.session.commit()

        return jsonify({"message": "Student added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@student_bp.route('/home', methods=['GET'])
def home():
    return jsonify({'cartof': 'maricel'}), 200