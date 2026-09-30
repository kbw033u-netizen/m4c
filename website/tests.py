import json

from django.test import Client, SimpleTestCase
from django.urls import reverse


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

    def test_counties_page_lists_kenya_counties(self):
        response = self.client.get(reverse("counties"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "M4C Across Kenya")
        self.assertContains(response, "Nairobi")
        self.assertContains(response, "Ward leadership")

    def test_comrades_page_renders(self):
        response = self.client.get(reverse("comrades"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Comrades")
        self.assertContains(response, "Ward structure")


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
