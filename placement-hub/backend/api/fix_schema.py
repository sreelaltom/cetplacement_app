from django.http import JsonResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["POST", "GET"])
def fix_company_schema(request):
    """
    Endpoint to fix the company table schema by removing logo_url column if it exists
    This is a one-time fix for production database
    """
    try:
        with connection.cursor() as cursor:
            # First, check what columns exist
            cursor.execute("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='api_company'
                ORDER BY ordinal_position
            """)
            current_columns = [row[0] for row in cursor.fetchall()]
            
            result = {
                'before_columns': current_columns,
                'actions_taken': []
            }
            
            # Check if logo_url column exists
            if 'logo_url' in current_columns:
                try:
                    # Drop the logo_url column
                    cursor.execute("ALTER TABLE api_company DROP COLUMN logo_url")
                    result['actions_taken'].append('Dropped logo_url column')
                    
                    # Get columns after the change
                    cursor.execute("""
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name='api_company'
                        ORDER BY ordinal_position
                    """)
                    result['after_columns'] = [row[0] for row in cursor.fetchall()]
                    result['status'] = 'success'
                    result['message'] = 'Database schema fixed successfully'
                    
                except Exception as e:
                    result['status'] = 'error'
                    result['message'] = f'Failed to drop logo_url column: {str(e)}'
                    result['after_columns'] = current_columns
            else:
                result['status'] = 'no_action_needed'
                result['message'] = 'logo_url column does not exist, schema is already correct'
                result['after_columns'] = current_columns
            
            return JsonResponse(result)
            
    except Exception as e:
        import traceback
        return JsonResponse({
            'status': 'error',
            'message': str(e),
            'traceback': traceback.format_exc()
        }, status=500)
