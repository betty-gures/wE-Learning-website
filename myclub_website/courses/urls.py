from django.urls import path

from . import views

app_name = "courses"

urlpatterns = [
    # ex: /courses/
    path('', views.index, name='index'),
    path('create_category/', views.CreateCategoryView.as_view(), name='create_category'),
    path('create_subcategory/', views.CreateSubCategoryView.as_view(), name='create_subcategory'),
    path('category/<int:pk>/delete/', views.DeleteCategoryView.as_view(), name='delete_category'),
    path('create_course/', views.CreateCourseView.as_view(), name='create_course'),
    path('course/<int:pk>/delete/', views.DeleteCourseView.as_view(), name='delete_course'),
    path('create_glossary/<int:course_id>/', views.CreateGlossaryView.as_view(), name='create_glossary'),
    path('glossary/<int:pk>/delete/', views.DeleteGlossaryView.as_view(), name='delete_glossary'),
    path('create_quiz/<int:course_id>/', views.CreateQuizView.as_view(), name='create_quiz'),
    path('quiz/<int:pk>/delete/', views.DeleteQuizView.as_view(), name='delete_quiz'),
    path('create_quiz_question/<int:quiz_id>/', views.CreateQuizQuestionsView.as_view(), name='create_quiz_question'),
    path('quiz_question/<int:pk>/delete/', views.DeleteQuizQuestionsView.as_view(), name='delete_quiz_question'),
]
