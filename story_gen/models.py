from django.db import models

class Series(models.Model):
    title = models.CharField(max_length=255)
    concept = models.TextField()

    def __str__(self):
        return self.title

class Script(models.Model):
    series = models.ForeignKey(Series, related_name='scripts', on_delete=models.CASCADE)
    episode_number = models.IntegerField()
    title = models.CharField(max_length=255)
    script_summary = models.TextField()

    def __str__(self):
        return f"{self.title} (Ep {self.episode_number})"
