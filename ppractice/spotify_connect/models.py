from enum import unique
from os import access
from pyexpat import model
from django.db import models

# Create your models here.


class SpotifyToken(models.Model):
    user = models.CharField(unique=True, max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)
