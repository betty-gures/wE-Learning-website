# Generated by Django 4.0.3 on 2022-06-12 10:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0004_alter_quizquestions_choicea_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courses',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='courses.category'),
        ),
    ]
