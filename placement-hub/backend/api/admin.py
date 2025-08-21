from django.contrib import admin
from .models import Branch, UserProfile, Subject, Post, PostVote, Company, InterviewExperience, ExperienceVote

# Custom admin configuration for Branch
@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at',)
    ordering = ('name',)
    
    fieldsets = (
        ('Branch Information', {
            'fields': ('name', 'description', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        })
    )

# Custom admin configuration for UserProfile
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'branch', 'year', 'points', 'created_at')
    list_filter = ('branch', 'year', 'created_at')
    search_fields = ('email', 'full_name')
    readonly_fields = ('supabase_uid', 'created_at', 'updated_at')
    ordering = ('-points', '-created_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('supabase_uid', 'email', 'full_name')
        }),
        ('Academic Details', {
            'fields': ('branch', 'year')
        }),
        ('Profile', {
            'fields': ('placement_status', 'points')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

# Custom admin configuration for Subject
@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'branch', 'is_common', 'posts_count', 'created_at')
    list_filter = ('branch', 'is_common', 'created_at')
    search_fields = ('name', 'description', 'branch')
    readonly_fields = ('created_at', 'posts_count')
    ordering = ('branch', 'name')
    
    fieldsets = (
        ('Subject Information', {
            'fields': ('name', 'description')
        }),
        ('Classification', {
            'fields': ('branch', 'is_common')
        }),
        ('Statistics', {
            'fields': ('posts_count',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        })
    )
    
    def posts_count(self, obj):
        return obj.post_set.count()
    posts_count.short_description = 'Number of Posts'

# Custom admin configuration for Post
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('topic', 'subject', 'posted_by', 'upvotes', 'downvotes', 'net_votes', 'created_at')
    list_filter = ('subject__branch', 'subject', 'created_at')
    search_fields = ('topic', 'focus_points', 'posted_by__full_name')
    readonly_fields = ('upvotes', 'downvotes', 'net_votes', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Post Information', {
            'fields': ('topic', 'subject', 'posted_by')
        }),
        ('Content', {
            'fields': ('notes_link', 'video_link', 'focus_points')
        }),
        ('Engagement', {
            'fields': ('upvotes', 'downvotes', 'net_votes'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def net_votes(self, obj):
        return obj.upvotes - obj.downvotes
    net_votes.short_description = 'Net Votes'

# Custom admin configuration for Company
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'tier', 'salary_range', 'experiences_count', 'created_at')
    list_filter = ('tier', 'created_at')
    search_fields = ('name', 'salary_range')
    readonly_fields = ('created_at', 'experiences_count')
    ordering = ('name',)
    
    fieldsets = (
        ('Company Information', {
            'fields': ('name', 'tier')
        }),
        ('Details', {
            'fields': ('website', 'logo_url', 'salary_range')
        }),
        ('Statistics', {
            'fields': ('experiences_count',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        })
    )
    
    def experiences_count(self, obj):
        return obj.interviewexperience_set.count()
    experiences_count.short_description = 'Number of Experiences'

# Custom admin configuration for InterviewExperience
@admin.register(InterviewExperience)
class InterviewExperienceAdmin(admin.ModelAdmin):
    list_display = ('company', 'position', 'result', 'difficulty_level', 'posted_by', 'upvotes', 'created_at')
    list_filter = ('result', 'difficulty_level', 'company', 'created_at')
    search_fields = ('company__name', 'position', 'rounds', 'posted_by__full_name')
    readonly_fields = ('upvotes', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Experience Information', {
            'fields': ('company', 'position', 'posted_by')
        }),
        ('Interview Details', {
            'fields': ('interview_date', 'rounds', 'questions', 'difficulty_level', 'result')
        }),
        ('Additional Information', {
            'fields': ('tips',)
        }),
        ('Engagement', {
            'fields': ('upvotes',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

# Custom admin configuration for PostVote
@admin.register(PostVote)
class PostVoteAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'vote', 'created_at')
    list_filter = ('vote', 'created_at')
    search_fields = ('post__topic', 'user__full_name')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

# Custom admin configuration for ExperienceVote
@admin.register(ExperienceVote)
class ExperienceVoteAdmin(admin.ModelAdmin):
    list_display = ('experience', 'user', 'is_upvote', 'created_at')
    list_filter = ('is_upvote', 'created_at')
    search_fields = ('experience__company__name', 'experience__position', 'user__full_name')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

# Inline admin for votes (optional - shows votes within posts/experiences)
class PostVoteInline(admin.TabularInline):
    model = PostVote
    extra = 0
    readonly_fields = ('user', 'vote')

class ExperienceVoteInline(admin.TabularInline):
    model = ExperienceVote
    extra = 0
    readonly_fields = ('user', 'is_upvote')

# Register inline models (optional)
# Uncomment these lines if you want to see votes within the main admin pages
# PostAdmin.inlines = [PostVoteInline]
# InterviewExperienceAdmin.inlines = [ExperienceVoteInline]

# Customize admin site header and title
admin.site.site_header = "CET Placement Hub Admin"
admin.site.site_title = "CET Placement Hub"
admin.site.index_title = "Welcome to CET Placement Hub Administration"
