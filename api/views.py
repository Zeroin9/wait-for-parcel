import json
from django.core import serializers
from django.http import JsonResponse
from .models import Parcel, Operation, Token, ParcelTokenLink
from .authentification_utils import generate_new_token, auth_need

# Get all parcels
@auth_need
def get_parcels(request):
    if request.method == "GET":
        parcels = []
        parcelsObjects = Parcel.objects.all()
        for p in parcelsObjects:
            parcels.append(serialize_instance(p))
        return JsonResponse({'parcels':parcels})
    if request.method == "POST":
        return JsonResponse({'error':'Only GET here'}, status=400)

# Create new parcel
@auth_need
def for_parcel(request):
    if request.method == "GET":
        return JsonResponse({'error':'Only POST here'}, status=400)
    if request.method == "POST":
        token = request.headers.get('AuthToken')
        parcel_code = request.GET.get("code")
        if (parcel_code is None):
            return JsonResponse({'error':"'code' is required " + str(request.data)}, status=400)
        token_instance = Token.objects.filter(token=token)[0]
        parcel_instance = Parcel.objects.create(track_code=parcel_code)
        ParcelTokenLink.objects.create(parcel=parcel_instance, token=token_instance)
        return JsonResponse({'new_parcel':serialize_instance(parcel_instance)}, status=201)

# Get all operations for parcel by 'pk'
@auth_need
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

# Get new auth token
def get_new_token(request):
    if request.method == "GET":
        return JsonResponse({'error':'Only POST here'}, status=400)
    if request.method == "POST":
        token = request.headers.get('AuthToken')
        if token is None:
            new_token = generate_new_token()
            return JsonResponse({'token':new_token}, status=201)
        else:
            return JsonResponse({'error':'You have already send token'}, status=400)

def serialize_instance(instance):
    data = serializers.serialize('json', [instance])
    struct = json.loads(data)[0]
    return struct