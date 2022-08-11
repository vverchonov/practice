from django.urls import path
from .views import AuthUrl, CurrentSong, ISAuthenticated, spotify_callback

app_name = 'spotify'

urlpatterns = [
    path('auth-url', AuthUrl.as_view()),
    path('redirect', spotify_callback),
    path('is-auth', ISAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view())
]
