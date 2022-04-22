from django.shortcuts import render

def home(request, year, month):
	name = "Betul"
	return render (request, 'home.html', {"name":name,"year":year,"month":month })
