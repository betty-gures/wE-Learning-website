from django import forms

class SearchForm(forms.Form):
	query= forms.CharField(label='query', max_length=100)