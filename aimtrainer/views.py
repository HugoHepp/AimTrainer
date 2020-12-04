from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ScoreSerializer
from .models import Score
from django.contrib.auth.models import User
from datetime import date


# Main Page
def index(request):
    return render(request, "aimtrainer/index.html")

# Scoreboard Page
def scoreboard(request):
    today = date.today()
    today_scores = Score.objects.filter(date__year=today.year, date__month=today.month, date__day=today.day).order_by('-score')[:5]
    thismonth_scores = Score.objects.filter(date__year=today.year, date__month=today.month).order_by('-score')[:5]
    thisyear_scores = Score.objects.filter(date__year=today.year).order_by('-score')[:5]
    alltime_scores = Score.objects.all().order_by('-score')[:5]


    return render(request, "aimtrainer/scoreboard.html", {"alltime_score" : alltime_scores,"today_scores" : today_scores,"thismonth_scores" : thismonth_scores, "thisyear_scores" : thisyear_scores, "alltime_scores" : alltime_scores })

 # ====== API ====== #
 
@api_view(['GET'])
def highscores(request):
    # return best 5 highscores
    highscores = Score.objects.all().order_by('-score')[:5]
    serializer = ScoreSerializer(highscores, many=True) 
    return Response(serializer.data)

@api_view(['POST'])
def send_score(request):

    # save score
    data = request.data
    player = data['player']
    print(player)
    if player == "":
        player = "anonyme"
    score = data['score']
    newscore = Score(player=player, score=score)
    newscore.save()
    return JsonResponse("saved", safe=False)

@api_view(['GET'])
def add_rival(request, username):
    
    # get best score of player 
    rival_score = Score.objects.filter(player = username).order_by('-score')[:1]
    serializer = ScoreSerializer(rival_score,many=True) 
    return Response(serializer.data)



    


    

















# ======= REG/LOGIN ========#

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "aimtrainer/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "aimtrainer/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "aimtrainer/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "aimtrainer/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "aimtrainer/register.html")
