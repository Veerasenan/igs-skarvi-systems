from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db import transaction
from .models import HedgingSpr, FwdPriceQuotesValues
from datetime import datetime
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import ListAPIView
from .serializers import HedgingSprSerializer
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi



# Custom Refresh View (if needed)
class CustomTokenRefreshView(TokenRefreshView):
    """
    This class can be used to extend the functionality of the default refresh view.
    For example, you might add logging or other actions when the token is refreshed.
    """

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # You can add additional logic here if needed
        # For example, logging every time the token is refreshed
        print("Token refresh successful for user", request.user)

        return response

# Optional: Custom Token Validation View (if you want additional validation)
@api_view(["POST"])
def validate_token(request):
    """
    Custom API to validate a token. You might use this to check if the token is still valid
    without refreshing it.
    """
    from rest_framework_simplejwt.tokens import RefreshToken
    from rest_framework.exceptions import AuthenticationFailed

    try:
        token = request.data.get("token")
        refresh = RefreshToken(token)
        # If token is valid, this will not raise an exception
        refresh.check_blacklist()  # Optional: Check if the token is blacklisted

        return Response({"message": "Token is valid"}, status=200)

    except Exception as e:
        raise AuthenticationFailed("Token is invalid or expired")



class HedgingAPIView(APIView):
    """
    API endpoint for creating and updating hedging trades.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        request_body=HedgingSprSerializer,
        responses={201: HedgingSprSerializer},
        operation_description="Create a new hedging trade."
    )
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            trade_id = data.get('id')
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
                if data.get('pricingQuotation'):
                    avg_price = FwdPriceQuotesValues.objects.filter(
                        quote_name=data['pricingQuotation'],
                        period_from=data['pricingPeriodFrom'],
                        period_to=data['To']
                    ).aggregate(Avg('value'))['value__avg'] or 0

                    if data['boughtSold'] == 'Bought':
                        leg1 = (float(avg_price) - fixed_price) * quantity
                    else:
                        leg1 = (fixed_price - float(avg_price)) * quantity

                hedging = HedgingSpr.objects.create(
                    trade_id = data.get('id', None),
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
                    duedate=data.get('duedate', ''),
                    leg1_fix=leg1,
                    leg2_fix=0,
                    leg1_float=0,
                    leg2_float=0,
                    hedging_type='FlatPrice',
                    paper='Paper',
                    traded_by=request.user
                )

                serializer = HedgingSprSerializer(hedging)

                return Response({
                    "status": "success",
                    "message": "Trade created successfully",
                    "data": serializer.data
                }, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({"error": f"Invalid numeric value: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
    request_body=HedgingSprSerializer,
    responses={
        200: openapi.Response(
            description="Trade updated successfully.",
            schema=HedgingSprSerializer()
        ),
        400: "Bad Request",
        404: "Trade Not Found",
        500: "Internal Server Error"
    },
    operation_summary="Update an existing hedging trade",
    operation_description="Provide the full payload (including 'id') to update a hedging trade."
    )
    def put(self, request, *args, **kwargs):
        try:
            data = request.data

            trade_id = data.get('id')
            if not trade_id:
                return Response(
                    {"error": "Trade ID is required for updating."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                trade = HedgingSpr.objects.get(id=trade_id)
            except HedgingSpr.DoesNotExist:
                return Response(
                    {"error": "Trade not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            with transaction.atomic():
                quantity = float(data.get('quantityBBL', '0').replace(',', ''))
                quantity_mt = float(data.get('quantityMT', '0').replace(',', ''))
                fixed_price = float(data.get('fixedPrice', '0').replace(',', ''))

                leg1 = 0
                if data.get('pricingQuotation'):
                    avg_price = FwdPriceQuotesValues.objects.filter(
                        quote_name=data['pricingQuotation'],
                        period_from=data['pricingPeriodFrom'],
                        period_to=data['To']
                    ).aggregate(Avg('value'))['value__avg'] or 0

                    if data['boughtSold'] == 'Bought':
                        leg1 = (float(avg_price) - fixed_price) * quantity
                    else:
                        leg1 = (fixed_price - float(avg_price)) * quantity

                # Update trade fields
                trade.id = trade_id
                trade.Tran_Ref_No = data['inventory']
                trade.type = data['boughtSold']
                trade.fixed_price = fixed_price
                trade.pricing_period_from = data['pricingPeriodFrom']
                trade.pricing_period_to = data['To']
                trade.traded_on = datetime.strptime(data['tradeCreatedOn'], '%Y-%m-%d').date()
                trade.Quantity = quantity
                trade.Quantity_mt = quantity_mt
                trade.broker_name = data.get('brokerName', '')
                trade.counterparty = data.get('counterparty', 'ICE EUROPE')
                trade.group_name = data.get('groupName', '')
                trade.pricing_basis1 = data.get('pricingQuotation', '')
                trade.broker_charges = data.get('brokerCharges', '')
                trade.charges_unit = data.get('brokerChargesUnit', '')
                trade.emailID = data.get('emailID', '')
                trade.duedate = data.get('duedate', '')
                trade.leg1_fix = leg1
                trade.traded_by = request.user

                trade.save()

                serializer = HedgingSprSerializer(trade)
                return Response({
                    "status": "success",
                    "message": "Trade updated successfully",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({"error": f"Invalid numeric value: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HedgingListAPIView(ListAPIView):
    """
    API endpoint for listing all hedging trades
    Requires authentication via JWT tokens
    Supports filtering by query parameters
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
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