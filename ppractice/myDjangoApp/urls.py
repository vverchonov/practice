
from django.urls import path
from .views import JoinRoom, LeaveRoom, RoomView, UpdateRoom
from .views import CreateRoomView
from .views import GetRoom
from .views import IsUserInRomm

urlpatterns = [
    path('', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('user-in-room', IsUserInRomm.as_view()),
    path('leave-room', LeaveRoom.as_view()),
    path('update-room', UpdateRoom.as_view()),
]
