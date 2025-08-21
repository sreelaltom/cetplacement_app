# Generated manually to fix production database schema mismatch

from django.db import migrations, connection


def remove_logo_url_if_exists(apps, schema_editor):
    """Remove logo_url column if it exists in the database"""
    with connection.cursor() as cursor:
        try:
            # Check if the column exists
            cursor.execute("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='api_company' AND column_name='logo_url'
            """)
            if cursor.fetchone():
                # Column exists, remove it
                cursor.execute("ALTER TABLE api_company DROP COLUMN logo_url")
                print("Removed logo_url column from api_company table")
            else:
                print("logo_url column doesn't exist in api_company table")
        except Exception as e:
            print(f"Error checking/removing logo_url column: {e}")


def add_logo_url_back(apps, schema_editor):
    """Add logo_url column back (for migration reversal)"""
    with connection.cursor() as cursor:
        try:
            cursor.execute("ALTER TABLE api_company ADD COLUMN logo_url VARCHAR(200)")
            print("Added logo_url column back to api_company table")
        except Exception as e:
            print(f"Error adding logo_url column back: {e}")


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_set_default_tier_values'),
    ]

    operations = [
        migrations.RunPython(remove_logo_url_if_exists, add_logo_url_back),
    ]
