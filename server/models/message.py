from models.db import db

class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sender_id = db.Column(db.String(10), nullable=False)
    receiver_id = db.Column(db.String(10), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    def __init__(self, sender_id, receiver_id, message, timestamp):
        self.sender_id = sender_id
        self.receiver_id = receiver_id
        self.message = message
        self.timestamp = timestamp
