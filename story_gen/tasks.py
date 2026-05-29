import os
import json
from google import genai
from google.genai import types
from celery import shared_task
from .models import Script, Series
from django.conf import settings

# Configure Gemini API client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={'max_retries': 3, 'countdown': 5})
def generate_scripts_task(self, prompt):
    try:
        sys_prompt = (
            "You are a professional story outline generator. The user will provide a concept prompt. "
            "Generate a catchy, thematic title for this new Series based on the concept, and an arc of episode outlines. "
            "Output MUST be strict JSON matching this schema: "
            "{\"series_title\": \"string\", \"episodes\": [{\"episode_number\": 1, \"title\": \"string\", \"script_summary\": \"string\"}]}"
        )
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"{sys_prompt}\n\nConcept Prompt: {prompt}",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        
        data = json.loads(response.text)
        
        # Create Series
        series = Series.objects.create(
            title=data.get('series_title', 'Untitled Series'),
            concept=prompt
        )
        
        saved_scripts = []
        for outline in data.get('episodes', []):
            script = Script.objects.create(
                series=series,
                episode_number=outline.get('episode_number', 0),
                title=outline.get('title', 'Untitled'),
                script_summary=outline.get('script_summary', '')
            )
            saved_scripts.append(script.id)
            
        return {"status": "success", "series_id": series.id, "saved_script_ids": saved_scripts}
    
    except Exception as e:
        # The autoretry_for will catch this and retry
        raise self.retry(exc=e)


@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={'max_retries': 3, 'countdown': 5})
def generate_story_task(self, script_id):
    try:
        script = Script.objects.get(id=script_id)
        
        sys_prompt = (
            "You are a professional story writer. Based on the following episode summary and series concept, "
            "write an expansive, highly detailed chapter of approximately 2000 words. "
            "Do not rush the plot. Expand on dialogue, environmental world-building, and sensory details to reach the required length. "
            "Do not output JSON, just the full text story."
        )
        
        content = (
            f"Series Concept: {script.series.concept}\n"
            f"Series Title: {script.series.title}\n"
            f"Episode {script.episode_number}: {script.title}\n"
            f"Summary: {script.script_summary}\n"
        )
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"{sys_prompt}\n\n{content}"
        )
        
        return {"status": "success", "story": response.text}
        
    except Script.DoesNotExist as e:
        return {"status": "error", "message": "Script not found"}
    except Exception as e:
        raise self.retry(exc=e)
