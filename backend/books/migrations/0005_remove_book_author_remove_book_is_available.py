# Generated by Django 5.1.4 on 2025-01-02 15:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0004_delete_request'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='book',
            name='author',
        ),
        migrations.RemoveField(
            model_name='book',
            name='is_available',
        ),
    ]
