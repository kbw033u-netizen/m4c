import json
import logging

from django.http import JsonResponse
from django.shortcuts import render
from django.utils.text import slugify
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

NATIONAL_SENIOR_PATRONS = [
    {"name": "Rt. Hon. Kalonzo Musyoka", "title": "National Senior Patron", "focus": "National unity and civic dialogue"},
    {"name": "Prof. Kivutha Kibwana", "title": "National Senior Patron", "focus": "Governance and constitutionalism"},
    {"name": "Amb. Muthoni W. Gichuru", "title": "National Senior Patron", "focus": "Diplomacy and peacebuilding"},
    {"name": "Dr. Fredrick Ojiambo", "title": "National Senior Patron", "focus": "Youth inclusion and county engagement"},
    {"name": "Hon. Esther Passaris", "title": "National Senior Patron", "focus": "Community mobilization and service"},
]

NATIONAL_LEADERSHIP = [
    {"name": "Moses K. Mwacharo", "title": "National Chairperson", "focus": "Movement strategy and mobilization"},
    {"name": "Aisha Njeri", "title": "National Vice Chairperson", "focus": "Women and community leadership"},
    {"name": "Joseph Ndambuki", "title": "National Secretary General", "focus": "Operations and coordination"},
    {"name": "Sarah W. Mwangangi", "title": "National Women Leader", "focus": "Women, peace and inclusion"},
    {"name": "Peter Otieno", "title": "National Youth Leader", "focus": "Youth mobilization and civic education"},
    {"name": "Njeri Wambui", "title": "National Organising Secretary", "focus": "Grassroots outreach"},
    {"name": "Daniel Kivuva", "title": "National Communications Director", "focus": "Public engagement and advocacy"},
    {"name": "Hellen Achieng", "title": "National Finance Secretary", "focus": "Resource mobilization"},
]

REGIONAL_LEADERSHIP = [
    {"region": "Coast", "leaders": [
        ("Mombasa", "Amina Kilonzo", "Regional Coordinator"),
        ("Kilifi", "Salim Badi", "Regional Outreach Lead"),
        ("Kwale", "Hawa Mtai", "Regional Liaison Officer"),
    ]},
    {"region": "Western", "leaders": [
        ("Kakamega", "John M. Mukhwana", "Regional Coordinator"),
        ("Bungoma", "Faith Wanyonyi", "Regional Outreach Lead"),
        ("Busia", "Joseph Wafula", "Regional Liaison Officer"),
    ]},
    {"region": "Rift Valley", "leaders": [
        ("Nakuru", "Edwin Kibet", "Regional Coordinator"),
        ("Kisumu", "Millicent Awuor", "Regional Outreach Lead"),
        ("Kericho", "Josephat Kiptoo", "Regional Liaison Officer"),
    ]},
    {"region": "Central & Nairobi", "leaders": [
        ("Nairobi", "Wycliffe Mugo", "Regional Coordinator"),
        ("Kiambu", "Mary Njeri", "Regional Outreach Lead"),
        ("Nyeri", "Henry Muthoni", "Regional Liaison Officer"),
    ]},
]

COUNTY_LEADERSHIP = [
    {"county": "Nairobi", "leader": "Jane M. Wanjiru", "title": "County Chairperson"},
    {"county": "Kiambu", "leader": "Peter Kiboro", "title": "County Chairperson"},
    {"county": "Nakuru", "leader": "Grace Kibet", "title": "County Chairperson"},
    {"county": "Kisumu", "leader": "Kennedy Ouma", "title": "County Chairperson"},
    {"county": "Mombasa", "leader": "Mariam Ali", "title": "County Chairperson"},
    {"county": "Kakamega", "leader": "Beatrice Naliaka", "title": "County Chairperson"},
    {"county": "Meru", "leader": "Paul M. Kirimi", "title": "County Chairperson"},
    {"county": "Garissa", "leader": "Abdi Noor", "title": "County Chairperson"},
]

COMRADES_GROUPS = [
    {"title": "Ward structure", "description": "Every ward is organised into a local leadership and outreach structure that keeps the movement close to communities."},
    {"title": "Sub-county teams", "description": "Sub-county champions coordinate mobilization, dialogue forums, and local volunteer engagement."},
    {"title": "Youth and women circles", "description": "Dedicated circles connect young people, women leaders, and community advocates to county action plans."},
    {"title": "Campus and civic clubs", "description": "University, college, and school-based comrades drive civic education and peaceful participation."},
]


def make_county_profiles():
    base = []
    for county in COUNTIES:
        slug = slugify(county)
        base.append({
            "name": county,
            "slug": slug,
            "region": "National county network",
            "county_patron": "County Patron to be confirmed",
            "sub_county_patron": "Sub-county patron to be confirmed",
            "ward_leadership": "Ward leadership structure under development",
            "focus": "Peacebuilding, outreach and mobilization",
        })
    return base

COUNTY_PROFILES = make_county_profiles()


def home(request):
    return render(request, "index.html", {
        "counties": COUNTIES,
        "values": VALUES,
        "stats": STATS,
    })


def leadership(request):
    return render(request, "leadership.html", {
        "senior_patrons": NATIONAL_SENIOR_PATRONS,
        "national_leadership": NATIONAL_LEADERSHIP,
        "regional_leadership": REGIONAL_LEADERSHIP,
        "county_leadership": COUNTY_LEADERSHIP,
    })


def comrades(request):
    return render(request, "comrades.html", {
        "groups": COMRADES_GROUPS,
        "counties": COUNTIES,
    })


def counties(request):
    return render(request, "counties.html", {
        "counties": COUNTY_PROFILES,
    })


def county_detail(request, slug):
    county = next((item for item in COUNTY_PROFILES if item["slug"] == slug), None)
    if county is None:
        return render(request, "county_detail.html", {
            "county": {"name": "County", "description": "County profile not yet available."},
        }, status=404)
    return render(request, "county_detail.html", {"county": county})


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
