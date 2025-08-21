from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import UserProfile, Subject, Post, Company, InterviewExperience


class UserProfileModelTest(TestCase):
    """Test cases for UserProfile model"""
    
    def setUp(self):
        self.user_profile = UserProfile.objects.create(
            supabase_uid='test-uid-123',
            email='test@cet.ac.in',
            full_name='Test User',
            branch='CSE',
            year=3
        )
    
    def test_user_profile_creation(self):
        self.assertEqual(self.user_profile.email, 'test@cet.ac.in')
        self.assertEqual(self.user_profile.points, 0)
        self.assertEqual(str(self.user_profile), 'Test User (test@cet.ac.in)')


class SubjectModelTest(TestCase):
    """Test cases for Subject model"""
    
    def test_subject_creation(self):
        subject = Subject.objects.create(
            name='Data Structures',
            branch='CSE',
            description='Basic data structures course'
        )
        self.assertEqual(str(subject), 'Data Structures (CSE)')
    
    def test_common_subject_creation(self):
        subject = Subject.objects.create(
            name='Aptitude',
            is_common=True,
            description='Quantitative aptitude for placements'
        )
        self.assertEqual(str(subject), 'Aptitude (Common)')


class PostModelTest(TestCase):
    """Test cases for Post model"""
    
    def setUp(self):
        self.user_profile = UserProfile.objects.create(
            supabase_uid='test-uid-123',
            email='test@cet.ac.in',
            full_name='Test User',
            branch='CSE',
            year=3
        )
        self.subject = Subject.objects.create(
            name='Data Structures',
            branch='CSE'
        )
    
    def test_post_creation(self):
        post = Post.objects.create(
            subject=self.subject,
            posted_by=self.user_profile,
            topic='Binary Trees',
            content='Introduction to binary trees...',
            focus_points='Tree traversal, height calculation'
        )
        self.assertEqual(post.net_score, 0)
        self.assertEqual(str(post), 'Binary Trees by Test User')


class APIEndpointTest(APITestCase):
    """Test cases for API endpoints"""
    
    def setUp(self):
        self.user_profile = UserProfile.objects.create(
            supabase_uid='test-uid-123',
            email='test@cet.ac.in',
            full_name='Test User',
            branch='CSE',
            year=3
        )
        self.subject = Subject.objects.create(
            name='Data Structures',
            branch='CSE'
        )
    
    def test_subjects_list_endpoint(self):
        """Test that subjects can be listed"""
        url = reverse('subject-list')
        response = self.client.get(url)
        # Note: This will fail authentication, but tests the URL routing
        self.assertIn(response.status_code, [200, 401, 403])
    
    def test_posts_list_endpoint(self):
        """Test that posts can be listed"""
        url = reverse('post-list')
        response = self.client.get(url)
        # Note: This will fail authentication, but tests the URL routing
        self.assertIn(response.status_code, [200, 401, 403])
