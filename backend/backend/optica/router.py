from rest_framework import routers

from .views import *

router = routers.DefaultRouter()

router.register(r'users', UserViewSet)
router.register(r'pacientes', PacienteViewSet)
router.register(r'recetas', RecetaViewSet)
router.register(r'proveedores', ProveedorViewSet)
router.register(r'cristales', CristalViewSet)
router.register(r'rangos-cristales', RangoCristalViewSet)

router.register(r'cristales-tabla-rangos', CristalTablaRangosViewSet)

router.register(r'armazones', ArmazonViewSet)

router.register(r'marcas-from-proveedor', MarcasFromProveedorViewSet, basename='MarcasFromProveedorViewSet')

router.register(r'cristables-disponibles', CristablesDisponiblesViewSet, basename='CristablesDisponiblesViewSet')