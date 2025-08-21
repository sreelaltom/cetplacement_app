from rest_framework import serializers
from .models import (
    Branch, UserProfile, Subject, Post, Company,
    InterviewExperience
)

class BranchSerializer(serializers.ModelSerializer):
    """Serializer for branches"""
    
    class Meta:
        model = Branch
        fields = ['id', 'name', 'description', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profiles"""
    
    class Meta:
        model = UserProfile
        fields = ['id', 'supabase_uid', 'email', 'full_name', 'branch', 'year', 
                 'bio', 'skills', 'linkedin_url', 'github_url', 'points', 
                 'placement_status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'points', 'created_at', 'updated_at']


class SubjectSerializer(serializers.ModelSerializer):
    """Serializer for subjects"""
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Subject
        fields = ['id', 'name', 'branch', 'description', 'is_common', 
                 'posts_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_posts_count(self, obj):
        return obj.posts.count()


class PostSerializer(serializers.ModelSerializer):
    """Serializer for posts"""
    posted_by_name = serializers.CharField(source='posted_by.full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    net_score = serializers.ReadOnlyField()
    user_vote = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'subject', 'subject_name', 'posted_by', 'posted_by_name', 
                 'post_type', 'topic', 'notes_link', 'video_link', 'focus_points',
                 'upvotes', 'downvotes', 'net_score', 'user_vote', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'posted_by', 'upvotes', 'downvotes', 
                           'created_at', 'updated_at']
    
    def get_user_vote(self, obj):
        """Get current user's vote on this post"""
        request = self.context.get('request')
        if request and hasattr(request, 'user') and hasattr(request.user, 'supabase_uid'):
            try:
                from .models import PostVote
                vote = PostVote.objects.filter(user=request.user, post=obj).first()
                return vote.vote if vote else None
            except Exception:
                return None
        return None


class CompanySerializer(serializers.ModelSerializer):
    """Serializer for companies"""
    experiences_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'name', 'website', 'logo_url', 
                 'salary_range', 'tier', 'experiences_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_experiences_count(self, obj):
        return obj.interview_experiences.count()


class InterviewExperienceSerializer(serializers.ModelSerializer):
    """Serializer for interview experiences"""
    posted_by_name = serializers.CharField(source='posted_by.full_name', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    user_voted = serializers.SerializerMethodField()
    
    class Meta:
        model = InterviewExperience
        fields = ['id', 'company', 'company_name', 'posted_by', 'posted_by_name',
                 'position', 'interview_date', 'rounds', 'questions', 'tips',
                 'difficulty_level', 'result', 'upvotes', 'user_voted',
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'posted_by', 'upvotes', 'created_at', 'updated_at']
    
    def get_user_voted(self, obj):
        """Check if current user has voted on this experience"""
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            try:
                user_profile = UserProfile.objects.get(supabase_uid=request.user.supabase_uid)
                vote = obj.experiencevote_set.filter(user=user_profile).first()
                return vote.is_upvote if vote else None
            except UserProfile.DoesNotExist:
                return None
        return None



