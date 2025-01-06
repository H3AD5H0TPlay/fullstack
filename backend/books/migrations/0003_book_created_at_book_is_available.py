# Generated by Django 5.1.4 on 2025-01-02 12:50

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0002_remove_book_created_at_remove_book_is_available_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='book',
            name='is_available',
            field=models.BooleanField(default=True),
        ),
    ]
