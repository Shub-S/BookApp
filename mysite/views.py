from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'home.html')
def book(request): 
    return render(request, "book.html") 
def lms(request): 
    return render(request, "lms.html") 