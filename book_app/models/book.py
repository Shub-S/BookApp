
from django.db import models
from .book_manger import BookManager 

class Book(models.Model):
    bookId = models.AutoField(db_column='book_id',  primary_key=True)
    bookName = models.TextField(db_column='book_name')
    bookAuthor = models.TextField(db_column='book_author')
    bookDesc = models.TextField(db_column='book_desc')
    
    @classmethod
    def create(cls, bookName, bookAuthor, bookDesc):
        book = cls(bookName=bookName, bookAuthor=bookAuthor, bookDesc=bookDesc)
        return book
    objects = BookManager()
    class Meta:
        db_table = "book"
    def __str__(self):
        return 'book'
        #return self.objects.all().values('bookId','bookName', 'bookAuthor', 'bookDesc')
