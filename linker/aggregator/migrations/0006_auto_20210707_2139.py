# Generated by Django 3.1.3 on 2021-07-08 00:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aggregator', '0005_auto_20210707_2138'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='tipo_servico',
            field=models.CharField(choices=[('link', 'Link'), ('friendships', 'Friendships'), ('workspace', 'Workspace')], max_length=50),
        ),
    ]
