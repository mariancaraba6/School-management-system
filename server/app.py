import os
from datetime import timedelta
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS

from models import db, Account, Student, Grade
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
        account1 = Account("carabinierii@gmail.com", "123456", "student")
        student1 = Student("Caraba", "Mirel", account1.email, "CRB06")
        grade1 = Grade(student1.student_id, "MATH01", "6.25")
        grade2 = Grade(student1.student_id, "INFO01", "9.75")
        db.session.add(account1)
        db.session.add(student1)
        db.session.add(grade1)
        db.session.add(grade2)
        db.session.commit()


if __name__ == '__main__':
    app.run(debug=True)
