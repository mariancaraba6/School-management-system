import os
from datetime import timedelta
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS

from models import db, Account, Student, Grade, Course, Absence
from routes import jwt, student_bp, login_bp

app = Flask(__name__)
load_dotenv()
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

app.register_blueprint(login_bp, url_prefix='/api')
app.register_blueprint(student_bp, url_prefix='/api')

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt.init_app(app)

with app.app_context():
    db.drop_all()
    db.create_all()

    if not Account.query.first():  # Check if there are any accounts
        account1 = Account("carabinierii@gmail.com", "carab123%", "student")
        student1 = Student("Caraba", "Mirel", account1.email, "CRB06", "BSc CSE Y1")
        course1 = Course("MATH01", "Mathematics", "Basic mathematics course", 5)
        course2 = Course("INFO01", "Informatics", "Basic informatics course", 5)
        course3 = Course("ENGL01", "English", "Basic english course", 5)
        grade1 = Grade(student1.student_id, course1.course_id, 6.25, 0.50, "Midterm exam", 1, "2021-09-01")
        grade2 = Grade(student1.student_id, course1.course_id, 8.75, 0.50, "Final exam", 2, "2021-09-01")
        grade3 = Grade(student1.student_id, course2.course_id, 9.25, 0.30, "Midterm exam", 1, "2021-09-01")
        grade4 = Grade(student1.student_id, course2.course_id, 9.75, 0.20, "Project", 2, "2021-09-01")
        grade5 = Grade(student1.student_id, course2.course_id, 10.00, 0.50, "Final exam", 3, "2021-09-01")
        grade6 = Grade(student1.student_id, course3.course_id, 8.50, 1.00, "Final exam", 1, "2021-09-01")
        abscence1 = Absence(course1.course_id, student1.student_id, "2021-09-01")
        abscence2 = Absence(course1.course_id, student1.student_id, "2021-09-02")
        abscence3 = Absence(course1.course_id, student1.student_id, "2021-09-03")
        abscence4 = Absence(course2.course_id, student1.student_id, "2021-09-01")
        abscence5 = Absence(course2.course_id, student1.student_id, "2021-09-02")

        db.session.add(account1)
        db.session.add(student1)
        db.session.add_all([course1, course2, course3])
        db.session.add_all([grade1, grade2, grade3, grade4, grade5, grade6])
        db.session.add_all([abscence1, abscence2, abscence3, abscence4, abscence5])
        db.session.commit()


if __name__ == '__main__':
    app.run(debug=True)
