from datetime import datetime
from django.db import models

# Create your models here.
class Parcel(models.Model):
    track_code = models.CharField(max_length=250, unique=True)

    def __str__(self):
        return str(self.track_code)

class Operation(models.Model):
    date = models.DateTimeField(default=datetime.now)
    postOfficeIndex = models.CharField(max_length=6)
    postOfficeName = models.CharField(max_length=250)
    name = models.CharField(max_length=250)
    parcel = models.ForeignKey(Parcel, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.name)