from models.db import db

class Grade(db.Model):
    __tablename__ = 'grades'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.String(10), nullable=False)
    course_id = db.Column(db.String(10), nullable=False)
    grade = db.Column(db.String(4), nullable=False)

    def __init__(self, student_id, course_id, grade):
        self.student_id = student_id
        self.course_id = course_id
        self.grade = grade