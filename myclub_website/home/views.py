from django.http import HttpResponse
from django.shortcuts import render
from courses.models import Courses
from home.forms import SearchForm

# Create your views here.
def index(request):
    coursesdata = Courses.objects.all().order_by('-id')[:1000]
    context={'coursesdata':coursesdata, 'page':'home'}
    return render(request, 'index.html', context)

def aboutus(request):
    context={'page':'aboutus'}
    return render(request, 'aboutus.html', context)

def course_detail(request,id):
    course=Courses.objects.get(pk=id)
    context={'page':'course_detail',
             'course':course}
    return render(request, 'course_detail.html', context)

def course_search(request):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        if form.is_valid():
            query = form.cleaned_data['query']
            courses = Courses.objects.filter(title__icontains=query)
            context={'page':'search',
             'courses':courses}
            return render(request, 'search.html', context)


# Create your views here.
#def index(request):
 #   text="Merhaba burası courses ana sayfası "
 #   return HttpResponse("%s." % text)