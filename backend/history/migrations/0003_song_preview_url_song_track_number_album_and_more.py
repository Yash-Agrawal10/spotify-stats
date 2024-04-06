# Generated by Django 5.0.3 on 2024-04-06 19:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('history', '0002_artist_alter_history_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='song',
            name='preview_url',
            field=models.URLField(null=True),
        ),
        migrations.AddField(
            model_name='song',
            name='track_number',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('spotify_id', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('release_date', models.DateField()),
                ('artists', models.ManyToManyField(related_name='albums', to='history.artist')),
            ],
        ),
        migrations.AlterField(
            model_name='song',
            name='album',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='songs', to='history.album'),
        ),
    ]