from models.db import db

class Grade(db.Model):
    __tablename__ = 'grades'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.String(10), nullable=False)
    course_id = db.Column(db.String(10), nullable=False)
    grade = db.Column(db.Float, nullable=False)
    percentage = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(100), nullable=False)
    index = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, server_default=db.func.now())

    def __init__(self, student_id, course_id, grade, percentage, description, index, date):
        self.student_id = student_id
        self.course_id = course_id
        self.grade = grade
        self.percentage = percentage
        self.description = description
        self.index = index
        self.date = date