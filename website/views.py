import json
import logging

from django.http import JsonResponse
from django.shortcuts import render
from django.views.csrf import csrf_failure as default_csrf_failure
from django.views.decorators.http import require_POST

logger = logging.getLogger(__name__)

COUNTIES = [
    "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa", "Wajir", "Mandera", "Marsabit",
    "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga",
    "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo-Marakwet",
    "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga",
    "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi",
]

VALUES = [
    ("Peace", "Promoting peaceful coexistence and non-violent approaches.", "✧", "blue"),
    ("Unity", "Bringing people and communities together around shared aspirations.", "◎", "yellow"),
    ("Integrity", "Upholding honesty, accountability and ethical conduct.", "✓", "green"),
    ("Respect", "Recognizing the dignity, rights and perspectives of every person.", "♡", "red"),
    ("Inclusivity", "Creating space for people from diverse backgrounds to participate.", "◈", "teal"),
    ("Dialogue", "Encouraging communication, listening and constructive engagement.", "↔", "blue"),
    ("Service", "Putting communities and the common good at the heart of our work.", "→", "yellow"),
]

STATS = [
    ("1000+", "Peace Ambassadors", "🕊️"),
    ("47", "Counties Engaged", "🗺️"),
    ("15K+", "Citizens Mobilized", "👥"),
    ("500+", "Community Leaders", "🎯"),
]


def home(request):
    return render(request, "index.html", {
        "counties": COUNTIES,
        "values": VALUES,
        "stats": STATS,
    })


def csrf_failure(request, reason=""):
    if request.path == "/api/volunteers":
        return JsonResponse(
            {"message": "Your form security token expired. Reload the page and try again."},
            status=403,
        )
    return default_csrf_failure(request, reason=reason)


@require_POST
def volunteer_registration(request):
    try:
        payload = json.loads(request.body or b"{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"message": "Invalid JSON"}, status=400)

    if not isinstance(payload, dict):
        return JsonResponse({"message": "Invalid request body"}, status=400)

    field_names = ("fullName", "phoneNumber", "county", "interest", "email")
    data = {
        name: payload.get(name, "").strip() if isinstance(payload.get(name, ""), str) else ""
        for name in field_names
    }

    if any(not data[name] for name in field_names[:4]):
        return JsonResponse({"message": "Missing required fields"}, status=400)

    logger.info("New volunteer registration: %s", data)
    return JsonResponse({
        "message": "Thank you! Welcome to M4C. Check your WhatsApp for next steps!",
        "data": data,
    })
