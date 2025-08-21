# Copilot Prompt:
# Write Django REST Framework API views for:
# - CRUD on Subject
# - CRUD on Post (with filtering by subject)
# - CRUD on Company
# - CRUD on InterviewExperience (with filtering by company)
# Each endpoint should return JSON responses.

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from datetime import date
from django.db import connection

from .models import (
    Branch, UserProfile, Subject, Post, PostVote, Company,
    InterviewExperience, ExperienceVote
)
from .serializers import (
    BranchSerializer, UserProfileSerializer, SubjectSerializer, PostSerializer, 
    CompanySerializer, InterviewExperienceSerializer
)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """Health check endpoint to verify API and database connectivity"""
    try:
        # Test database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        # Test basic model query
        user_count = UserProfile.objects.count()
        company_count = Company.objects.count()
        
        return Response({
            'status': 'healthy',
            'database': 'connected',
            'users': user_count,
            'companies': company_count
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BranchViewSet(viewsets.ModelViewSet):
    """ViewSet for branches"""
    queryset = Branch.objects.filter(is_active=True)
    serializer_class = BranchSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Branch.objects.filter(is_active=True).order_by('name')


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for user profiles"""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow any for testing
    lookup_field = 'supabase_uid'  # Use supabase_uid instead of default 'pk'

    def get_queryset(self):
        # No authentication - return all profiles (Supabase handles auth on frontend)
        return UserProfile.objects.all()

    def retrieve(self, request, *args, **kwargs):
        """Get a specific user profile, with better error handling"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({
                'error': 'User profile not found',
                'supabase_uid': kwargs.get('supabase_uid', 'unknown'),
                'suggestion': 'User profile may need to be created first'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': 'Internal server error',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        return Response({'error': 'Authentication handled by Supabase on frontend'}, status=status.HTTP_501_NOT_IMPLEMENTED)

    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        """Get leaderboard of top contributors"""
        top_users = UserProfile.objects.order_by('-points')[:50]
        serializer = self.get_serializer(top_users, many=True)
        return Response(serializer.data)


class SubjectViewSet(viewsets.ModelViewSet):
    """ViewSet for subjects"""
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow any for testing

    def get_queryset(self):
        queryset = Subject.objects.all()
        branch = self.request.query_params.get('branch', None)
        is_common = self.request.query_params.get('is_common', None)
        name = self.request.query_params.get('name', None)
        
        # Handle 'None' string values (treat them as None)
        if branch == 'None' or branch == '':
            branch = None
        if is_common == 'None' or is_common == '':
            is_common = None
        if name == 'None' or name == '':
            name = None
        
        # Debug logging
        print(f"DEBUG - Query params: name='{name}', branch='{branch}', is_common='{is_common}'")
        
        if name is not None:
            # If both name and branch are provided, filter by both
            if branch is not None:
                queryset = queryset.filter(name__iexact=name, branch=branch)
            else:
                # If only name provided, find by name (any branch or common)
                queryset = queryset.filter(name__iexact=name)
        elif branch is not None:
            # If only branch provided, get subjects for that branch or common ones
            queryset = queryset.filter(Q(branch=branch) | Q(is_common=True))
        elif is_common is not None:
            # If only is_common provided
            queryset = queryset.filter(is_common=is_common.lower() == 'true')
            
        result = queryset.order_by('name')
        print(f"DEBUG - Found {result.count()} subjects")
        return result

    @action(detail=True, methods=['get'])
    def posts(self, request, pk=None):
        """Get all posts for a subject"""
        subject = self.get_object()
        posts = Post.objects.filter(subject=subject).order_by('-created_at')
        
        # Pagination
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = PostSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)


class PostViewSet(viewsets.ModelViewSet):
    """ViewSet for posts"""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow any for testing

    def get_queryset(self):
        queryset = Post.objects.all()
        subject_id = self.request.query_params.get('subject', None)
        search = self.request.query_params.get('search', None)
        
        if subject_id is not None:
            queryset = queryset.filter(subject_id=subject_id)
        if search is not None:
            queryset = queryset.filter(
                Q(topic__icontains=search) | 
                Q(content__icontains=search) |
                Q(focus_points__icontains=search)
            )
            
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        # Since authentication is disabled, we expect posted_by to be passed in the request data
        # The frontend should send the UserProfile ID
        posted_by_id = self.request.data.get('posted_by')
        if posted_by_id:
            try:
                user_profile = UserProfile.objects.get(id=posted_by_id)
                serializer.save(posted_by=user_profile)
                
                # Award points for posting
                user_profile.points += 5
                user_profile.save()
            except UserProfile.DoesNotExist:
                serializer.save()  # Save without posted_by if user not found
        else:
            serializer.save()  # Save without posted_by if not provided

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        """Vote on a post (upvote/downvote)"""
        # Use authenticated user from SupabaseAuthentication
        if not request.user or not hasattr(request.user, 'supabase_uid'):
            return Response({'error': 'Authentication required for voting'}, status=status.HTTP_401_UNAUTHORIZED)
            
        post = self.get_object()
        try:
            user_profile = UserProfile.objects.get(supabase_uid=request.user.supabase_uid)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
            
        vote_value = request.data.get('vote')  # 1 for upvote, -1 for downvote, 0 to remove vote
        
        if vote_value not in [1, -1, 0]:
            return Response({'error': 'Invalid vote value'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle vote removal (toggle off)
        if vote_value == 0:
            try:
                existing_vote = PostVote.objects.get(user=user_profile, post=post)
                old_vote = existing_vote.vote
                existing_vote.delete()
                
                # Update post vote counts
                if old_vote == 1:
                    post.upvotes -= 1
                    # Remove points from post author for removed upvote
                    post.posted_by.points = max(0, post.posted_by.points - 1)
                    post.posted_by.save()
                else:
                    post.downvotes -= 1
                    # Add back 1 point for removed downvote
                    post.posted_by.points += 1
                    post.posted_by.save()
                    
                post.save()
                
                return Response({
                    'message': 'Vote removed successfully',
                    'upvotes': post.upvotes,
                    'downvotes': post.downvotes,
                    'user_vote': None,
                    'net_votes': post.upvotes - post.downvotes
                })
            except PostVote.DoesNotExist:
                return Response({
                    'message': 'No vote to remove',
                    'upvotes': post.upvotes,
                    'downvotes': post.downvotes,
                    'user_vote': None,
                    'net_votes': post.upvotes - post.downvotes
                })
        
        # Handle upvote/downvote
        vote, created = PostVote.objects.get_or_create(
            user=user_profile, 
            post=post,
            defaults={'vote': vote_value}
        )
        
        if not created:
            # Update existing vote
            old_vote = vote.vote
            vote.vote = vote_value
            vote.save()
            
            # Update post vote counts and points for vote change
            if old_vote == 1:
                post.upvotes -= 1
                # Remove points for old upvote
                post.posted_by.points = max(0, post.posted_by.points - 1)
            else:
                post.downvotes -= 1
                # Add back point for old downvote removal
                post.posted_by.points += 1
        
        # Update post vote counts and points for new vote
        if vote_value == 1:
            post.upvotes += 1
            # Award point for new upvote
            post.posted_by.points += 1
        else:
            post.downvotes += 1
            # Deduct point for new downvote
            post.posted_by.points = max(0, post.posted_by.points - 1)
            
        post.save()
        post.posted_by.save()
        
        # Return updated post data
        return Response({
            'message': 'Vote recorded successfully',
            'upvotes': post.upvotes,
            'downvotes': post.downvotes,
            'user_vote': vote_value,
            'net_votes': post.upvotes - post.downvotes
        })


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for companies"""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow any for testing

    def get_queryset(self):
        queryset = Company.objects.all()
        search = self.request.query_params.get('search', None)
        
        if search is not None:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search)
            )
            
        return queryset.order_by('name')

    @action(detail=True, methods=['get'])
    def experiences(self, request, pk=None):
        """Get all interview experiences for a company"""
        company = self.get_object()
        experiences = InterviewExperience.objects.filter(company=company).order_by('-created_at')
        
        # Pagination
        page = self.paginate_queryset(experiences)
        if page is not None:
            serializer = InterviewExperienceSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = InterviewExperienceSerializer(experiences, many=True, context={'request': request})
        return Response(serializer.data)


class InterviewExperienceViewSet(viewsets.ModelViewSet):
    """ViewSet for interview experiences"""
    queryset = InterviewExperience.objects.all()
    serializer_class = InterviewExperienceSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow any for testing

    def get_queryset(self):
        queryset = InterviewExperience.objects.all()
        company_id = self.request.query_params.get('company', None)
        position = self.request.query_params.get('position', None)
        result = self.request.query_params.get('result', None)
        
        if company_id is not None:
            queryset = queryset.filter(company_id=company_id)
        if position is not None:
            queryset = queryset.filter(position__icontains=position)
        if result is not None:
            queryset = queryset.filter(result=result)
            
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        # Set the posted_by to current user
        user_profile = None
        if self.request.user.is_authenticated:
            try:
                user_profile = UserProfile.objects.get(supabase_uid=self.request.user.supabase_uid)
                serializer.save(posted_by=user_profile)
            except UserProfile.DoesNotExist:
                serializer.save()  # Save without posted_by if user profile not found
        else:
            serializer.save()  # Save without posted_by if not authenticated
        
        # Award points for sharing experience (only if user profile exists)
        if user_profile:
            user_profile.points += 10
            user_profile.save()

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        """Vote on an interview experience"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required for voting'}, status=status.HTTP_401_UNAUTHORIZED)
            
        experience = self.get_object()
        try:
            user_profile = UserProfile.objects.get(supabase_uid=request.user.supabase_uid)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)
            
        is_upvote = request.data.get('is_upvote', True)
        
        vote, created = ExperienceVote.objects.get_or_create(
            user=user_profile, 
            experience=experience,
            defaults={'is_upvote': is_upvote}
        )
        
        if not created:
            # Update existing vote
            if vote.is_upvote:
                experience.upvotes -= 1
            
            vote.is_upvote = is_upvote
            vote.save()
        
        # Update experience vote count
        if is_upvote:
            experience.upvotes += 1
        experience.save()
        
        # Award points for the experience author
        if is_upvote:
            experience.posted_by.points += 2
        experience.posted_by.save()
        
        return Response({'message': 'Vote recorded successfully'})


