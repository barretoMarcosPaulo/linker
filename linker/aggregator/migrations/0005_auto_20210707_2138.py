# Generated by Django 3.1.3 on 2021-07-08 00:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('aggregator', '0004_notification_friendships'),
    ]

    operations = [
        migrations.RenameField(
            model_name='notification',
            old_name='friendships',
            new_name='friendship',
        ),
    ]
