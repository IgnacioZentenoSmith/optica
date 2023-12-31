# Generated by Django 4.1.7 on 2023-07-16 17:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('optica', '0006_cristal_proveedor_rangocristal_cristal_proveedor'),
    ]

    operations = [
        migrations.CreateModel(
            name='Armazon',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('uuid', models.BigAutoField(db_index=True, primary_key=True, serialize=False)),
                ('marca', models.CharField(max_length=30)),
                ('codigo_armazon', models.CharField(max_length=30)),
                ('material', models.CharField(max_length=30)),
                ('aro', models.CharField(max_length=30)),
                ('tipo', models.CharField(max_length=30)),
                ('genero', models.CharField(max_length=30)),
                ('costo_neto', models.PositiveSmallIntegerField()),
                ('proveedor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='armazones', to='optica.proveedor')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
