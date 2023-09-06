from django.contrib import admin

# esto es para registrar automaticamente TODOS los modelos en ADMIN
from django.apps import apps
models = apps.get_models()
for model in models:
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass