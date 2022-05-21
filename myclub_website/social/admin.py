from django.contrib import admin
from .models import Post, UserProfile, Comment, Notification, ThreadModel

class PostAdmin(admin.ModelAdmin):
	list_display=['body','author']
admin.site.register(Post,PostAdmin)
admin.site.register(UserProfile)
admin.site.register(Comment)
admin.site.register(Notification)
admin.site.register(ThreadModel)

