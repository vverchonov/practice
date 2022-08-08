
from django.urls import path
from .views import JoinRoom, RoomView
from .views import CreateRoomView
from .views import GetRoom

urlpatterns = [
    path('', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
]
