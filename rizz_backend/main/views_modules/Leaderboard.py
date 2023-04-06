from ..views_modules import Misc
from ..models import LeaderBoard
from django.db.models import Sum
from django.db.models import Count


FILE_NAME = 'Leaderboard'
DEBUG = True

def run():
    FUNCTION_NAME = 'run'
    Misc.printDebug(FILE_NAME, FUNCTION_NAME, 'STARTED', DEBUG)
    leaderboard = (LeaderBoard.objects.values('wallet_address').annotate(totalSum=Sum('score')).order_by('-totalSum')[:20])
    leaderboardIds = []
    for walletAddress in leaderboard:
        individalWallet = {
            "userid": walletAddress["wallet_address"],
            "score": walletAddress["totalSum"],
        }
        leaderboardIds.append(individalWallet)
    Misc.printDebug(FILE_NAME, FUNCTION_NAME, 'FINISHED', DEBUG)
    return leaderboardIds
