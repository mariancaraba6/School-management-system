from models.db import db

class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    student_id = db.Column(db.String(10), nullable=False)
    class_name = db.Column(db.String(50), nullable=False)

    def __init__(self, first_name, last_name, email, student_id, class_name):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.student_id = student_id
        self.class_name = class_name