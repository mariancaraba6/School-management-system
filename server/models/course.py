from models.db import db

class Course(db.Model):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course_id = db.Column(db.String(10), nullable=False)
    course_name = db.Column(db.String(100), nullable=False)
    course_description = db.Column(db.String(255), nullable=False)
    course_credits = db.Column(db.Integer, nullable=False)
    
    def __init__(self, course_id, course_name, course_description, course_credits):
        self.course_id = course_id
        self.course_name = course_name
        self.course_description = course_description
        self.course_credits = course_credits