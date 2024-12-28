from models.db import db

class Admin(db.Model):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    admin_id = db.Column(db.String(10), nullable=False)

    def __init__(self, first_name, last_name, email, admin_id):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.admin_id = admin_id
