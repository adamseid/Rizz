from django.db import models

# Create your models here.


class Connections(models.Model):
    wallet_address = models.CharField(max_length=50)
    room_group_name = models.CharField(max_length=50)
    messages = models.CharField(max_length=50)
    party = models.CharField(max_length=50)

class LeaderBoard(models.Model):
    wallet_address = models.CharField(max_length=50)
    timestamp = models.CharField(max_length=50)
    score = models.BigIntegerField()