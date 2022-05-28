from django.contrib import admin
from .models import Category, Courses, Roadmap, Glossary
# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'status']
    list_filter = ['status']
    ordering = ['title']
admin.site.register(Category,CategoryAdmin)

class CoursesAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'category', 'create_at']
    list_filter = ['status']
    ordering = ['category', 'title']
admin.site.register(Courses,CoursesAdmin)

class RoadmapAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'detail', 'warning']
    ordering = ['order_number','id']
admin.site.register(Roadmap,RoadmapAdmin)

class GlossaryAdmin(admin.ModelAdmin):
    list_display = ['term']
    ordering = ['id']
admin.site.register(Glossary,GlossaryAdmin)
