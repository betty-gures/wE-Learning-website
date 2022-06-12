from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.text import slugify


# Create your models here.
class Category(models.Model):
    title = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.PROTECT, null=True, blank=True)
    status = models.BooleanField(default=True)
    slug = models.SlugField()
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super(Category, self).save(*args, **kwargs)


class Courses(models.Model):
    STATUS = (
        ('True', 'Evet'),
        ('False', 'Hayır'),
    )
    category = models.ForeignKey(Category, on_delete=models.CASCADE)  # relation with Category table
    title = models.CharField(max_length=255)
    keywords = models.CharField(max_length=255,
                                null=True, blank=True)
    description = models.CharField(max_length=255)
    image = models.ImageField(blank=True, upload_to='course_images/')
    lookin = RichTextUploadingField()
    detail = RichTextUploadingField()

    status = models.BooleanField(default=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Roadmap(models.Model):
    STATUS = (
        ('True', 'Evet'),
        ('False', 'Hayır'),
    )
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)  # relation with Category table
    title = models.CharField(max_length=255)
    detail = models.TextField(blank=True, )
    warning = models.TextField(blank=True, )
    order_number = models.IntegerField(default=0)

    status = models.CharField(max_length=10, choices=STATUS, default=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Glossary(models.Model):
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)  # relation with Category table
    term = models.CharField(max_length=255)
    detail = RichTextUploadingField()

    def __str__(self):
        return self.term


class Quiz(models.Model):
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)  # relation with course/learning environment
    quiz_name = models.CharField(max_length=255)
    quiz_level = models.TextField(blank=True, )

    def __str__(self):
        return self.quiz_name


class QuizQuestions(models.Model):
    RIGHTANSWER = (
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
    )
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)  # relation with Quiz
    question = models.TextField(blank=True, )
    choiceA = models.CharField(max_length=255)
    choiceB = models.CharField(max_length=255)
    choiceC = models.CharField(max_length=255)
    choiceD = models.CharField(max_length=255)
    rightAnswer = models.CharField(max_length=10, choices=RIGHTANSWER)

    def __str__(self):
        return self.rightAnswer
