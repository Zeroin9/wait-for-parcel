from django.urls import path

from . import views

urlpatterns = [
    path('parcels', views.get_parcels, name='parcels'),
    path('operations', views.get_oper_by_parcel, name='operations'),
]