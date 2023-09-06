from django.db import models
from shortuuid.django_fields import ShortUUIDField

from django.conf import settings
import os

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class Paciente(TimeStampedModel):
    uuid = ShortUUIDField(
        length=10, alphabet="abcdefghijklmnopqrstuvwxyz0123456789",
        primary_key=True, editable=False, db_index=True
    )
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    rut = models.CharField(max_length=20, unique=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    generos = ( ('Masculino', 'Masculino'), ('Femenino', 'Femenino'), ('Otro', 'Otro') )
    genero = models.CharField(max_length=9, choices=generos, blank=True, null=True)

    email = models.EmailField(default='', blank=True, null=True)
    telefono_movil = models.CharField(max_length=12, verbose_name="Teléfono Móvil", blank=True, null=True)
    telefono_fijo = models.CharField(max_length=12, verbose_name="Teléfono Fijo", blank=True, null=True)
    
    def __str__(self):
        return self.rut + ' ' + self.nombres + ' ' + self.apellidos

def receta_file_name(instance, filename):
    return '/'.join([
        f'uploads/recetas/{str(instance.created_at.year)}/{str(instance.created_at.month)}/',
        str(instance.fecha_examen).replace('-','')
        +'_'+str(instance.paciente.rut).replace('-','')
        +'_'+instance.uuid
        +'.'+filename.split('.')[-1]
    ])
class Receta(TimeStampedModel):
    uuid = ShortUUIDField(
        length=10, alphabet="abcdefghijklmnopqrstuvwxyz0123456789",
        primary_key=True, editable=False, db_index=True
    )
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name="recetas")
    fecha_examen = models.DateField(blank=True, null=False)

    rut_examinador = models.CharField(max_length=20, blank=True, null=False)

    od_sph = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    od_cyl = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    od_axis = models.SmallIntegerField(blank=True, null=True)
    od_add = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    od_dnp = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    od_vertical_prism = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    od_vertical_direction = models.CharField(max_length=30, blank=True, null=True)
    od_horizontal_prism = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    od_horizontal_direction = models.CharField(max_length=30, blank=True, null=True)

    oi_sph = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    oi_cyl = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    oi_axis = models.PositiveSmallIntegerField(blank=True, null=True)
    oi_add = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    oi_dnp = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    oi_vertical_prism = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    oi_vertical_direction = models.CharField(max_length=30, blank=True, null=True)
    oi_horizontal_prism = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    oi_horizontal_direction = models.CharField(max_length=30, blank=True, null=True)

    comentarios = models.TextField(blank=True, null=True)

    documento = models.FileField(upload_to=receta_file_name, blank=True, null=True)

    def __str__(self):
        return str(self.uuid) + ' ' + str(self.fecha_examen)
    
class Proveedor(TimeStampedModel):
    uuid = models.BigAutoField(primary_key=True, editable=False, db_index=True)
    rut = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField(default='', blank=True, null=True)
    telefono_movil = models.CharField(max_length=12, blank=True, null=True)
    telefono_fijo = models.CharField(max_length=12, blank=True, null=True)
    direccion = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return str(self.rut) + ' ' + str(self.nombre)

class Cristal(TimeStampedModel):
    uuid = models.BigAutoField(primary_key=True, editable=False, db_index=True)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, related_name="cristales")
    nombre_comercial = models.CharField(max_length=100)
    codigo_comercial = models.CharField(max_length=100)
    tipo_foco = models.CharField(max_length=50)
    material = models.CharField(max_length=100)
    indice = models.DecimalField(decimal_places=2, max_digits=4)

    def __str__(self):
        return str(self.codigo_comercial) + ' ' + str(self.nombre_comercial)
    
class RangoCristal(TimeStampedModel):
    uuid = models.BigAutoField(primary_key=True, editable=False, db_index=True)
    cristal = models.ForeignKey(Cristal, on_delete=models.CASCADE, related_name="rangos")

    diametro = models.PositiveSmallIntegerField()
    sph_desde = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    sph_hasta = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cyl_desde = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    cyl_hasta = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    min_poder = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    max_poder = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    add_desde = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    add_hasta = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)

    costo_neto = models.PositiveSmallIntegerField()

    def __str__(self):
        return str(self.cristal) + ' ' + str(self.diametro)

def armazon_foto_name(instance, filename):
    name = '/'.join([
        f'uploads/armazones/',
        str(instance.uuid)
        +'.'+filename.split('.')[-1]
    ]).replace('//','/')

    long_name = os.path.join(settings.MEDIA_ROOT, name)

    if os.path.isfile(long_name):
        os.remove(long_name)

    return name

class Armazon(TimeStampedModel):
    uuid = models.PositiveBigIntegerField(primary_key=True, editable=True, db_index=True)
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, related_name="armazones")
    marca = models.CharField(max_length=30, blank=False, null=False)
    codigo_armazon = models.CharField(max_length=30, blank=False, null=False)

    material = models.CharField(max_length=30, blank=False, null=False)
    aro = models.CharField(max_length=30, blank=False, null=False)
    tipo = models.CharField(max_length=30, blank=False, null=False)
    genero = models.CharField(max_length=30, blank=False, null=False)
    
    costo_neto = models.PositiveSmallIntegerField()

    foto = models.FileField(upload_to=armazon_foto_name, blank=True, null=True)

    def __str__(self):
        return str(self.uuid) + ' ' + str(self.marca)