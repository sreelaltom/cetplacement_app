from django.http import JsonResponse
from django.db import connection

def debug_company_schema(request):
    """Debug endpoint to check the actual database schema for companies table"""
    try:
        with connection.cursor() as cursor:
            # Get column information for api_company table
            cursor.execute("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = 'api_company'
                ORDER BY ordinal_position
            """)
            columns = cursor.fetchall()
            
            # Format the results
            schema_info = []
            for col in columns:
                schema_info.append({
                    'column_name': col[0],
                    'data_type': col[1],
                    'is_nullable': col[2],
                    'column_default': col[3]
                })
        
        return JsonResponse({
            'table_name': 'api_company',
            'columns': schema_info,
            'total_columns': len(schema_info)
        })
    
    except Exception as e:
        import traceback
        return JsonResponse({
            'error': str(e),
            'traceback': traceback.format_exc()
        }, status=500)
