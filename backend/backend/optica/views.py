from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser 
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from django.http import JsonResponse
from django.core.serializers import serialize
import json

from django.contrib.auth.models import User
from .serializers import *
from .models import *

from django.db import connection
from collections import namedtuple

class MeView(APIView):
    # permission_classes = [IsAdminUser]
    # permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = JWTAuthentication().authenticate(request)[0]
        return Response({
            "username": user.username
        })

class UserViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PacienteViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAdminUser]
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['uuid','nombres', 'apellidos', 'rut']

class RecetaViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAdminUser]
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer

    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['uuid', 'paciente__rut', 'paciente__nombres', 'paciente__apellidos', 'rut_examinador']
    filterset_fields = ['uuid', 'paciente']

class ProveedorViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

class CristalViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Cristal.objects.all()
    serializer_class = CristalSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['uuid', 'proveedor__nombre', 'nombre_comercial', 'codigo_comercial', 'tipo_foco', 'material', 'indice']

class RangoCristalViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = RangoCristal.objects.all()
    serializer_class = RangoCristalSerializer

    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['uuid', 'proveedor__nombre', 'nombre_comercial', 'codigo_comercial', 'tipo_foco', 'material', 'indice']
    filterset_fields = ['uuid', 'cristal']

class CristalTablaRangosViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Cristal.objects.all()
    serializer_class = CristalTablaRangosSerializer

    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    # search_fields = ['uuid', 'proveedor__nombre', 'nombre_comercial', 'codigo_comercial', 'tipo_foco', 'material', 'indice']
    # filterset_fields = ['uuid', 'cristal']

class ArmazonViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Armazon.objects.all()
    serializer_class = ArmazonSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['uuid', 'proveedor__nombre', 'marca', 'codigo_armazon', 'material', 'aro', 'tipo', 'genero']
    filterset_fields = ['uuid', 'proveedor']


class MarcasFromProveedorViewSet(viewsets.ViewSet):
    # permission_classes = [IsAuthenticated]

    def list(self, request):
        proveedor_uuid = self.request.query_params.get('proveedor_uuid')

        queryset = Armazon.objects.raw(f"""
            select
                distinct uuid, marca
            from optica_armazon
            where
                proveedor_id = {proveedor_uuid}
        """)

        serialized_data = serialize("json", queryset)
        del queryset
        serialized_data = json.loads(serialized_data)

        new_list_of_jsons = []
        for armazon in serialized_data:
            new_list_of_jsons.append(armazon['fields'])       
        del serialized_data

        df = pd.DataFrame.from_records(new_list_of_jsons)
        del new_list_of_jsons

        # return JsonResponse(new_list_of_jsons, safe=False)
        if df.shape[0] > 0:
            return Response( { 'marcas': df.marca.unique() } )
        else:
            return Response( { 'marcas': [] } )
        

class CristablesDisponiblesViewSet(viewsets.ViewSet):
    # permission_classes = [IsAuthenticated]

    def list(self, request):
        sph = float(self.request.query_params.get('sph'))
        cyl = float(self.request.query_params.get('cyl'))

        t_sph = sph+cyl
        t_cyl = -1*cyl

        with connection.cursor() as cursor:
            cursor.execute(f"""
                select
                    c.*,
                    ceil(rc.costo_neto*1.19*5.1 / 1000)*1000 as precio
                from optica_cristal as c
                inner join (
                    select
                        cristal_id, min(costo_neto) as costo_neto
                    from optica_rangocristal
                    where
                        (
                           ( sph_desde <= {sph} and {sph} <= sph_hasta and cyl_desde <= {cyl} and {cyl} <= cyl_hasta )
                            or ( sph_desde <= {t_sph} and {t_sph} <= sph_hasta and cyl_desde <= {t_cyl} and {t_cyl} <= cyl_hasta )
                        )
                    group by
                        1
                ) as rc
                on c.uuid = rc.cristal_id and costo_neto > 0
                order by
                    rc.costo_neto asc
            """)
            columns = [col[0] for col in cursor.description]
            return Response([dict(zip(columns, row)) for row in cursor.fetchall()])