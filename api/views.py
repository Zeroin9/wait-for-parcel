import json
from django.core import serializers
from django.http import JsonResponse
from .models import Parcel, Operation, Token, ParcelTokenLink
from .authentification_utils import generate_new_token, auth_need

# Create new parcel
@auth_need
def for_parcel(request):
    token = str(request.headers.get('AuthToken'))
    if request.method == "GET":
        parcel_pk = request.GET.get("pk")
        if parcel_pk is None:
            parcels = []
            token_instance = Token.objects.filter(token=token)[0]
            parcelsWithTokens = ParcelTokenLink.objects.filter(token=token_instance)
            for p in parcelsWithTokens:
                parcels.append(serialize_instance(p.parcel))
            return JsonResponse({'parcels':parcels}, status=200)
        else:
            parcel = Parcel.objects.get(id=int(parcel_pk))
            if parcel is None:
                return JsonResponse({'error':"not foun with such 'pk'"}, status=404)
            return JsonResponse(serialize_instance(parcel), status=200)
    if request.method == "POST":
        parcel_code = request.GET.get("code")
        if (parcel_code is None):
            return JsonResponse({'error':"'code' is required "}, status=400)
        token_instance = Token.objects.filter(token=token)[0]
        parcel_instance = Parcel.objects.create(track_code=parcel_code)
        ParcelTokenLink.objects.create(parcel=parcel_instance, token=token_instance)
        return JsonResponse({'new_parcel':serialize_instance(parcel_instance)}, status=201)

# Get all operations for parcel by 'pk'
def get_oper_by_parcel(request):
    if request.method == "GET":
        parcel_pk = request.GET.get("parcel_pk")
        if (parcel_pk is None):
            return JsonResponse({'error':"'parcel_pk' is required"}, status=400)
        parcel = Parcel.objects.get(id=int(parcel_pk))
        if parcel is None:
            return JsonResponse({'error':"not foun with such 'pk'"}, status=404)
        opers = []
        operObjects = Operation.objects.filter(parcel=parcel)
        for o in operObjects:
            opers.append(serialize_instance(o))
        return JsonResponse({'parcel':serialize_instance(parcel), 'operations':opers})
    if request.method == "POST":
        return JsonResponse({'error':'Only GET here'}, status=400)

# Refresh operations for parcel by 'pk'
def update_oper_by_parcel(request):
    if request.method == "GET":
        return JsonResponse({'error':'Only GET here'}, status=400)
    if request.method == "POST":
        parcel_pk = request.GET.get("parcel_pk")
        if (parcel_pk is None):
            return JsonResponse({'error':"'parcel_pk' is required"}, status=400)
        parcel = Parcel.objects.get(id=int(parcel_pk))
        if parcel is None:
            return JsonResponse({'error':"not foun with such 'pk'"}, status=404)
        operObjects = Operation.objects.filter(parcel=parcel).delete()
        #
        # TODO update operations from tracking API
        #
        opers = []
        operObjects = Operation.objects.filter(parcel=parcel)
        for o in operObjects:
            opers.append(serialize_instance(o))
        return JsonResponse({'parcel':serialize_instance(parcel), 'operations':opers})

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