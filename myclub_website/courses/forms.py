from django import forms
from .models import Category, Courses, Glossary, Quiz, QuizQuestions
from ckeditor.widgets import CKEditorWidget


class CreateCategoryForm(forms.ModelForm):
    class Meta:
        model = Category

        fields = ("title",)
        exclude = ("create_at", "update_at", "slug")


class CreateSubCategoryForm(forms.ModelForm):
    parent = forms.ModelChoiceField(queryset=Category.objects.filter(parent=None))

    class Meta:
        model = Category

        fields = ("title", "parent")
        exclude = ("create_at", "update_at", "slug")


class CreateCourseForm(forms.ModelForm):
    # lookin = forms.CharField(widget=CKEditorWidget())
    # detail = forms.CharField(label='Detail',
    #                widget=forms.Textarea(attrs={'class': 'ckeditor'}))
    class Meta:
        model = Courses

        fields = ("category", "title", "keywords",
                  'description', 'image', 'lookin',
                  'detail')
        exclude = ("create_at", "update_at",)


class CreateGlossaryForm(forms.ModelForm):
    class Meta:
        model = Glossary
        fields = ("term", 'detail',)


class CreateQuizForm(forms.ModelForm):
    class Meta:
        model = Quiz
        fields = ("quiz_name", 'quiz_level',)


class CreateQuizQuestionsForm(forms.ModelForm):
    class Meta:
        model = QuizQuestions
        fields = ('question', "choiceA", "choiceB",
                  "choiceC", "choiceD", "rightAnswer")
