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
    
# Favourite model: many-many kapcsolat könyv és felhasználó között, de minden felhasználó csak egyszer teheti be ugyanazt a könyvet a kedvencekbe
class Favourite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favourites")
    book = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favourited_by")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')
        verbose_name = 'Favourite'
        verbose_name_plural = 'Favourites'

    def __str__(self):
        return f"{self.user.username} -> {self.book.title}"