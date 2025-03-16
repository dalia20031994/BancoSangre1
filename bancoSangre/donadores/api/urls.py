from rest_framework.routers import DefaultRouter
from donadores.api.views import donadoresViewSet

router = DefaultRouter()
router.register('donadores', donadoresViewSet, basename='donador')
urlpatterns = router.urls
