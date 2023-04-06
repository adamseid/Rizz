import json
from .consumer_modules import Receive, Disconnect
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class MainConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.room_name = self.scope['client'][0] + '-' + str(self.scope['client'][1])
        self.room_group_name = "frontend_%s" % self.room_name

    def receive(self, text_data):
        print('WebSocket.receive(): STARTED')
        text_data = json.loads(text_data)
        Receive.run(self,text_data)
        print('WebSocket.receive(): ENDED')


    def disconnect(self, close_code):
        print('FontendConsumer.disconnect(): STARTED')
        Disconnect.run(self)
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
        print('FontendConsumer.disconnect(): FINISHED')