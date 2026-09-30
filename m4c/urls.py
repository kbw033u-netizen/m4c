from django.contrib import admin
from django.urls import path

from website import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.home, name="home"),
    path("leadership/", views.leadership, name="leadership"),
    path("comrades/", views.comrades, name="comrades"),
    path("counties/", views.counties, name="counties"),
    path("counties/<slug:slug>/", views.county_detail, name="county-detail"),
    path("api/volunteers", views.volunteer_registration, name="volunteer-registration"),
]
