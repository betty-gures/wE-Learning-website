from django import forms
from .models import Category, Courses, Glossary, Quiz, QuizQuestions
from ckeditor.widgets import CKEditorWidget


class CreateCategoryForm(forms.ModelForm):
    title = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control'}))

    class Meta:
        model = Category

        fields = ("title",)
        exclude = ("create_at", "update_at", "slug")


class CreateSubCategoryForm(forms.ModelForm):
    title = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control',
                                                          'placeholder':'Subcategory Name'}))
    parent = forms.ModelChoiceField(queryset=Category.objects.filter(parent=None))

    class Meta:
        model = Category

        fields = ("title", "parent")
        exclude = ("create_at", "update_at", "slug")


class CreateCourseForm(forms.ModelForm):
    title = forms.CharField(widget=forms.TextInput(attrs={'class':'form-control',
                                                          'placeholder':'Learning Environment Name'}))
    keywords = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control',
                                                          'placeholder': 'Learning Environment Keywords'}))
    description = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control',
                                                          'placeholder': 'Learning Environment Description'}))

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
    term = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control',
                                                          'placeholder': 'Glossary Term'}))
    detail = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control',
                                                          'placeholder': 'Explanation of Term'}))
    class Meta:
        model = Glossary
        fields = ("term", 'detail',)


class CreateQuizForm(forms.ModelForm):
    quiz_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control',
                                                         'placeholder': 'Quiz Name'}))
    quiz_level = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control',
                                                         'placeholder': 'Quiz Level'}))
    class Meta:
        model = Quiz
        fields = ("quiz_name", 'quiz_level',)


class CreateQuizQuestionsForm(forms.ModelForm):
    question = forms.CharField(widget=forms.Textarea(attrs={'class': 'form-control',
                                                         'placeholder': 'Quiz Question'}))
    choiceA = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control',
                                                             'placeholder': 'Choice A'}),label="Choice A")
    choiceB = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control',
                                                         'placeholder': 'Choice B'}),label="Choice B")
    choiceC = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control',
                                                         'placeholder': 'Choice C'}),label="Choice C")
    choiceD = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control',
                                                         'placeholder': 'Choice D'}),label="Choice D")

    class Meta:
        model = QuizQuestions
        fields = ('question', "choiceA", "choiceB",
                  "choiceC", "choiceD", "rightAnswer")
