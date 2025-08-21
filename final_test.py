#!/usr/bin/env python
"""
Final deployment test after fixing all issues
"""
import os
import sys
import subprocess
import json

def test_backend():
    """Test backend deployment readiness"""
    print("🔧 Testing Backend...")
    
    # Change to backend directory
    os.chdir(r"C:\Users\sreel\OneDrive\Desktop\placement_website\placement-hub\backend")
    
    # Test Django settings
    os.environ['DJANGO_SETTINGS_MODULE'] = 'hub.production_settings'
    try:
        import django
        django.setup()
        print("✅ Django setup successful")
        
        # Test WSGI import
        from hub.wsgi import application
        print("✅ WSGI application import successful")
        
        # Test views import
        from api import views
        print("✅ API views import successful")
        
        # Test JSON validation
        with open('vercel.json', 'r') as f:
            json.load(f)
        print("✅ vercel.json is valid")
        
        return True
    except Exception as e:
        print(f"❌ Backend test failed: {e}")
        return False

def test_frontend():
    """Test frontend deployment readiness"""
    print("\n🔧 Testing Frontend...")
    
    # Change to frontend directory  
    os.chdir(r"C:\Users\sreel\OneDrive\Desktop\placement_website\placement-hub\frontend")
    
    try:
        # Test package.json
        with open('package.json', 'r') as f:
            package_data = json.load(f)
        print("✅ package.json is valid")
        
        # Test vercel.json
        with open('vercel.json', 'r') as f:
            json.load(f)
        print("✅ vercel.json is valid")
        
        # Check if dist exists (built)
        if os.path.exists('dist'):
            print("✅ Frontend build exists")
        else:
            print("ℹ️  Frontend needs to be built")
            
        return True
    except Exception as e:
        print(f"❌ Frontend test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Final Deployment Readiness Test\n")
    
    backend_ok = test_backend()
    frontend_ok = test_frontend()
    
    if backend_ok and frontend_ok:
        print("\n🎉 ALL TESTS PASSED! Ready for Vercel deployment.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Check errors above.")
        sys.exit(1)
