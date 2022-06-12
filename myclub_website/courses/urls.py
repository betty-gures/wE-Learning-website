from django.urls import path

from . import views
app_name="courses"

urlpatterns = [
    # ex: /courses/
    path('', views.index, name='index'),
    path('create_category/', views.CreateCategoryView.as_view(), name='create_category'),
    path('create_subcategory/', views.CreateSubCategoryView.as_view(), name='create_subcategory'),
    path('create_course/', views.CreateCourseView.as_view(), name='create_course'),
    path('create_glossary/<int:course_id>/', views.CreateGlossaryView.as_view(), name='create_glossary'),
    path('create_quiz/<int:course_id>/', views.CreateQuizView.as_view(), name='create_quiz'),
    path('create_quiz_question/<int:quiz_id>/', views.CreateQuizQuestionsView.as_view(), name='create_quiz_question'),

]
