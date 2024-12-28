
from django.db import models

class BookManager(models.Manager):
    def create_book(self, bookName, bookAuthor, bookDesc):
        book = self.create(bookName=bookName, bookAuthor=bookAuthor, bookDesc=bookDesc)
        # do something with the book
        return book  