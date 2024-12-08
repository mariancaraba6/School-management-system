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
        student1 = Student(username='Carabinier', password='1234', age=20)
        student2 = Student(username='Misulache', password='4321', age=21)
        student3 = Student(username='Vladutz', password='4567', age=22)
        db.session.add(student1)
        db.session.add(student2)
        db.session.add(student3)
        db.session.commit()


if __name__ == '__main__':
    app.run(debug=True)