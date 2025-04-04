from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import UserProfile, Note, HandwrittenText, SpeechToText, Calculation
from .serializers import (
    UserSerializer, UserProfileSerializer, NoteSerializer,
    HandwrittenTextSerializer, SpeechToTextSerializer, CalculationSerializer
)
import numpy as np
from PIL import Image
import io
import speech_recognition as sr

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        UserProfile.objects.create(user=user)

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class HandwrittenTextViewSet(viewsets.ModelViewSet):
    serializer_class = HandwrittenTextSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HandwrittenText.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        # Here you would implement the actual handwritten text recognition
        # For now, we'll just set a placeholder
        instance.recognized_text = "Text recognition will be implemented"
        instance.save()

class SpeechToTextViewSet(viewsets.ModelViewSet):
    serializer_class = SpeechToTextSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SpeechToText.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        
        # Initialize the recognizer
        recognizer = sr.Recognizer()
        
        # Convert the audio file
        with sr.AudioFile(instance.audio_file.path) as source:
            audio = recognizer.record(source)
            
        try:
            # Perform the speech recognition
            text = recognizer.recognize_google(audio)
            instance.transcribed_text = text
        except Exception as e:
            instance.transcribed_text = f"Error in transcription: {str(e)}"
        
        instance.save()

class CalculationViewSet(viewsets.ModelViewSet):
    serializer_class = CalculationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Calculation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            # Safely evaluate the mathematical expression
            expression = serializer.validated_data['expression']
            result = str(eval(expression))  # Note: In production, use a safer evaluation method
            serializer.save(user=self.request.user, result=result)
        except Exception as e:
            serializer.save(user=self.request.user, result=f"Error: {str(e)}")
