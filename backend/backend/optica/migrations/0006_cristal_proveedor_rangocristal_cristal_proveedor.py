# Generated by Django 4.1.7 on 2023-03-26 04:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('optica', '0005_rename_paciente_uuid_receta_paciente_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cristal',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('uuid', models.BigAutoField(db_index=True, editable=False, primary_key=True, serialize=False)),
                ('nombre_comercial', models.CharField(max_length=100)),
                ('codigo_comercial', models.CharField(max_length=100)),
                ('tipo_foco', models.CharField(max_length=50)),
                ('material', models.CharField(max_length=100)),
                ('indice', models.DecimalField(decimal_places=2, max_digits=4)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Proveedor',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('uuid', models.BigAutoField(db_index=True, editable=False, primary_key=True, serialize=False)),
                ('rut', models.CharField(max_length=20, unique=True)),
                ('nombre', models.CharField(max_length=100)),
                ('email', models.EmailField(blank=True, default='', max_length=254, null=True)),
                ('telefono_movil', models.CharField(blank=True, max_length=12, null=True)),
                ('telefono_fijo', models.CharField(blank=True, max_length=12, null=True)),
                ('direccion', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RangoCristal',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('uuid', models.BigAutoField(db_index=True, editable=False, primary_key=True, serialize=False)),
                ('diametro', models.PositiveSmallIntegerField()),
                ('sph_desde', models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ('sph_hasta', models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ('cyl_desde', models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ('cyl_hasta', models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ('min_poder', models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ('max_poder', models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ('add_desde', models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ('add_hasta', models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ('costo_neto', models.PositiveSmallIntegerField()),
                ('cristal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rangos', to='optica.cristal')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='cristal',
            name='proveedor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cristales', to='optica.proveedor'),
        ),
    ]
