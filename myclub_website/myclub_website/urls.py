from django.contrib import admin
from django.urls import path, include 
from django.conf import settings
from django.conf.urls.static import static
from home import views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('home.urls')),
    path('landing/',include('landing.urls')),
    path('accounts/', include('allauth.urls')),
    path('social/', include('social.urls')),
    path('courses/', include('courses.urls')),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('colearning/', include('colearning.urls')),
    path('home/', include('home.urls')),
    path('aboutus/', views.aboutus, name='aboutus'),
    path('course_detail/<int:id>', views.course_detail, name='course_detail'),
    #path('category_detail/<int:id>', views.category_detail, name='category_detail'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)