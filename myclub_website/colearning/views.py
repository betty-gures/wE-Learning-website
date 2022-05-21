from django.shortcuts import render

# Create your views here.
def home(request):
	return render(request, 'colearn/colearn_home.html')

def room(request,room):
	return render(request, 'colearn/colearn_room.html')

