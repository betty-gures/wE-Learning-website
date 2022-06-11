from django.contrib.auth.views import LoginView
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import views

from accounts.forms import SignUpForm


class SignUpView(views.View):

    def get(self, request):
        form = SignUpForm()
        context = {
            'form': form
        }
        return render(request, 'registration/signup.html', context)

    def post(self, request):
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('accounts:login'))
        context = {
            'form': form
        }
        return render(request, 'registration/signup.html', context)

# class CustomLoginView(LoginView):
#     pass
