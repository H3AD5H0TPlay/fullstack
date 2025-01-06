# admin.py: Django admin konfiguráció
# Itt regisztráljuk a modelleket, hogy megjelenjenek a Django admin felületén.

from django.contrib import admin
from .models import Book

# A Book model regisztrálása az admin felülethez
admin.site.register(Book)
