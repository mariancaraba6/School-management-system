import os
from datetime import timedelta
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS

from models import db, Account, Student, Grade, Course, Absence, Professor, Enrolment, Admin, Message
from routes import jwt, student_bp, login_bp, professor_bp, chat_bp, admin_bp

app = Flask(__name__)
load_dotenv()
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

app.register_blueprint(login_bp, url_prefix='/api')
app.register_blueprint(student_bp, url_prefix='/api')
app.register_blueprint(professor_bp, url_prefix='/api')
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt.init_app(app)

with app.app_context():
    db.drop_all()
    db.create_all()

    if not Account.query.first():  # Check if there are any accounts
        account0 = Account("MOL01", "molnar@admin.com", "molmol123", "admin")
        account1 = Account("CRB06", "carabinierii@gmail.com", "carab123%", "student")
        account2 = Account("SND01", "sandor_niko@eminescusm.ro", "niko123", "professor")
        account3 = Account("MHD07", "misha7@gmail.com", "fcsb#123", "student")
        account4 = Account("VLD08", "vldvld@gmail.com", "vld123", "student")
        account5 = Account("GRO09", "grigory@gmail.com", "grigri123", "student")

        admin1 = Admin("Molnar", "Mock", account0.email, account0.account_id)

        student1 = Student("Caraba", "Mirel", account1.email, account1.account_id, "BSc CSE Y1", "https://scontent.ftsr1-1.fna.fbcdn.net/v/t1.6435-1/34398662_1679208785528166_2251903043224207360_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=e99d92&_nc_ohc=-7V_4n7-I9gQ7kNvgES2ATK&_nc_zt=24&_nc_ht=scontent.ftsr1-1.fna&_nc_gid=AhpQRj26YtJfYEgmJ1Y6MQP&oh=00_AYDYzLDVK05X1FTEMxEnVj3SYCNgLa4bNEqx_zdTCN_L9Q&oe=67991CFC")
        student2 = Student("Misha", "David", account3.email, account3.account_id, "BSc CSE Y1", "https://scontent.ftsr1-2.fna.fbcdn.net/v/t39.30808-6/463085582_2806213079547883_1965533098475735546_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=qnCKNoaHNhMQ7kNvgFeIF7w&_nc_zt=23&_nc_ht=scontent.ftsr1-2.fna&_nc_gid=AJsGGMh0ghDNusCmXhieuMb&oh=00_AYAG2yTZKUDpDZFuCklfMYoxcR1DWm-D3O3fPYe9xtbZDA&oe=67763254")
        student3 = Student("Vlad", "Roatis", account4.email, account4.account_id, "BSc CSE Y1", "https://media.licdn.com/dms/image/v2/D4E03AQEMDtR0xzmUag/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709290818424?e=1741219200&v=beta&t=xMgWAHs3E2Mc67_fgW4wv9AihiKySo7tIFEkCf2ruac")
        student4 = Student("Grigory", "Octav", account5.email, account5.account_id, "BSc CSE Y1")
        professor1 = Professor("Sandor", "Nicolae", account2.email, account2.account_id)
        
        course1 = Course("MATH01", professor1.professor_id, "Mathematics", "Basic mathematics course", 5, [[1.00, "Final exam"]])
        course2 = Course("PHYS01", professor1.professor_id, "Physics", "Basic physics course", 5, [[0.30, "Assignment"], [0.70, "Final exam"]])
        course3 = Course("INFO01", professor1.professor_id, "Informatics", "Basic informatics course", 5, [[0.30, "Midterm exam"], [0.20, "Project"], [0.50, "Final exam"]])
        course4 = Course("English", professor1.professor_id, "English", "Basic english course", 5, [[0.40, "Assignment"], [0.60, "Final exam"]])
        course5 = Course("Chemistry", professor1.professor_id, "Chemistry", "Basic chemistry course", 5, [[0.30, "Midterm exam"], [0.70, "Final exam"]])

        enrolment1 = Enrolment(course1.course_id, student1.student_id)
        enrolment2 = Enrolment(course2.course_id, student1.student_id)
        enrolment3 = Enrolment(course3.course_id, student1.student_id)
        enrolment4 = Enrolment(course1.course_id, student2.student_id)
        enrolment5 = Enrolment(course2.course_id, student2.student_id)
        enrolment6 = Enrolment(course1.course_id, student3.student_id)
        enrolment7 = Enrolment(course3.course_id, student3.student_id)
        enrolment8 = Enrolment(course2.course_id, student4.student_id)
        enrolment9 = Enrolment(course3.course_id, student4.student_id)

        grade1 = Grade(student1.student_id, course1.course_id, 8.75, 0, "2021-09-01")
        grade2 = Grade(student1.student_id, course2.course_id, 8.50, 0, "2021-09-01")
        grade3 = Grade(student1.student_id, course3.course_id, 9.25, 0, "2021-09-01")
        grade4 = Grade(student1.student_id, course3.course_id, 9.75, 1, "2021-09-01")
        grade5 = Grade(student1.student_id, course3.course_id, 10.00, 2, "2021-09-01")

        grade6 = Grade(student2.student_id, course1.course_id, 9.00, 0, "2021-09-01")
        grade7 = Grade(student2.student_id, course2.course_id, 9.50, 0, "2021-09-01")

        grade8 = Grade(student3.student_id, course3.course_id, 9.00, 0, "2021-09-01")
        grade9 = Grade(student3.student_id, course3.course_id, 9.50, 1, "2021-09-01")

        grade10 = Grade(student4.student_id, course2.course_id, 9.00, 0, "2021-09-01")
        grade11 = Grade(student4.student_id, course3.course_id, 9.50, 0, "2021-09-01")

        abscence1 = Absence(course1.course_id, student1.student_id, "2021-09-01", True)
        abscence2 = Absence(course1.course_id, student1.student_id, "2021-09-02", False)
        abscence3 = Absence(course1.course_id, student1.student_id, "2021-09-03", True)
        abscence4 = Absence(course2.course_id, student1.student_id, "2021-09-01", False)
        abscence5 = Absence(course2.course_id, student1.student_id, "2021-09-02", True)

        message1 = Message(student1.student_id, professor1.professor_id, "Hello, professor!", "2021-09-01")
        message2 = Message(professor1.professor_id, student1.student_id, "Hello, student!", "2021-09-01")
        message3 = Message(student1.student_id, professor1.professor_id, "Catoffelsalad?", "2021-09-02")

        db.session.add_all([account0, account1, account2, account3, account4, account5])
        db.session.add_all([admin1])
        db.session.add_all([student1, student2, student3, student4])
        db.session.add_all([professor1])
        db.session.add_all([enrolment1, enrolment2, enrolment3, enrolment4, enrolment5, enrolment6, enrolment7, enrolment8, enrolment9])
        db.session.add_all([course1, course2, course3, course4, course5])
        db.session.add_all([grade1, grade2, grade3, grade4, grade5, grade6, grade7, grade8, grade9, grade10, grade11])
        db.session.add_all([abscence1, abscence2, abscence3, abscence4, abscence5])
        db.session.add_all([message1, message2, message3])

        db.session.add(account2)
        db.session.add(professor1)

        db.session.commit()


if __name__ == '__main__':
    app.run(debug=True)
