from django.contrib import admin
from django.urls import path

from website import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.home, name="home"),
    path("api/volunteers", views.volunteer_registration, name="volunteer-registration"),
]
