from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_exam_mode = models.BooleanField(default=False)

class HandwrittenText(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='handwritten/')
    recognized_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class SpeechToText(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    audio_file = models.FileField(upload_to='speech/')
    transcribed_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Calculation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    expression = models.CharField(max_length=500)
    result = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
