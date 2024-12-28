from models.db import db

class Absence(db.Model):
    __tablename__ = 'absences'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course_id = db.Column(db.String(10), nullable=False)
    student_id = db.Column(db.String(10), nullable=False)
    date = db.Column(db.DateTime, server_default=db.func.now())
    motivated = db.Column(db.Boolean, nullable=False)

    def __init__(self, course_id, student_id, date, motivated):
        self.course_id = course_id
        self.student_id = student_id
        self.date = date
        self.motivated = motivated