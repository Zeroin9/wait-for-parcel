import json
from django.core import serializers
from django.http import JsonResponse
from .models import Parcel, Operation

# Get all parcels
def get_parcels(request):
    if request.method == "GET":
        parcels = []
        parcelsObjects = Parcel.objects.all()
        for p in parcelsObjects:
            data = serializers.serialize('json', [p])
            struct = json.loads(data)[0]
            parcels.append(struct)
        return JsonResponse({'parcels':parcels})
    if request.method == "POST":
        return JsonResponse({'error':'Only GET here'}, status=400)

# Get all operations for parcel by 'pk'
def get_oper_by_parcel(request):
    if request.method == "GET":
        opers = []
        parcel_pk = request.GET.get("parcel_pk")
        if (parcel_pk is None):
            return JsonResponse({'error':"'parcel_pk' is required"}, status=400)
        operObjects = Operation.objects.filter(parcel__pk=int(parcel_pk))
        for o in operObjects:
            data = serializers.serialize('json', [o])
            struct = json.loads(data)[0]
            opers.append(struct)
        return JsonResponse({'operations':opers})
    if request.method == "POST":
        return JsonResponse({'error':'Only GET here'}, status=400)
