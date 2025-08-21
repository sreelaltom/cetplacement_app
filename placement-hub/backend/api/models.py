# Copilot Prompt:
# Create Django models for a placement hub where:
# - User is linked to Supabase Auth UID (store profile info)
# - Subject has name, branch
# - Post belongs to a Subject and contains topic, notes_link, video_link, focus_points, posted_by
# - Company has name and description
# - InterviewExperience belongs to Company and contains rounds, questions, tips, posted_by
# Use Django ORM.

from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended user profile linked to Supabase Auth UID"""
    supabase_uid = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    branch = models.CharField(max_length=100, blank=True, null=True)  # Keep as CharField for now
    year = models.IntegerField(choices=[(1, '1st Year'), (2, '2nd Year'), (3, '3rd Year'), (4, '4th Year')])
    points = models.IntegerField(default=0)
    placement_status = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.email})"


class Branch(models.Model):
    """Branches that can be managed by admin"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Branches"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Subject(models.Model):
    """Subjects for placement preparation"""
    name = models.CharField(max_length=100)
    branch = models.CharField(max_length=100, blank=True, null=True)  # Keep as CharField for now
    description = models.TextField(blank=True)
    is_common = models.BooleanField(default=False)  # True for subjects like Aptitude, Coding
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['name', 'branch']

    def __str__(self):
        if self.is_common:
            return f"{self.name} (Common)"
        return f"{self.name} ({self.branch})"


class Post(models.Model):
    """Posts within subjects containing study materials"""
    POST_TYPE_CHOICES = [
        ('question', 'Question'),
        ('notes', 'Notes/Documents'),
        ('tip', 'Tip/Trick'),
        ('resource', 'Resource'),
    ]
    
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='posts')
    posted_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='posts')
    post_type = models.CharField(max_length=20, choices=POST_TYPE_CHOICES, default='question')
    topic = models.CharField(max_length=200)
    notes_link = models.URLField(blank=True, null=True)
    video_link = models.URLField(blank=True, null=True)
    focus_points = models.TextField(blank=True)
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.topic} by {self.posted_by.full_name}"

    @property
    def net_score(self):
        return self.upvotes - self.downvotes


class PostVote(models.Model):
    """Track user votes on posts"""
    VOTE_CHOICES = [
        (1, 'Upvote'),
        (-1, 'Downvote'),
    ]
    
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    vote = models.IntegerField(choices=VOTE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'post']


class Company(models.Model):
    """Companies for placement preparation"""
    name = models.CharField(max_length=100, unique=True)
    website = models.URLField(blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True)
    salary_range = models.CharField(max_length=100, blank=True, help_text="e.g., 5-10 LPA")
    tier = models.CharField(max_length=20, choices=[
        ('tier1', 'Tier 1'),
        ('tier2', 'Tier 2'), 
        ('tier3', 'Tier 3'),
        ('startup', 'Startup'),
        ('mnc', 'MNC'),
    ], blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.name


class InterviewExperience(models.Model):
    """Interview experiences shared by students"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='interview_experiences')
    posted_by = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='interview_experiences')
    position = models.CharField(max_length=100)
    interview_date = models.DateField()
    rounds = models.TextField()  # JSON or structured text describing rounds
    questions = models.TextField()
    tips = models.TextField(blank=True)
    difficulty_level = models.IntegerField(choices=[(1, 'Easy'), (2, 'Medium'), (3, 'Hard')])
    result = models.CharField(max_length=50, choices=[
        ('selected', 'Selected'),
        ('rejected', 'Rejected'),
        ('pending', 'Pending'),
    ])
    upvotes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.company.name} - {self.position} by {self.posted_by.full_name}"


class ExperienceVote(models.Model):
    """Track user votes on interview experiences"""
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    experience = models.ForeignKey(InterviewExperience, on_delete=models.CASCADE)
    is_upvote = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'experience']
