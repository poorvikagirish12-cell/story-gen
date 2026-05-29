from django.urls import path
from . import views

urlpatterns = [
    path('generate-scripts/', views.generate_scripts_view, name='generate_scripts'),
    path('scripts/', views.list_scripts_view, name='list_scripts'),
    path('generate-story/', views.generate_story_view, name='generate_story'),
    path('task-status/<str:task_id>/', views.task_status_view, name='task_status'),
]
