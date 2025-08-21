import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hub.settings')
django.setup()

from api.models import Branch, Subject

def create_initial_data():
    """Create initial branches and placement subjects"""
    
    # Clear existing data
    print("Clearing existing data...")
    Subject.objects.all().delete()
    Branch.objects.all().delete()
    print("Existing data cleared.")
    
    # Define branches and their placement subjects (optimized for placement relevance)
    branches_data = {
        "Computer Science Engineering": [
            "Data Structures & Algorithms",   # ✅ Core for coding rounds
            "Object Oriented Programming",    # ✅ Interview favorite
            "Database Management Systems",    # ✅ SQL & theory asked a lot
            "Operating Systems",              # ✅ Frequently asked in interviews
            "Computer Networks",              # ✅ Core CS subject
            "System Design",                  # ✅ For product companies / higher packages
            "Web Development",                # ✅ MERN/Full-stack very useful
            "App Development",                # ✅ Android/iOS basics
            "Machine Learning & AI",          # ✅ ML basics + projects
            "Cloud Computing & DevOps"       # ✅ For product companies / higher packages
        ],

        "Electronics and Communication Engineering": [
            "Digital Electronics",            # ✅ Core subject
            "Microprocessors",                # ✅ Frequently asked
            "Communication Systems",          # ✅ Interview favorite
            "Signal Processing",              # ✅ Important for core ECE roles
            "Embedded Systems"                # ✅ For VLSI / chip design
        ],

        "Electrical and Electronics Engineering": [
            "Circuit Analysis",               # ✅ Basic foundation
            "Electrical Machines",            # ✅ Always asked in EE interviews
            "Power Systems",                  # ✅ Very common
            "Control Systems",                # ✅ Both EE & ECE relevance
            "Power Electronics"               # ✅ Important for PSU / core companies
        ],

        "Mechanical Engineering": [
            "Thermodynamics",                 # ✅ Core mech subject
            "Strength of Materials",          # ✅ Frequently asked
            "Machine Design",                 # ✅ Important for design-based interviews
            "Manufacturing Processes",        # ✅ Very common in placements
            "Fluid Mechanics"                 # ✅ PSU + core relevance
        ],

        "Civil Engineering": [
            "Structural Analysis",            # ✅ Core subject
            "Geotechnical Engineering",       # ✅ Common in interviews
            "Concrete Technology",            # ✅ Basics always asked
            "Transportation Engineering",     # ✅ Important for placements
            "Environmental Engineering"       # ✅ PSU & govt sector
        ],

        "Architecture": [
            "Architectural Design",           # ✅ Core focus
            "Building Construction",          # ✅ Frequently asked
            "Urban Planning",                 # ✅ Relevant for placements
            "Environmental Design",           # ✅ Sustainability focus
            "Sustainable Architecture"        # ✅ Modern trend + interview topic
        ]
    }
    
    # Common placement subjects (for all branches)
    common_subjects = [
        "Quantitative Aptitude",                  # ✅ Always in written test
        "Logical Reasoning",                      # ✅ Core for aptitude
        "Verbal Ability & Reading Comprehension", # ✅ English skills test
        "Data Interpretation",                    # ✅ Numerical reasoning
        "General Knowledge",                      # ✅ For PSU/govt sector
        "Current Affairs",                        # ✅ Interviews / HR
        "Technical Interview Preparation"         # ✅ HR + core technical mix
    ]
    
    created_branches = 0
    created_subjects = 0
    
    # Create branches
    print("Creating branches...")
    for branch_name in branches_data.keys():
        branch, created = Branch.objects.get_or_create(
            name=branch_name,
            defaults={
                'description': f'{branch_name} department',
                'is_active': True
            }
        )
        if created:
            created_branches += 1
            print(f"Created branch: {branch_name}")
    
    # Create common subjects
    print("\nCreating common subjects...")
    for subject_name in common_subjects:
        subject, created = Subject.objects.get_or_create(
            name=subject_name,
            branch=None,
            defaults={
                'description': f'Common placement preparation subject: {subject_name}',
                'is_common': True
            }
        )
        if created:
            created_subjects += 1
            print(f"Created common subject: {subject_name}")
    
    # Create branch-specific subjects
    print("\nCreating branch-specific subjects...")
    for branch_name, subjects in branches_data.items():
        try:
            branch = Branch.objects.get(name=branch_name)
            for subject_name in subjects:
                subject, created = Subject.objects.get_or_create(
                    name=subject_name,
                    branch=branch,
                    defaults={
                        'description': f'{branch_name} placement subject: {subject_name}',
                        'is_common': False
                    }
                )
                if created:
                    created_subjects += 1
                    print(f"Created {branch_name} subject: {subject_name}")
        except Branch.DoesNotExist:
            print(f"Branch {branch_name} not found!")
    
    print(f"\n=== Summary ===")
    print(f"Branches created: {created_branches}")
    print(f"Subjects created: {created_subjects}")
    print(f"Total branches in database: {Branch.objects.count()}")
    print(f"Total subjects in database: {Subject.objects.count()}")
    
    # Display branch statistics
    print(f"\n=== Branch Statistics ===")
    for branch in Branch.objects.all():
        subject_count = Subject.objects.filter(branch=branch).count()
        print(f"{branch.name}: {subject_count} subjects")
    
    common_count = Subject.objects.filter(is_common=True).count()
    print(f"Common subjects: {common_count}")

if __name__ == "__main__":
    create_initial_data()
