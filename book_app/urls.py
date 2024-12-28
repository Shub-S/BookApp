from django.urls import path
from book_app import views

urlpatterns = [
    path(r'books', views.getAllBook),
    path(r'books/<int:bookId>/fetch', views.getBookById),
    path(r'books/<int:bookId>/remove', views.delBookById),
    path(r'books/<int:bookId>/update', views.updateBookById),
    path('book', views.insertBook),
]
