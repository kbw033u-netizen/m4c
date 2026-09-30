import json

from django.conf import settings
from django.test import Client, SimpleTestCase
from django.urls import reverse

from website.views import COUNTY_PROFILES


class HomePageTests(SimpleTestCase):
    def test_home_page_renders_the_brand_and_leader_photos(self):
        response = self.client.get(reverse("home"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Movement for Change")
        self.assertContains(response, "politician-1.jpeg")
        self.assertContains(response, "politician-2.jpeg")
        self.assertContains(response, "politician-3.jpeg")
        self.assertContains(response, "csrfmiddlewaretoken")


class OrganizationPagesTests(SimpleTestCase):
    def test_leadership_page_has_required_sections(self):
        response = self.client.get(reverse("leadership"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "National Senior Patrons")
        self.assertContains(response, "National Leadership")
        self.assertContains(response, "Regional Leadership")
        self.assertContains(response, "25 members")
        self.assertContains(response, "Deputy Patron")
        self.assertContains(response, "Special Programmes / Stakeholder Relations")
        self.assertNotContains(response, "Kalonzo Musyoka")

    def test_counties_page_lists_kenya_counties(self):
        response = self.client.get(reverse("counties"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "M4C Across Kenya")
        self.assertContains(response, "Nairobi")
        self.assertContains(response, "County map")
        self.assertContains(response, 'id="countySearchForm"')
        self.assertContains(response, 'id="countyMap"')
        self.assertContains(response, "Ward leadership")
        self.assertContains(response, "CC BY 4.0")
        self.assertContains(response, "CC BY 3.0 IGO")
        self.assertContains(response, "Public Domain")

    def test_ward_index_covers_all_counties_and_wards(self):
        self.assertEqual(len(COUNTY_PROFILES), 47)
        self.assertEqual(sum(county["ward_count"] for county in COUNTY_PROFILES), 1450)

        ward_data = json.loads((settings.BASE_DIR / "static/data/kenya-wards.geojson").read_text(encoding="utf-8"))
        self.assertEqual(len(ward_data["features"]), 1450)
        self.assertTrue(all(
            feature["properties"].get("countyName")
            and feature["properties"].get("subcountyName")
            and feature["properties"].get("wardName")
            for feature in ward_data["features"]
        ))

    def test_county_profile_lists_real_subcounties_and_wards(self):
        response = self.client.get(reverse("county-detail", kwargs={"slug": "nairobi"}))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Dagoretti")
        self.assertContains(response, "Mutu-ini Ward")
        self.assertContains(response, "Ward Patron to be confirmed")

    def test_comrades_page_renders(self):
        response = self.client.get(reverse("comrades"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Comrades")
        self.assertContains(response, "Campus Patron")
        self.assertContains(response, "Academic &amp; Policy Lead")
        self.assertContains(response, "Class / Department Ambassadors")
        self.assertContains(response, "Campus Events")
        self.assertContains(response, "Join Comrades")


class VolunteerApiTests(SimpleTestCase):
    url = reverse("volunteer-registration")

    def test_registers_a_volunteer(self):
        payload = {
            "fullName": "Amina Otieno",
            "phoneNumber": "+254700000000",
            "county": "Nairobi",
            "interest": "Youth Leader",
            "email": "amina@example.com",
        }

        response = self.client.post(self.url, json.dumps(payload), content_type="application/json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["data"], payload)

    def test_rejects_missing_required_fields(self):
        response = self.client.post(
            self.url,
            json.dumps({"fullName": "Amina Otieno"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["message"], "Missing required fields")

    def test_rejects_invalid_json(self):
        response = self.client.post(self.url, "{", content_type="application/json")

        self.assertEqual(response.status_code, 400)

    def test_csrf_failure_returns_actionable_json(self):
        client = Client(enforce_csrf_checks=True)
        client.get(reverse("home"))

        response = client.post(
            self.url,
            json.dumps({
                "fullName": "Amina Otieno",
                "phoneNumber": "+254700000000",
                "county": "Nairobi",
                "interest": "Youth Leader",
            }),
            content_type="application/json",
            HTTP_X_CSRFTOKEN="stale-token",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["message"], "Your form security token expired. Reload the page and try again.")
