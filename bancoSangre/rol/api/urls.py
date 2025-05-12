# rol/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rol.api.views import RolViewSet

router = DefaultRouter()
router.register(r'rol', RolViewSet, basename='rol')

urlpatterns = router.urls
