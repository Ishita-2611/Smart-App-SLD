from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'profiles', views.UserProfileViewSet, basename='profile')
router.register(r'notes', views.NoteViewSet, basename='note')
router.register(r'handwritten', views.HandwrittenTextViewSet, basename='handwritten')
router.register(r'speech', views.SpeechToTextViewSet, basename='speech')
router.register(r'calculations', views.CalculationViewSet, basename='calculation')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] 