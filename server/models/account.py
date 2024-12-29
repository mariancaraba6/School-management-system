import random
from models.db import db
import pyotp
import os

class Account(db.Model):
    __tablename__ = 'accounts'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    account_id = db.Column(db.String(10), nullable=False, unique=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    secret_token = db.Column(db.String(100), nullable=True)
    is_two_factor_authentication_enabled = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, account_id, email, password, role):
        self.account_id = account_id
        self.email = email
        self.password = password
        self.role = role
        self.secret_token = pyotp.random_base32()

    def get_authentication_setup_uri(self):
        return pyotp.totp.TOTP(self.secret_token).provisioning_uri(
            name=self.email, issuer_name=os.getenv("APP_NAME"))
    
    def is_otp_valid(self, user_otp):
        totp = pyotp.parse_uri(self.get_authentication_setup_uri())
        return totp.verify(user_otp)