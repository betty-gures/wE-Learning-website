from django.http import HttpResponse
from django.shortcuts import render
from courses.models import Courses

# Create your views here.
def index(request):
    coursesdata = Courses.objects.all().order_by('-id')[:1000]
    context={'coursesdata':coursesdata, 'page':'home'}
    return render(request, 'index.html', context)

def aboutus(request):
    context={'page':'aboutus'}
    return render(request, 'aboutus.html', context)

def course_detail(request,id):
    mesaj="ders",id,"/"
    return HttpResponse(mesaj)


# Create your views here.
#def index(request):
 #   text="Merhaba burası courses ana sayfası "
 #   return HttpResponse("%s." % text)