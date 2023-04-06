from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import HttpResponse, JsonResponse
from .views_modules import Leaderboard, PersonalScore, AddScore

# Create your views here.


@api_view(['GET', 'POST'])
def personalScore(request):
    if request.method == 'POST':
        walletAddress = request.data['walletAddress']
        scoreHistory = PersonalScore.run(walletAddress)
        return (JsonResponse({"profile_response": scoreHistory}))


@api_view(['GET', 'POST'])
def leaderboard(request):
    if request.method == 'GET':
        leaderboard = Leaderboard.run()
        return (JsonResponse({"profile_response": leaderboard}))

@api_view(['POST'])
def addScore(request):
    if request.method == 'POST':
        walletAddress = request.data['walletAddress']
        score = request.data['score']
        AddScore.run(walletAddress,score)
        return (JsonResponse({"profile_response": "success"}))
