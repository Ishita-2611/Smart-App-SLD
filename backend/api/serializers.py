from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Note, HandwrittenText, SpeechToText, Calculation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ('user',)

class HandwrittenTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = HandwrittenText
        fields = '__all__'
        read_only_fields = ('user', 'recognized_text')

class SpeechToTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeechToText
        fields = '__all__'
        read_only_fields = ('user', 'transcribed_text')

class CalculationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calculation
        fields = '__all__'
        read_only_fields = ('user', 'result') 