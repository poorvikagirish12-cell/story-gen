from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from celery.result import AsyncResult
from .models import Script, Series
from .serializers import SeriesSerializer
from .tasks import generate_scripts_task, generate_story_task

@api_view(['POST'])
def generate_scripts_view(request):
    prompt = request.data.get('prompt')
    if not prompt:
        return Response({"error": "Prompt is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Dispatch Celery task
    task = generate_scripts_task.delay(prompt)
    return Response({"task_id": task.id, "message": "Task dispatched"}, status=status.HTTP_202_ACCEPTED)

@api_view(['GET'])
def list_scripts_view(request):
    series = Series.objects.prefetch_related('scripts').all()
    serializer = SeriesSerializer(series, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def generate_story_view(request):
    script_id = request.data.get('script_id')
    if not script_id:
        return Response({"error": "script_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verify script exists before dispatching
    if not Script.objects.filter(id=script_id).exists():
        return Response({"error": "Script not found"}, status=status.HTTP_404_NOT_FOUND)

    # Dispatch Celery task
    task = generate_story_task.delay(script_id)
    return Response({"task_id": task.id, "message": "Task dispatched"}, status=status.HTTP_202_ACCEPTED)

@api_view(['GET'])
def task_status_view(request, task_id):
    task_result = AsyncResult(task_id)
    
    response_data = {
        'task_id': task_id,
        'status': task_result.status,
    }

    if task_result.status == 'SUCCESS':
        response_data['result'] = task_result.result
    elif task_result.status == 'FAILURE':
        response_data['result'] = str(task_result.info)
        
    return Response(response_data, status=status.HTTP_200_OK)
