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
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed



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
    API endpoint for creating, updating, partially updating, and deleting hedging trades.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_trade(self, id):
        HedgingSpr.objects.get(id=id)
        print("Trade not found with ID:", id)
        try:
            return HedgingSpr.objects.get(id=id)


        except HedgingSpr.DoesNotExist:
            return None

    @swagger_auto_schema(
        request_body=HedgingSprSerializer,
        responses={201: HedgingSprSerializer},
        operation_description="Create a new hedging trade."
    )
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
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
        responses={200: HedgingSprSerializer},
        operation_description="Update an existing hedging trade by ID.",
        manual_parameters=[
            openapi.Parameter('trade_id', openapi.IN_PATH, description="ID of the trade", type=openapi.TYPE_INTEGER)
        ]
    )
    def put(self, request, id, *args, **kwargs):  
            try:
                data = request.data
                try:
                    trade = HedgingSpr.objects.get(id=id)
                    print("Trade found:", trade)
                except HedgingSpr.DoesNotExist:
                    return Response(
                        {"error": "Trade not found."},
                        status=status.HTTP_404_NOT_FOUND
                    )

                with transaction.atomic():
                    quantity = float(data.get('Quantity', '0'))
                    quantity_mt = float(data.get('Quantity_mt', '0'))
                    fixed_price = float(data.get('fixedPrice', '0'))

                    leg1 = 0
                    if data.get('pricing_basis1'):
                        avg_price = 0
                        if data['boughtSold'] == 'Bought':
                            leg1 = (float(avg_price) - fixed_price) * quantity
                        else:
                            leg1 = (fixed_price - float(avg_price)) * quantity

                    traded_on_date = (data['tradeCreatedOn'])
                    pricing_period_from_date = (data['pricingPeriodFrom'])
                    pricing_period_to_date = (data['To'])

                    # Update trade fields
                    trade.Tran_Ref_No = data['inventory']
                    trade.type = data['boughtSold']
                    trade.fixed_price = data.get('fixed_price', fixed_price)
                    trade.pricing_period_from = data.get('pricing_period_from', pricing_period_from_date)
                    trade.pricing_period_to = data.get('pricing_period_to', trade.pricing_period_to)
                    trade.traded_on = data.get('trade_created_on', trade.traded_on)
                    trade.Quantity = data.get('Quantity', quantity)
                    trade.Quantity_mt = data.get('Quantity_mt', quantity_mt)
                    trade.broker_name = data.get('broker_name', trade.broker_name)
                    trade.counterparty = data.get('counterparty', trade.counterparty)
                    trade.group_name = data.get('group_name',trade.group_name)
                    trade.pricing_basis1 = data.get('pricing_basis1', trade.pricing_basis1)
                    trade.broker_charges = data.get('broker_charges', trade.broker_charges)
                    trade.charges_unit = data.get('broker_charges_unit', trade.charges_unit)
                    trade.emailID = data.get('email_id', trade.emailID)
                    trade.duedate = data.get('due_date', trade.duedate)
                    trade.leg1_fix = data.get('leg1_fix', trade.leg1_fix)
                    trade.traded_by = request.user

                    trade.save()

                    serializer = HedgingSprSerializer(trade)
                    return Response({
                        "status": "success",
                        "message": "Trade updated successfully",
                        "data": serializer.data
                    }, status=status.HTTP_200_OK)

            except ValueError as e:
                print(f"ValueError: {e}")
                return Response({"error": f"Invalid numeric value: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(f"Exception: {e}")
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def patch(self, request, trade_id, *args, **kwargs):
        try:
            trade = self.get_trade(trade_id)
            if not trade:
                return Response({"error": "Trade not found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = HedgingSprSerializer(trade, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "status": "success",
                    "message": "Trade partially updated successfully",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        responses={204: "Trade deleted successfully", 404: "Trade Not Found"},
        operation_description="Delete a hedging trade by ID.",
        manual_parameters=[
            openapi.Parameter('trade_id', openapi.IN_PATH, description="ID of the trade", type=openapi.TYPE_INTEGER)
        ]
    )
    def delete(self, request, trade_id, *args, **kwargs):
        try:
            trade = self.get_trade(trade_id)
            if not trade:
                return Response({"error": "Trade not found."}, status=status.HTTP_404_NOT_FOUND)

            trade.delete()
            return Response({
                "status": "success",
                "message": "Trade deleted successfully"
            }, status=status.HTTP_204_NO_CONTENT)

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