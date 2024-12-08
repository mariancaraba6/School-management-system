from models.db import db

class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)

    def __init__(self, username, password, age):
        self.username = username
        self.password = password
        self.age = age

    def serialize(self):
        """
        Serializes the object to a dictionary so it can be returned as JSON.
        """
        return {
            'id': self.id,
            'username': self.username,
            'age': self.age
        }