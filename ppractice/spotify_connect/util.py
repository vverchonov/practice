from datetime import timedelta
from email import header
from time import timezone
from urllib import response
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import Request, post, put, get
from .settings import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI

BASE_URL = 'https://api.spotify.com/v1/me/'


def get_user_tokens(session_key):
    user_tokens = SpotifyToken.objects.filter(user=session_key)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_create_tokens(session_key, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_key)
    print("TIME NOW = ", timezone.now())
    print("EXPIRES = ", expires_in)
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields={'token_type',
                    'expires_in', 'refresh_token', 'access_token'})
    else:
        tokens = SpotifyToken(user=session_key, access_token=access_token,
                              token_type=token_type, expires_in=expires_in, refresh_token=refresh_token)
        tokens.save()


def is_spotify_authenticated(session_key):
    tokens = get_user_tokens(session_key)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_key)

        return True
    return False


def refresh_spotify_token(id):
    refresh_token = get_user_tokens(id).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')

    update_create_tokens(id, access_token, token_type,
                         expires_in, refresh_token)


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):

    token = get_user_tokens(session_id)

    print("token = ", token)

    header = {'Content-Type': 'application/json',
              'Authorization': "Bearer " + token.access_token}

    if post_:
        post(BASE_URL + endpoint, headers=header)
    if put_:
        put(BASE_URL+endpoint, headers=header)

    response = get(BASE_URL + endpoint, {}, headers=header)
    try:
        return response.json()
    except:
        return {'error': response}
