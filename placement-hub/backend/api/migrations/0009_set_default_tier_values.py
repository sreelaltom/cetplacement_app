# Generated migration to set default tier values for existing companies

from django.db import migrations

def set_default_tier_for_companies(apps, schema_editor):
    Company = apps.get_model('api', 'Company')
    # Set tier1 as default for existing companies with no tier
    Company.objects.filter(tier__isnull=True).update(tier='tier1')
    Company.objects.filter(tier='').update(tier='tier1')

def reverse_set_default_tier(apps, schema_editor):
    # Reverse operation - set tier back to null
    Company = apps.get_model('api', 'Company')
    Company.objects.filter(tier='tier1').update(tier=None)

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_ensure_tier_field'),
    ]

    operations = [
        migrations.RunPython(set_default_tier_for_companies, reverse_set_default_tier),
    ]
