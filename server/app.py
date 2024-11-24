from flask import Flask
from config import Config
from models import db, Student
from routes import student_bp

app = Flask(__name__)

app.config.from_object(Config)
app.register_blueprint(student_bp)
db.init_app(app)

with app.app_context():
    db.create_all()

    if not Student.query.first():  # Check if there are any students
        default_student = Student(username="default_user", password="password123", age=20)
        db.session.add(default_student)
        db.session.commit()
        print("Default student created.")

if __name__ == '__main__':
    app.run(debug=True)