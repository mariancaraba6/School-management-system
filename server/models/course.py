from models.db import db
from sqlalchemy.dialects.postgresql import JSONB

class Course(db.Model):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course_id = db.Column(db.String(10), nullable=False)
    professor_id = db.Column(db.String(10), nullable=False)
    course_name = db.Column(db.String(100), nullable=False)
    course_description = db.Column(db.String(255), nullable=False)
    course_credits = db.Column(db.Integer, nullable=False)
    grade_components = db.Column(JSONB, nullable=False)
    
    def __init__(self, course_id, professor_id, course_name, course_description, course_credits, grade_components):
        self.course_id = course_id
        self.professor_id = professor_id
        self.course_name = course_name
        self.course_description = course_description
        self.course_credits = course_credits
        self.grade_components = grade_components