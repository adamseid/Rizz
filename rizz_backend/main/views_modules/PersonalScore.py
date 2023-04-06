from ..views_modules import Misc
from ..models import LeaderBoard
from datetime import datetime

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

def run(walletAddress):
    FUNCTION_NAME = 'run'

    Misc.printDebug(FILE_NAME, FUNCTION_NAME, 'STARTED', DEBUG)
    personalScore = LeaderBoard.objects.filter(wallet_address=walletAddress).order_by('timestamp')
    scoreBoard = []
    totalScore = 0
    for scores in  personalScore:
        date = unixTimeStampToDateTime(scores.timestamp)
        score = scores.score
        totalScore = totalScore + score
        dailyScore = [date,score]
        scoreBoard.append(dailyScore)
    Misc.printDebug(FILE_NAME, FUNCTION_NAME, 'FINISHED', DEBUG)
    return({"scoreBoard" : scoreBoard, "totalScore" : totalScore})


def unixTimeStampToDateTime(unix):
    month = monthNames[datetime.fromtimestamp(int(unix)).strftime('%m')]
    year = datetime.fromtimestamp(int(unix)).strftime('%Y')
    date = datetime.fromtimestamp(int(unix)).strftime('%d')
    fullDate = month + " " + date + ", " + year 
    return fullDate