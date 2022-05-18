from django.contrib import admin
from .models import Category, Courses
# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'parent']
    list_filter = ['status']
    ordering = ['parent', 'title']
admin.site.register(Category,CategoryAdmin)

class CoursesAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'category', 'create_at']
    list_filter = ['status']
    ordering = ['category', 'title']
admin.site.register(Courses,CoursesAdmin)
