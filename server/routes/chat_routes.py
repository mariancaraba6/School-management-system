from flask import Blueprint, jsonify, request
from models import db, Account, Message, Student, Professor
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import or_

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat/messages', methods=['GET'])
@jwt_required()
def get_chat_messages():
    try:
        identity = get_jwt_identity()
        role = identity.split()[0]
        id = identity.split()[1]
        if role != "student" and role != "professor":
            return jsonify({"error": "Invalid role"}), 400

        if role == "student":
            student = Student.query.filter_by(student_id=id).first()
            if student is None:
                return jsonify({"error": "Student not found"}), 404
        if role == "professor":
            professor = Professor.query.filter_by(professor_id=id).first()
            if professor is None:
                return jsonify({"error": "Professor not found"}), 404
            
        all_messages = Message.query.filter(or_(Message.sender_id == id, Message.receiver_id == id)).order_by(Message.id).all()
        result = []

        all_students = Student.query.all()
        for student in all_students:
            if student.student_id == id:
                continue
            associated_messages = list(filter(lambda message: message.sender_id == student.student_id or message.receiver_id == student.student_id, all_messages))
            chat_obj = {}
            chat_obj["id"] = student.student_id
            chat_obj["name"] = f"{student.first_name} {student.last_name}"
            chat_obj["type"] = "student"
            chat_obj["messages"] = [{"sender_id": message.sender_id, "receiver_id": message.receiver_id, "message": message.message, "timestamp": message.timestamp} for message in associated_messages]
            result.append(chat_obj)

        all_professors = Professor.query.all()
        for professor in all_professors:
            if professor.professor_id == id:
                continue
            associated_messages = list(filter(lambda message: message.sender_id == professor.professor_id or message.receiver_id == professor.professor_id, all_messages))
            chat_obj = {}
            chat_obj["id"] = professor.professor_id
            chat_obj["name"] = f"{professor.first_name} {professor.last_name}"
            chat_obj["type"] = "professor"
            chat_obj["messages"] = [{"sender_id": message.sender_id, "receiver_id": message.receiver_id, "message": message.message, "timestamp": message.timestamp} for message in associated_messages]
            result.append(chat_obj)

        return jsonify({"chats": result}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    

@chat_bp.route('/chat/messages', methods=['POST'])
@jwt_required()
def send_message():
    try:
        identity = get_jwt_identity()
        role = identity.split()[0]
        id = identity.split()[1]
        if role != "student" and role != "professor":
            return jsonify({"error": "Invalid role"}), 400

        if role == "student":
            student = Student.query.filter_by(student_id=id).first()
            if student is None:
                return jsonify({"error": "Student not found"}), 404
        if role == "professor":
            professor = Professor.query.filter_by(professor_id=id).first()
            if professor is None:
                return jsonify({"error": "Professor not found"}), 404

        data = request.get_json()
        if "receiver_id" not in data or "message" not in data:
            return jsonify({"error": "Missing fields"}), 400
        receiver_id = data.get('receiver_id')
        message = data.get('message')

        new_message = Message(sender_id=id, receiver_id=receiver_id, message=message, timestamp=db.func.now())
        db.session.add(new_message)
        db.session.commit()
        return jsonify({"message": "Message sent"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500