# models.py: Adatbázis modellek (Django ORM)
# A könyvek tárolása.

from django.db import models
from django.contrib.auth.models import User

# Book model: Egy könyv alapvető adatai (cím, leírás, tulajdonos, készítés dátuma)
class Book(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('title', 'owner')
        verbose_name = 'Book'
        verbose_name_plural = 'Books'

    def __str__(self):
        return f"{self.title} by {self.owner.username}"