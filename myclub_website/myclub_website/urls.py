from django.contrib import admin
from django.urls import path, include 
from django.conf import settings
from django.conf.urls.static import static
from home import views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.home_page, name='home_page'),
    path('landing/',include('landing.urls')),
    # path('accounts/', include('allauth.urls')),
    path('accounts/', include('accounts.urls'), name="accounts"),
    path('social/', include('social.urls'), name='social'),
    path('courses/', include('home.urls')),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('colearning/', include('colearning.urls')),
    path('home/', views.home_page, name='home_page'),
    path('aboutus/', views.aboutus, name='aboutus'),
    path('course_detail/<int:id>', views.course_detail, name='course_detail'),
    #path('category_detail/<int:id>', views.category_detail, name='category_detail'),
    path('categories/', views.categories, name='categories'),
    path('category_detail/<int:id>', views.category_detail, name='category_detail'),
    path('glossary/<int:id>', views.glossary_list, name='glossary_list'),
    path('quiz/<int:id>', views.quiz_list, name='quiz_list'),
    path('quiz_detail/<int:id>', views.quiz_detail_list, name='quiz_detail_list'),
    path('search/', views.course_search, name='course_search'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)