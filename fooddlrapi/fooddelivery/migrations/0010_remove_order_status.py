# Generated by Django 5.1.5 on 2025-02-02 09:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fooddelivery', '0009_remove_order_is_delivered_order_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='status',
        ),
    ]
