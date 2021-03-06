# Generated by Django 3.1.3 on 2021-07-08 00:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('aggregator', '0003_auto_20210706_1757'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='friendships',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='friendship', to='aggregator.friendships', verbose_name='amizades'),
            preserve_default=False,
        ),
    ]
