from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, reverse
from django import views
from django.urls import reverse_lazy
from django.views.generic import DeleteView

from .forms import CreateCategoryForm, CreateSubCategoryForm, CreateCourseForm, CreateGlossaryForm, CreateQuizForm, \
    CreateQuizQuestionsForm

# Create your views here.
from .models import Category, Courses, Glossary, Quiz, QuizQuestions


def index(request):
    text = "Merhaba burası courses ana sayfası "
    return HttpResponse("%s." % text)


class CreateCategoryView(views.View):
    def get(self, request):
        form = CreateCategoryForm()
        context = {"form": form}
        return render(request, "categories/create_category.html", context)

    def post(self, request):
        form = CreateCategoryForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse("categories"))

        context = {"form": form}
        return render(request, "categories/create_category.html", context)


class CreateSubCategoryView(views.View):
    def get(self, request):
        form = CreateSubCategoryForm()
        context = {"form": form}
        return render(request, "categories/create_subcategory.html", context)

    def post(self, request):
        form = CreateSubCategoryForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse("categories"))

        context = {"form": form}
        return render(request, "categories/create_subcategory.html", context)


class DeleteCategoryView(DeleteView):
    model = Category
    success_url = reverse_lazy('categories')


class CreateCourseView(views.View):
    def get(self, request):
        form = CreateCourseForm()
        context = {"form": form}
        return render(request, "courses/create_course.html", context)

    def post(self, request):
        form = CreateCourseForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse("course_detail",
                                                kwargs={'id': form.instance.id}))


        context = {"form": form}
        return render(request, "courses/create_course.html", context)

class DeleteCourseView(DeleteView):
    model = Courses
    success_url = reverse_lazy('learning_environments')

class CreateGlossaryView(views.View):
    def get(self, request, course_id):
        form = CreateGlossaryForm()
        context = {"form": form,
                   'course_id': course_id
                   }
        return render(request, "courses/create_glossary.html", context)

    def post(self, request, course_id):
        form = CreateGlossaryForm(request.POST)
        if form.is_valid():
            form.save(commit=False)
            form.instance.course_id = course_id
            form.save()
            return HttpResponseRedirect(reverse("glossary_list",
                                                kwargs={'id': course_id}))

        context = {"form": form}
        return render(request, "courses/create_glossary.html", context)

class DeleteGlossaryView(DeleteView):
    model = Glossary
    success_url = reverse_lazy('learning_environments')

class CreateQuizView(views.View):
    def get(self, request, course_id):
        form = CreateQuizForm()
        context = {"form": form,
                   'course_id': course_id
                   }
        return render(request, "courses/create_quiz.html", context)

    def post(self, request, course_id):
        form = CreateQuizForm(request.POST)
        if form.is_valid():
            form.save(commit=False)
            form.instance.course_id = course_id
            form.save()
            return HttpResponseRedirect(reverse("quiz_list",
                                                kwargs={'id': course_id}))

        context = {"form": form}
        return render(request, "courses/create_quiz.html", context)

class DeleteQuizView(DeleteView):
    model = Quiz
    success_url = reverse_lazy("learning_environments")

class CreateQuizQuestionsView(views.View):
    def get(self, request, quiz_id):
        form = CreateQuizQuestionsForm()
        context = {"form": form,
                   }
        return render(request, "courses/create_quiz_question.html", context)

    def post(self, request, quiz_id):
        form = CreateQuizQuestionsForm(request.POST)
        if form.is_valid():
            form.save(commit=False)
            form.instance.quiz_id = quiz_id
            form.save()
            return HttpResponseRedirect(reverse("quiz_detail_list",
                                                kwargs={'id': quiz_id}))

        context = {"form": form}
        return render(request, "courses/create_quiz_question.html", context)

class DeleteQuizQuestionsView(DeleteView):
    model = QuizQuestions
    success_url = reverse_lazy("learning_environments")