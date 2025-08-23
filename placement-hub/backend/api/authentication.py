"""
Custom authentication backend for Supabase JWT tokens
"""

from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
import requests
from django.conf import settings
from .models import UserProfile


class SupabaseAuthentication(BaseAuthentication):
    """
    Custom authentication class for Supabase JWT tokens
    """
    
    def authenticate(self, request):
        """
        Authenticate the request using Supabase JWT token
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
            
        token = auth_header.split(' ')[1]
        
        try:
            # Verify the JWT token with Supabase
            decoded_token = self.verify_supabase_token(token)
            
            # Get or create user profile
            user_profile = self.get_or_create_user_profile(decoded_token)
            
            return (user_profile, token)
            
        except Exception as e:
            raise AuthenticationFailed(f'Authentication failed: {str(e)}')
    
    def verify_supabase_token(self, token):
        """
        Verify JWT token with Supabase
        """
        try:
            # For debugging: decode without verification to see the token structure
            decoded_token = jwt.decode(
                token, 
                options={"verify_signature": False}
            )
            print(f"DEBUG: Decoded token: {decoded_token}")
            
            # Check if token has required fields
            if not decoded_token.get('sub') or not decoded_token.get('email'):
                raise AuthenticationFailed('Invalid token payload')
                
            return decoded_token
            
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
    
    def get_or_create_user_profile(self, decoded_token):
        """
        Get or create user profile from decoded token
        """
        supabase_uid = decoded_token.get('sub')
        email = decoded_token.get('email')
        
        if not supabase_uid or not email:
            raise AuthenticationFailed('Invalid token payload')
        
        # Check if email is from allowed domain
        if not email.endswith('@cet.ac.in'):
            raise AuthenticationFailed('Only @cet.ac.in emails are allowed')
        
        try:
            user_profile = UserProfile.objects.get(supabase_uid=supabase_uid)
        except UserProfile.DoesNotExist:
            # Create new user profile
            user_profile = UserProfile.objects.create(
                supabase_uid=supabase_uid,
                email=email,
                full_name=decoded_token.get('user_metadata', {}).get('full_name', ''),
                branch='',  # Will be updated by user
                year=1  # Default value
            )
        
        # Add supabase_uid to user object for easy access
        user_profile.supabase_uid = supabase_uid
        
        return user_profile
