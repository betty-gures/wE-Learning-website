from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_alter_courses_detail_alter_courses_lookin'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='category',
            name='parent',
        ),
    ]