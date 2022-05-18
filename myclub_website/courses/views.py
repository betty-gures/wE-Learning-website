from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def index(request):
    text="Merhaba burası courses ana sayfası "
    return HttpResponse("%s." % text)