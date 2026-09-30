# Movement for Change (M4C)

M4C is a Django website served either by Django's development server or by Tornado wrapping the Django WSGI application.

## Setup

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python manage.py migrate
```

## Run

Run Django directly:

```sh
python manage.py runserver 0.0.0.0:8000
```

Or run the same Django application through Tornado:

```sh
python run_tornado.py
```

Tornado listens on `0.0.0.0:8000` by default. Set `HOST` or `PORT` to change its bind address.

The volunteer registration endpoint accepts JSON at `POST /api/volunteers`. Browser submissions include Django's CSRF token.