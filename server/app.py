import os
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS

from models import db, Account
from routes import student_bp, login_bp

app = Flask(__name__)
load_dotenv()
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

app.register_blueprint(login_bp, url_prefix='/api')

with app.app_context():
    db.create_all()

    if not Account.query.first():  # Check if there are any accounts
        account1 = Account("carabinierii@gmail.com", "123456", "admin")
        account2 = Account("student@misulache.com", "123456", "student")
        account3 = Account("professor@vladutz.com", "123456", "professor")
        db.session.add(account1)
        db.session.add(account2)
        db.session.add(account3)
        db.session.commit()


if __name__ == '__main__':
    app.run(debug=True)
