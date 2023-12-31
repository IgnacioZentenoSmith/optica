# Generated by Django 4.1.7 on 2023-03-20 22:41

from django.db import migrations, models
import django.db.models.deletion
import optica.models
import shortuuid.django_fields


class Migration(migrations.Migration):

    dependencies = [
        ('optica', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Receta',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('uuid', shortuuid.django_fields.ShortUUIDField(alphabet='abcdefghijklmnopqrstuvwxyz0123456789', db_index=True, editable=False, length=10, max_length=10, prefix='', primary_key=True, serialize=False)),
                ('fecha_examen', models.DateField(blank=True)),
                ('rut_examinador', models.CharField(blank=True, max_length=20)),
                ('od_sph', models.CharField(max_length=6)),
                ('od_cyl', models.CharField(max_length=6)),
                ('od_axis', models.CharField(max_length=4)),
                ('od_add', models.CharField(max_length=6)),
                ('od_dnp', models.CharField(max_length=10)),
                ('od_vertical_prism', models.CharField(max_length=30)),
                ('od_vertical_direction', models.CharField(max_length=30)),
                ('od_horizontal_prism', models.CharField(max_length=30)),
                ('od_horizontal_direction', models.CharField(max_length=30)),
                ('oi_sph', models.CharField(max_length=6)),
                ('oi_cyl', models.CharField(max_length=6)),
                ('oi_axis', models.CharField(max_length=4)),
                ('oi_add', models.CharField(max_length=6)),
                ('oi_dnp', models.CharField(max_length=10)),
                ('oi_vertical_prism', models.CharField(max_length=30)),
                ('oi_vertical_direction', models.CharField(max_length=30)),
                ('oi_horizontal_prism', models.CharField(max_length=30)),
                ('oi_horizontal_direction', models.CharField(max_length=30)),
                ('comentarios', models.TextField(blank=True, null=True)),
                ('documento', models.FileField(blank=True, null=True, upload_to=optica.models.receta_file_name)),
                ('paciente_uuid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recetas', to='optica.paciente')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
