from django.urls import path, include
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *
import datetime
import pandas as pd
import numpy as np
import json

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = ['url', 'username', 'email', 'is_staff']
        fields = '__all__'
        # lookup_field = 'id'

class PacienteSerializer(serializers.ModelSerializer):
    edad = serializers.SerializerMethodField('get_edad')

    def get_edad(self, obj):
        return round((datetime.date.today() - obj.fecha_nacimiento).days/365, 1)

    class Meta:
        model = Paciente
        fields = '__all__'

class RecetaSerializer(serializers.ModelSerializer):
    
    paciente_rut = serializers.SerializerMethodField('get_paciente_rut')
    paciente_nombres_apellidos = serializers.SerializerMethodField('get_paciente_nombres_apellidos')

    antiguedad = serializers.SerializerMethodField('get_antiguedad')

    def get_paciente_rut(self, obj):
        return obj.paciente.rut
    
    def get_paciente_nombres_apellidos(self, obj):
        return obj.paciente.nombres + ' ' + obj.paciente.apellidos
    
    def get_antiguedad(self, obj):
        dias = (datetime.date.today() - obj.fecha_examen).days
        if ( dias > 365 ):
            return str(round(dias/365, 1))+' años'
        elif ( dias > 31 ):
            return str(round(dias/31, 1))+' meses'
        else:
            return str(dias)+' días'

    class Meta:
        model = Receta
        fields = '__all__'

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

class CristalSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.SerializerMethodField('get_proveedor_nombre')

    def get_proveedor_nombre(self, obj):
        return obj.proveedor.nombre

    class Meta:
        model = Cristal
        fields = '__all__'

class RangoCristalSerializer(serializers.ModelSerializer):
    class Meta:
        model = RangoCristal
        fields = '__all__'
        # exclude = ['uuid','created_at','updated_at','cristal']


class CristalTablaRangosSerializer(serializers.ModelSerializer):

    tabla_rangos_cristal = serializers.SerializerMethodField('get_tabla_rangos_cristal')

    def get_tabla_rangos_cristal(self, obj):

        df = pd.DataFrame()

        rangos = RangoCristal.objects.filter(cristal=obj.uuid).values()

        diam_list = []
        sph_list = []
        cyl_list = []
        costos_list = []

        for rango in rangos:
            min_poder = rango['min_poder'] or -99.0
            max_poder = rango['max_poder'] or 99.0

            for sph in range(int(rango['sph_desde']*100), int(rango['sph_hasta']*100)+25, 25):
                sph = round(sph/100, 2)
                for cyl in range(int(rango['cyl_desde']*100), int(rango['cyl_hasta']*100)+25, 25):
                    cyl = round(cyl/100, 2)

                    poder = np.abs(sph)+np.abs(cyl)

                    print(sph, cyl, min_poder, poder, max_poder)
                    if poder <= max_poder and poder >= min_poder:
                        diam_list.append(rango['diametro'])
                        sph_list.append(sph)
                        cyl_list.append(cyl)
                        costos_list.append(rango['costo_neto'])

        df['diam'] = diam_list
        del diam_list
        df['sph'] = sph_list
        del sph_list
        df['cyl'] = cyl_list
        del cyl_list
        df['costos'] = costos_list
        del costos_list

        df = df.pivot_table(index=['diam','sph'], columns=['cyl'], values=['costos'], aggfunc=list).reset_index().sort_values(['diam','sph'], ascending=[True, False])

        for i in range(df.shape[0]):
            for j in range(df.shape[1]):
                _ = df.iloc[i,j]
                if type(_) is list:
                    df.iloc[i,j] = min(_)

        df['sph']=df['sph'].apply(lambda x: "{:.2f}".format(x).replace('.', ','))
        df['sph']=df['sph'].apply(lambda x: x if x[0]=='-' else '+'+x)

        df = df.reset_index().copy()
        del df['index']

        df.columns = [ str(col[0]) if col[1]=='' else str(col[1]) for col in df.columns ]

        new_cols = []
        for col in df.columns:
            if col not in ['diam','sph']:
                ncol = "{:.2f}".format(float(col)).replace('.', ',')
                if float(col) >= 0:
                    ncol = '+'+ncol
                new_cols.append(ncol)
            elif col=='sph':
                new_cols.append('SPH\CYL')
            else:
                new_cols.append(col)
        df.columns = new_cols
        
        final_json = {}
        for diametro in df.diam.unique():
            final_json[str(diametro)] = json.loads(df.query(f"diam=={diametro}").drop('diam', axis=1).to_json(orient='records'))

        return final_json    

    class Meta:
        model = Cristal
        fields = ['uuid','tabla_rangos_cristal']

class ArmazonSerializer(serializers.ModelSerializer):
    proveedor_nombre = serializers.SerializerMethodField('get_proveedor_nombre')

    def get_proveedor_nombre(self, obj):
        return obj.proveedor.nombre
    
    class Meta:
        model = Armazon
        fields = '__all__'