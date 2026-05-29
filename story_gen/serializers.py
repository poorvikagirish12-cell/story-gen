from rest_framework import serializers
from .models import Script, Series

class ScriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Script
        fields = ['id', 'episode_number', 'title', 'script_summary']

class SeriesSerializer(serializers.ModelSerializer):
    scripts = ScriptSerializer(many=True, read_only=True)
    
    class Meta:
        model = Series
        fields = ['id', 'title', 'concept', 'scripts']
