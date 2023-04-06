from . import Misc
from transformers import AutoTokenizer, AutoModelForCausalLM
import requests
import time

FILE_NAME = 'Receive'
DEBUG = True
FUNCTION_NAME = 'HANDLE INDIVIDUAL MESSAGE'

def run(self, data):
    room_group_name = self.room_group_name
    most_recent_message = data['message']
    message_details = {
        "userId" : room_group_name,
        "message": most_recent_message
    }
    response = requests.post(
        'https://toshi-bot-szrrxcceiq-ez.a.run.app/chat', 
        json = message_details
    )

    if (response.status_code == 200):
        response_JSON = response.json()
        self.send(text_data=  response_JSON['response'])
    else:
        self.send(text_data = "Oops, something went wrong. Please re-send your message")

    Misc.printDebug(FILE_NAME, FUNCTION_NAME, 'FINISHED', DEBUG)
