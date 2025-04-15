from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from .models import HedgingSpr, FwdPriceQuotesValues
from datetime import datetime
from django.db import transaction
import json
from rest_framework.generics import ListAPIView
from .serializers import HedgingSprSerializer

class CsrfEnforcedSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return super().enforce_csrf(request)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class HedgingAPIView(APIView):
    """
    API endpoint for creating new hedging trades
    Requires authentication via session cookies and CSRF token
    """
    authentication_classes = [CsrfEnforcedSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            if not request.user.is_authenticated:
                return Response(
                    {"error": "Authentication credentials were not provided."},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return Response(
                    {"error": "Invalid JSON data"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            required_fields = [
                'inventory', 'boughtSold', 'fixedPrice',
                'pricingPeriodFrom', 'To', 'tradeCreatedOn'
            ]
            missing_fields = [field for field in required_fields if field not in data or not data[field]]
            if missing_fields:
                return Response(
                    {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                quantity = float(data.get('quantityBBL', '0').replace(',', ''))
                quantity_mt = float(data.get('quantityMT', '0').replace(',', ''))
                fixed_price = float(data.get('fixedPrice', '0').replace(',', ''))

                leg1 = 0
                if data.get('pricingbasis_leg1'):
                    avg_price = FwdPriceQuotesValues.objects.filter(
                        quote_name=data['pricingbasis_leg1'],
                        period_from=data['pricingPeriodFrom'],
                        period_to=data['To']
                    ).aggregate(Avg('value'))['value__avg'] or 0

                    if data['boughtSold'] == 'Bought':
                        leg1 = (float(avg_price) - fixed_price) * quantity
                    else:
                        leg1 = (fixed_price - float(avg_price)) * quantity

                hedging = HedgingSpr.objects.create(
                    Tran_Ref_No=data['inventory'],
                    type=data['boughtSold'],
                    fixed_price=fixed_price,
                    pricing_period_from=data['pricingPeriodFrom'],
                    pricing_period_to=data['To'],
                    traded_on=datetime.strptime(data['tradeCreatedOn'], '%Y-%m-%d').date(),
                    Quantity=quantity,
                    Quantity_mt=quantity_mt,
                    broker_name=data.get('brokerName', ''),
                    counterparty=data.get('counterparty', 'ICE EUROPE'),
                    group_name=data.get('groupName', ''),
                    pricing_basis1=data.get('pricingQuotation', ''),
                    broker_charges=data.get('brokerCharges', ''),
                    charges_unit=data.get('brokerChargesUnit', ''),
                    emailID=data.get('emailID', ''),
                    dueDate=data.get('dueDate', ''),
                    leg1_fix=leg1,
                    leg2_fix=0,
                    leg1_float=0,
                    leg2_float=0,
                    hedging_type='FlatPrice',
                    paper='Paper',
                    traded_by=request.user
                )

                return Response({
                    "status": "success",
                    "message": "Trade created successfully",
                    "data": {
                        "id": hedging.id,
                        "Tran_Ref_No": hedging.Tran_Ref_No,
                        "settlement_value": leg1
                    }
                }, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({"error": f"Invalid numeric value: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HedgingListAPIView(ListAPIView):
    """
    API endpoint for listing all hedging trades
    Requires authentication via session cookies
    Supports filtering by query parameters
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = [AllowAny]
    serializer_class = HedgingSprSerializer

    def get_queryset(self):
        queryset = HedgingSpr.objects.all().order_by('-DateCreated')

        # Filter by type
        trade_type = self.request.query_params.get('type')
        if trade_type in ['Bought', 'Sold']:
            queryset = queryset.filter(type=trade_type)

        # Filter by trade date
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            queryset = queryset.filter(traded_on__gte=date_from)
        if date_to:
            queryset = queryset.filter(traded_on__lte=date_to)

        # Filter by counterparty
        counterparty = self.request.query_params.get('counterparty')
        if counterparty:
            queryset = queryset.filter(counterparty__icontains=counterparty)

        return queryset

class CsrfEnforcedSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return super().enforce_csrf(request)
    

    