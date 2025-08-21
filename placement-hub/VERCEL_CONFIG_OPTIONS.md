# Alternative Vercel Configuration for Django

If the current configuration still has issues, you can try this simpler approach:

## Option 1: Current Configuration (Recommended)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "hub/wsgi.py",
      "use": "@vercel/python",
      "config": {
        "maxLambdaSize": "15mb",
        "runtime": "python3.9"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "hub/wsgi.py"
    }
  ],
  "env": {
    "DJANGO_SETTINGS_MODULE": "hub.settings"
  }
}
```

## Option 2: Ultra-Simple Configuration (If Option 1 fails)

```json
{
  "builds": [
    {
      "src": "hub/wsgi.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "hub/wsgi.py"
    }
  ]
}
```

## Option 3: Using Functions (Alternative approach)

```json
{
  "functions": {
    "api/app.py": {
      "runtime": "python3.9"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/app.py"
    }
  ]
}
```

The current configuration (Option 1) should work fine now that we've removed the conflicting builds/functions setup.
