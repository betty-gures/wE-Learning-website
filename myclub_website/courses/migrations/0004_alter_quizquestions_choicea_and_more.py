# Generated by Django 4.0.3 on 2022-06-12 10:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_alter_courses_keywords_alter_courses_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quizquestions',
            name='choiceA',
            field=models.CharField(max_length=255, verbose_name='Choice A'),
        ),
        migrations.AlterField(
            model_name='quizquestions',
            name='choiceB',
            field=models.CharField(max_length=255, verbose_name='Choice B'),
        ),
        migrations.AlterField(
            model_name='quizquestions',
            name='choiceC',
            field=models.CharField(max_length=255, verbose_name='Choice C'),
        ),
        migrations.AlterField(
            model_name='quizquestions',
            name='choiceD',
            field=models.CharField(max_length=255, verbose_name='Choice D'),
        ),
    ]
