# Generated by Django 5.1.5 on 2025-02-02 09:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fooddelivery', '0012_order_is_delivered'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='is_delivered',
        ),
    ]
