from ..views_modules import Misc
from ..models import LeaderBoard
from datetime import datetime
import time

FILE_NAME = 'Personal Score'
DEBUG = True

monthNames = {
    "01": "Jan",
    "02": "Feb",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "Aug",
    "09": "Sept",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
}

def run(walletAddress,score):
    FUNCTION_NAME = 'run'

    Misc.printDebug(FILE_NAME, FUNCTION_NAME, 'STARTED', DEBUG)
    currentTime = int(time.time())
    score = LeaderBoard(wallet_address= walletAddress, timestamp= currentTime, score = (score*100))
    score.save()
    Misc.printDebug(FILE_NAME, FUNCTION_NAME, 'FINISHED', DEBUG)
