# Generated by Django 5.0.3 on 2024-04-06 17:15

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('spotify_id', models.CharField(max_length=255, unique=True)),
                ('title', models.CharField(max_length=255)),
                ('artist', models.CharField(max_length=255)),
                ('album', models.CharField(max_length=255)),
                ('duration_ms', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('listened_at', models.DateTimeField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history', to=settings.AUTH_USER_MODEL)),
                ('song', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='history.song')),
            ],
            options={
                'ordering': ['-listened_at'],
            },
        ),
    ]
