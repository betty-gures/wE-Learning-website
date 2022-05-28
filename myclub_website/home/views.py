from django.http import HttpResponse
from django.shortcuts import render
from courses.models import Courses, Category, Roadmap, Glossary, Quiz, QuizQuestions
from home.forms import SearchForm


# Create your views here.
def index(request):
    coursesdata = Courses.objects.all().order_by('-id')[:1000]
    context = {'coursesdata': coursesdata, 'page': 'home'}
    return render(request, 'index.html', context)


def aboutus(request):
    context = {'page': 'aboutus'}
    return render(request, 'aboutus.html', context)


def course_detail(request, id):
    course = Courses.objects.get(pk=id)
    roadmap = Roadmap.objects.filter(course_id=id)
    context = {'page': 'course_detail',
               'course': course,
               'roadmap': roadmap}
    return render(request, 'course_detail.html', context)


def course_search(request):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        if form.is_valid():
            query = form.cleaned_data['query']
            courses = Courses.objects.filter(title__icontains=query)
            context = {'page': 'search',
                       'courses': courses}
            return render(request, 'search.html', context)


def categories(request):
    categoriesdata = Category.objects.all().order_by('title')[:1000]
    category_parents = Category.objects.all()
    context = {'categoriesdata': categoriesdata, 'page': 'categories', 'parents': category_parents}
    return render(request, 'categories.html', context)


def category_detail(request, id):
    courses = Courses.objects.filter(category_id=id)
    context = {'page': 'category_detail',
               'courses': courses}
    return render(request, 'category_detail.html', context)

def glossary_list(request, id):
    course = Courses.objects.get(pk=id)
    glossarydata = Glossary.objects.filter(course_id=id)
    context = {'page': 'glossary_list',
               'glossarydata': glossarydata,
               'course':course}
    return render(request, 'glossary.html', context)

def quiz_list(request, id):
    course = Courses.objects.get(pk=id)
    quizdata = Quiz.objects.filter(course_id=id)
    context = {'page': 'quiz_list',
               'quizdata': quizdata,
               'course':course}
    return render(request, 'quiz.html', context)

def quiz_detail_list(request, id):
    quiz = Quiz.objects.get(pk=id)
    quizdetailsdata = QuizQuestions.objects.filter(quiz_id=id)
    context = {'page': 'quiz_list',
               'quizdetailsdata': quizdetailsdata,
               'quiz':quiz}
    return render(request, 'quiz_detail.html', context)

# Create your views here.
# def index(request):
#   text="Merhaba burası courses ana sayfası "
#   return HttpResponse("%s." % text)
