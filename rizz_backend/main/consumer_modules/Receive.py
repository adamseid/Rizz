from . import Misc
from ..models import Connections
from .receive import HandleIncommingMessage

FILE_NAME = 'Receive'
DEBUG = True


def run(self, data):
    FUNCTION_NAME = 'run'
    Misc.printDebug(FILE_NAME, FUNCTION_NAME, 'STARTED', DEBUG)

    if data['request'] == "connect":
        room_group_name = self.room_group_name
        conn = Connections(
            wallet_address=data['walletAddress'],
            room_group_name=room_group_name,
        )
        conn.save()

    if (data['request'] == "chat"):
        HandleIncommingMessage.run(self, data)

    Misc.printDebug(FILE_NAME, FUNCTION_NAME, 'FINISHED', DEBUG)
