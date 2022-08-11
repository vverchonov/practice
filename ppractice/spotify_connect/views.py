from email.policy import HTTP
from os import stat
from urllib import response
from django.shortcuts import render
from rest_framework.views import APIView
from .settings import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import update_create_tokens, is_spotify_authenticated, execute_spotify_api_request
from django.shortcuts import redirect
from myDjangoApp.models import Room

# Create your views here.


class AuthUrl(APIView):
    def get(self, request, format=None):
        scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing"

        url = Request('GET', 'https://accounts.spotify.com/authorize?', params={
            'scope': scopes,
            'response_type': "code",
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
        }).prepare().url

        return Response({"url": url}, status=status.HTTP_200_OK)


class ISAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({"msg": is_authenticated}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    # print("EXPIRES_IN_VIEWS = ", expires_in)
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_create_tokens(request.session.session_key,
                         access_token, token_type, expires_in, refresh_token)
    return redirect('frontend:home')


class CurrentSong(APIView):
    def get(self, request, fortmat=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({"msg": "you are not in the room"}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        # print("ROOM HOST =", Room.host)
        endpoint = 'player/currently-playing'

        response = execute_spotify_api_request(host, endpoint)
        print(response)

        return Response(response, status=status.HTTP_200_OK)
