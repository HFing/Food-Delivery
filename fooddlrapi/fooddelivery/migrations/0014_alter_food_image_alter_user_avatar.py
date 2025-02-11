# Generated by Django 5.1.5 on 2025-02-02 14:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fooddelivery', '0013_remove_order_is_delivered'),
    ]

    operations = [
        migrations.AlterField(
            model_name='food',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='food_images/'),
        ),
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='avatars/'),
        ),
    ]
