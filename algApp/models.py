# models.py
from django.db import models


class TimeSample(models.Model):
    ''' マイクロ秒を記録するために整数型フィールドのdatetime_microを設けます '''


datetime = models.DateTimeField()
datetime_micro = models.IntegerField(default=0)
