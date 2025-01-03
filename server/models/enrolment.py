from models.db import db

class Enrolment(db.Model):
    __tablename__ = 'enrolments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course_id = db.Column(db.String(10), nullable=False)
    student_id = db.Column(db.String(10), nullable=False)

    def __init__(self, course_id, student_id):
        self.course_id = course_id
        self.student_id = student_id