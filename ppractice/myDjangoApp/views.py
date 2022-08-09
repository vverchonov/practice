from os import stat
from tkinter.messagebox import QUESTION
from urllib import response
from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status.HTTP_200_OK)
            return Response("invalid room code", status.HTTP_404_NOT_FOUND)
        return Response('bad request', status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    lookup_url = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url)
        if code != None:
            roomResults = Room.objects.filter(code=code)
            if len(roomResults) > 0:
                room = roomResults[0]
                self.request.session['room-code'] = code
                return Response({'message': 'Room joined!'}, status.HTTP_200_OK)
            return Response({'message': 'invalid room code'}, status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'invalid post data'}, status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):

    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():

            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)

            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['votes_to_skip', 'guest_can_pause'])
                self.request.session['room_code'] = room.code
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code

        return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)


class IsUserInRomm(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code')
        }
        print("data = ", data)
        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
        return Response({'msg': 'success'}, status=status.HTTP_200_OK)


class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({"msg": "room not found"}, status=status.HTTP_404_NOT_FOUND)
            room = queryset[0]

            user_id = self.request.session.session_key
            if user_id != room.host:
                return Response({"msg": "you are not the host"}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['votes_to_skip', 'guest_can_pause'])
            return Response({"msg": "updated"}, status=status.HTTP_200_OK)

        return Response({"msg": "bad request"}, status=status.HTTP_400_BAD_REQUEST)
