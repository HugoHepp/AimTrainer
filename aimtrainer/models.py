from django.contrib.auth.models import AbstractUser
from django.contrib import admin
from django.db import models


class User(AbstractUser):
    pass

class Score(models.Model):
    player = models.CharField(max_length=10)
    score = models.SmallIntegerField(default=0)
    date =  models.DateField(auto_now_add=True)