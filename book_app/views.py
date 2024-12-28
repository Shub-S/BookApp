from django.http import HttpResponse
from .models.models import AccessRecord,Topic,Webpage
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models.book import Book
from django.forms.models import model_to_dict
from django.db.models import Q

# Create your views here.
@api_view(['GET'])
def getAllBook(request):
  text = request.GET.get('text', None)
  if text:
    return Response({'books':Book.objects.filter(Q(bookName__contains=text)|Q(bookAuthor__contains=text)|Q(bookDesc__contains=text)).values('bookId','bookName', 'bookAuthor', 'bookDesc')}) 
  else:
    return Response({'books':Book.objects.all().values('bookId','bookName', 'bookAuthor', 'bookDesc')})
  
@api_view(['GET'])
def getBookById(request, bookId):
  return Response({'book':model_to_dict(Book.objects.get(bookId=bookId))})

@api_view(['DELETE'])
def delBookById(request, bookId):
  book = Book.objects.get(bookId=bookId)
  book.delete()
  return Response({"succes":True, "message":"book deleted succesfully"})

@api_view(['PUT'])
def updateBookById(request, bookId):
  book = Book.objects.get(bookId=bookId)
  bookName = request.data.get('bookName')
  if bookName:
    book.bookName = bookName
  bookAuthor=request.data.get('bookAuthor')
  if bookAuthor:
    book.bookAuthor = bookAuthor
  bookDesc=request.data.get('bookDesc')
  if bookDesc:
    book.bookDesc = bookDesc
  book.save()
  return Response({'success':True, "message":'book updated successfully'})

@api_view(['POST'])
def insertBook(request):
    bookName = request.data.get('bookName')
    bookAuthor = request.data.get('bookAuthor')
    bookDesc = request.data.get('bookDesc')
    
    if bookName and bookAuthor and bookDesc:
        new_book =Book.objects.create(bookName=bookName, bookAuthor=bookAuthor, bookDesc=bookDesc)
        return Response({'success': True,'bookId':new_book.bookId})
    else:
        return Response({'success': False, 'message': 'Invalid data'}, status=400)
