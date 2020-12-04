
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("highscores", views.highscores, name="highscores"),
    path("send_score", views.send_score, name="send_score"),
    path("add_rival/<str:username>", views.add_rival, name="add_rival"),
    path("scoreboard", views.scoreboard, name="scoreboard")
]
