from django.http import HttpResponse
from django.shortcuts import render
from courses.models import Courses

# Create your views here.
def index(request):
    coursesdata = Courses.objects.all()[:1000]
    context={'coursesdata':coursesdata, 'page':'home'}
    return render(request, 'index.html', context)

def aboutus(request):
    context={'page':'aboutus'}
    return render(request, 'aboutus.html', context)



# Create your views here.
#def index(request):
 #   text="Merhaba burası courses ana sayfası "
 #   return HttpResponse("%s." % text)