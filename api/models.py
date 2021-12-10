from django.db import models

# Create your models here.
class Parcel(models.Model):
    track_code = models.CharField(max_length=200)

    def __str__(self):
        return str(self.track_code)