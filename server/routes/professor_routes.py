from flask import Blueprint, jsonify
from models import db, Professor
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