# Generated by Django 3.2.3 on 2021-12-15 08:10

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_parceltokenlink'),
    ]

    operations = [
        migrations.AddField(
            model_name='parcel',
            name='created_date',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
        migrations.AddField(
            model_name='parcel',
            name='updated_date',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]
