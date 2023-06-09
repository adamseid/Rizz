# Generated by Django 4.1.4 on 2023-01-25 22:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Connections',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wallet_address', models.CharField(max_length=50)),
                ('room_group_name', models.CharField(max_length=50)),
                ('messages', models.CharField(max_length=50)),
                ('party', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='LeaderBoard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wallet_address', models.CharField(max_length=50)),
                ('timestamp', models.CharField(max_length=50)),
                ('score', models.BigIntegerField()),
            ],
        ),
    ]
