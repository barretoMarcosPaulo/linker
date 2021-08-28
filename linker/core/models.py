from django.db import models

# Create your models here.
class AuditModel(models.Model):
    created_on = models.DateField('Criado em', auto_now_add=True)
    updated_on = models.DateField('Atualizado em', auto_now=True)

    class Meta:
        abstract=True

class BaseModel(AuditModel):
    acess_in = models.DateTimeField("Acessado em", auto_now=False, auto_now_add=True)