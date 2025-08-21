# Generated manually to ensure tier field exists

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_remove_logo_url_field'),
    ]

    operations = [
        # Try to add tier field, ignore if it already exists
        migrations.RunSQL(
            "ALTER TABLE api_company ADD COLUMN IF NOT EXISTS tier VARCHAR(20);",
            reverse_sql="ALTER TABLE api_company DROP COLUMN IF EXISTS tier;"
        ),
    ]
