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
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from django.http import Http404




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

    def get(self, request, id=None):
        if id:
            try:
                trade = HedgingSpr.objects.get(id=id)
                serializer = HedgingSprSerializer(trade)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except HedgingSpr.DoesNotExist:
                return Response({"error": "Trade not found"}, status=status.HTTP_404_NOT_FOUND)

        # No ID provided — return all trades
        trades = HedgingSpr.objects.all()
        serializer = HedgingSprSerializer(trades, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        request_body=HedgingSprSerializer,
        responses={201: HedgingSprSerializer},
        operation_description="Create a new hedging trade."
    )
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            print("Received data:", data)
            required_fields = [
                'fixed_price',
                'pricing_period_from']
            missing_fields = [field for field in required_fields if field not in data or not data[field]]
            if missing_fields:
                return Response(
                    {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                quantity_mt = float(data.get('quantity_mt', 0))
                fixed_price = float(data.get('fixed_price', 0))

                leg1 = 0
                if data.get('pricing_quotation'):
                    avg_price = FwdPriceQuotesValues.objects.filter(
                        quote_name=data['pricing_quotation'],
                        period_from=data['pricing_period_from'],
                        period_to=data['pricing_period_to']
                    ).aggregate(Avg('value'))['value__avg'] or 0


                hedging = HedgingSpr.objects.create(
                    tran_ref_no=data.get('tran_ref_no'),
                    transaction_type=data.get('transaction_type'),
                    fixed_price=data.get('fixed_price'),
                    pricing_period_from=data.get('pricing_period_from'),
                    pricing_period_to=data.get('pricing_period_to'),
                    traded_on=data.get('traded_on'),
                    quantity_mt=data.get('quantity_mt'),
                    broker_name=data.get('broker_name', ''),
                    counterparty=data.get('counterparty', ''),
                    group_name=data.get('group_name', ''),
                    pricing_basis1=data.get('pricing_quotation', ''),
                    broker_charges=data.get('broker_charges', ''),
                    charges_unit=data.get('broker_charges_unit', ''),
                    email_id=data.get('email_id', ''),
                    due_date=data.get('due_date', ''),
                    leg1_fix=data.get('leg1_fix'),
                    leg2_fix=data.get('leg2_fix'),
                    leg1_float=data.get('leg1_float'),
                    leg2_float=data.get('leg2_float'),
                    hedging_type=data.get('hedging_type', ''),
                    paper=data.get('paper', ''),
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
        manual_parameters=[openapi.Parameter('id', openapi.IN_PATH, description="ID of the trade", type=openapi.TYPE_INTEGER)
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

                with transaction.atomic():                    # Update trade fields
                    trade.tran_ref_no = data.get('tran_ref_no', trade.tran_ref_no)
                    trade.transaction_type = data.get('transaction_type', trade.transaction_type)
                    trade.fixed_price = data.get('fixed_price', trade.fixed_price)
                    trade.pricing_period_from = data.get('pricing_period_from', trade.pricing_period_from)
                    trade.pricing_period_to = data.get('pricing_period_to', trade.pricing_period_to)
                    trade.traded_on = data.get('traded_on', trade.traded_on)
                    trade.quantity_mt = data.get('quantity_mt',trade.quantity_mt)
                    trade.broker_name = data.get('broker_name', trade.broker_name)
                    trade.counterparty = data.get('counterparty', trade.counterparty)
                    trade.group_name = data.get('group_name',trade.group_name)
                    trade.pricing_basis1 = data.get('pricing_basis1', trade.pricing_basis1)
                    trade.broker_charges = data.get('broker_charges', trade.broker_charges)
                    trade.charges_unit = data.get('broker_charges_unit', trade.charges_unit)
                    trade.email_id = data.get('email_id', trade.email_id)
                    trade.due_date = data.get('due_date', trade.due_date)
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
        
    def patch(self, request, id, *args, **kwargs):
        try:
            trade = self.get_trade(id=id)
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
            openapi.Parameter('id', openapi.IN_PATH, description="ID of the trade", type=openapi.TYPE_INTEGER)
        ]
    )
    def get_trade(self, id):
        try:
            return HedgingSpr.objects.get(id=id)
        except HedgingSpr.DoesNotExist:
            raise Http404
        

    def delete(self, request, id, *args, **kwargs):
        try:
            trade = self.get_trade(id)
            trade.delete()
            return Response({
                "status": "success",
                "message": "Trade deleted successfully"
            }, status=status.HTTP_204_NO_CONTENT)

        except Http404:
            return Response({"error": "Trade not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            import traceback
            traceback_str = traceback.format_exc()  # This captures full error trace
            print("Error while deleting trade:", traceback_str)  # Log it to console/server
            return Response({"error": str(e) or "Unknown error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class HedgingCreateView(APIView):
    """
    Create a new hedging trade.
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
            required_fields = ['fixed_price', 'pricing_period_from']
            missing_fields = [field for field in required_fields if not data.get(field)]

            if missing_fields:
                return Response(
                    {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                quantity_mt = float(data.get('quantity_mt', 0))
                fixed_price = float(data.get('fixed_price', 0))

                avg_price = 0
                if data.get('pricing_quotation'):
                    avg_price = FwdPriceQuotesValues.objects.filter(
                        quote_name=data['pricing_quotation'],
                        period_from=data['pricing_period_from'],
                        period_to=data['pricing_period_to']
                    ).aggregate(Avg('value'))['value__avg'] or 0

                hedging = HedgingSpr.objects.create(
                    tran_ref_no=data.get('tran_ref_no'),
                    transaction_type=data.get('transaction_type'),
                    fixed_price=fixed_price,
                    pricing_period_from=data.get('pricing_period_from'),
                    pricing_period_to=data.get('pricing_period_to'),
                    traded_on=data.get('traded_on'),
                    quantity_mt=quantity_mt,
                    broker_name=data.get('broker_name', ''),
                    counterparty=data.get('counterparty', ''),
                    group_name=data.get('group_name', ''),
                    pricing_basis1=data.get('pricing_quotation', ''),
                    broker_charges=data.get('broker_charges', ''),
                    charges_unit=data.get('broker_charges_unit', ''),
                    email_id=data.get('email_id', ''),
                    due_date=data.get('due_date', ''),
                    leg1_fix=data.get('leg1_fix'),
                    leg2_fix=data.get('leg2_fix'),
                    leg1_float=data.get('leg1_float'),
                    leg2_float=data.get('leg2_float'),
                    hedging_type=data.get('hedging_type', ''),
                    paper=data.get('paper', ''),
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


class HedgingDuplicateView(APIView):
    """
    Duplicate a hedging trade by tran_ref_no format: GROUP#YYYY-MM-DD#YYYY-MM-DD
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        tran_ref = request.data.get("tran_ref_no")
        if not tran_ref:
            return Response({"error": "Missing tran_ref_no"}, status=status.HTTP_400_BAD_REQUEST)

        parts = tran_ref.split("#")
        if len(parts) != 3:
            return Response({"error": "Invalid tran_ref format. Expected: GROUP#YYYY-MM-DD#YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

        group_name, start_date_str, end_date_str = parts
        try:
            start_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%d").date()
            end_date = datetime.datetime.strptime(end_date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format in tran_ref_no."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            row = HedgingSpr.objects.filter(
                group_name=group_name,
                pricing_period_from=start_date,
                pricing_period_to=end_date
            ).first()

            if not row:
                return Response({"error": "No matching trade found."}, status=status.HTTP_404_NOT_FOUND)

            with transaction.atomic():
                new_row = HedgingSpr.objects.create(
                    **{field.name: getattr(row, field.name)
                       for field in HedgingSpr._meta.fields if field.name not in ['id', 'date_created', 'date_modified']},
                    date_created=datetime.datetime.now(),
                    date_modified=datetime.datetime.now()
                )

            return Response({"redirect_url": f"/ELIN/menu/edit_hedging?id={new_row.id}"})

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HedgingBulkUploadView(APIView):
    """
    Upload multiple hedging trades from paper trades.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        approved_indices = data.get("approve", [])

        try:
            for i in approved_indices:
                raw_ref = data["tran_ref_no"][i]
                ref_parts = raw_ref.split(" - ")
                tran_ref_no = ref_parts[0]

                purchase_contract_id = ''
                sale_contract_id = ''
                if len(ref_parts) > 1:
                    tail = ref_parts[1]
                    if "-9" in tail:
                        purchase_contract_id = tail.split("-9")[0]
                    if "-0" in tail:
                        sale_contract_id = tail.split("-0")[0]

                HedgingSpr.objects.create(
                    group_name=data.get("group_name", [None])[i],
                    leg1_fix=data.get("leg1_fix", [None])[i],
                    leg2_fix=data.get("leg2_fix", [None])[i],
                    leg1_float=data.get("leg1_float", [None])[i],
                    leg2_float=data.get("leg2_float", [None])[i],
                    hedging_type=data.get("hedging_type", [None])[i],
                    pricing_basis_sp=data.get("pricing_basis_sp", [None])[i],
                    pricing_basis_leg1=data.get("pricing_basis_leg1", [None])[i],
                    pricing_basis_leg2=data.get("pricing_basis_leg2", [None])[i],
                    pricing_basis_leg3=data.get("pricing_basis_leg3", [None])[i],
                    pricing_basis_sp1=data.get("pricing_basis_sp1", [None])[i],
                    pricing_basis_lega=data.get("pricing_basis_lega", [None])[i],
                    pricing_basis_legb=data.get("pricing_basis_legb", [None])[i],
                    pricing_basis_legc=data.get("pricing_basis_legc", [None])[i],
                    sale_contract_id=sale_contract_id,
                    purchase_contract_id=purchase_contract_id,
                    tran_ref_no=tran_ref_no,
                    paper=data.get("paper", [None])[i],
                    transaction_type=data.get("transaction_type", [None])[i],
                    counterparty=data.get("counterparty", [None])[i],
                    pricing_basis1=data.get("pricing_basis1", [None])[i],
                    pricing_basis2=data.get("pricing_basis2", [None])[i],
                    quantity=data.get("quantity", [None])[i],
                    quantity_mt=data.get("quantity_mt", [None])[i],
                    fixed_price=data.get("fixed_price", [None])[i],
                    pricing_period_from=parse_date(data.get("pricing_period_from", [None])[i]),
                    pricing_period_to=parse_date(data.get("pricing_period_to", [None])[i]),
                    floating_price=data.get("floating_price", [None])[i],
                    settlement_value=data.get("settlement_value", [None])[i],
                    settlement_due=data.get("settlement_due", [None])[i],
                    settlement_date=parse_date(data.get("settlement_date", [None])[i]),
                    credit_terms1=data.get("credit_terms1", [None])[i],
                    credit_terms2=data.get("credit_terms2", [None])[i],
                    broker_name=data.get("broker_name", [None])[i],
                    broker_charges=data.get("broker_charges", [None])[i],
                    charges_unit=data.get("charges_unit", [None])[i],
                    traded_by=request.user,
                    traded_on=parse_date(data.get("traded_on", [None])[i]),
                    approved_by=None,
                    approved_on=None,
                    stop_loss_limit=data.get("stop_loss_limit", [None])[i],
                    delete_status=False,
                    email_id=data.get("email_id", [None])[i],
                )

            return Response({"message": "Paper Trades Uploaded Successfully"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# class HedgingListAPIView(ListAPIView):
#     """
#     API endpoint for listing all hedging trades
#     Requires authentication via JWT tokens
#     Supports filtering by query parameters
#     """
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = HedgingSprSerializer

#     def get_queryset(self):
#         queryset = HedgingSpr.objects.all().order_by('-DateCreated')

#         # # Filter by type
#         # trade_type = self.request.query_params.get('transaction_type')
#         # if trade_type in ['Bought', 'Sold']:
#         #     queryset = queryset.filter(transaction_type=trade_type)

#         # Filter by trade date
#         date_from = self.request.query_params.get('date_from')
#         date_to = self.request.query_params.get('date_to')
#         if date_from:
#             queryset = queryset.filter(traded_on__gte=date_from)
#         if date_to:
#             queryset = queryset.filter(traded_on__lte=date_to)

#         # Filter by counterparty
#         counterparty = self.request.query_params.get('counterparty')
#         if counterparty:
#             queryset = queryset.filter(counterparty__icontains=counterparty)

#         return queryset
    
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
        trade_type = self.request.query_params.get('transaction_type')
        if trade_type in ['Bought', 'Sold']:
            queryset = queryset.filter(transaction_type=trade_type)

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