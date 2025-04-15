# models.py
from django.db import models
from django.contrib.auth.models import User

class FwdPriceQuotesValues(models.Model):
    quote_name = models.CharField(max_length=255)
    period_from = models.DateField()
    period_to = models.DateField()
    value = models.DecimalField(max_digits=20, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('quote_name', 'period_from', 'period_to')

class HedgingSpr(models.Model):
    HEDGE_TYPES = (
        ('FlatPrice', 'Flat Price'),
        ('Spread', 'Spread'),
    )
    
    TRANSACTION_TYPES = (
        ('Bought', 'Bought'),
        ('Sold', 'Sold'),
    )
    
    group_name = models.CharField(max_length=255)
    leg1_fix = models.DecimalField(max_digits=20, decimal_places=2)
    leg2_fix = models.DecimalField(max_digits=20, decimal_places=2)
    leg1_float = models.DecimalField(max_digits=20, decimal_places=2)
    leg2_float = models.DecimalField(max_digits=20, decimal_places=2)
    hedging_type = models.CharField(max_length=20, choices=HEDGE_TYPES)
    pricingbasis_sp = models.CharField(max_length=255, blank=True, null=True)
    pricingbasis_leg1 = models.CharField(max_length=255, blank=True, null=True)
    pricingbasis_leg2 = models.CharField(max_length=255, blank=True, null=True)
    pricingbasis_leg3 = models.CharField(max_length=255, blank=True, null=True)
    pricingbasis_sp1 = models.CharField(max_length=255, blank=True, null=True)
    pricingbasis_lega = models.CharField(max_length=255, blank=True, null=True)
    pricingbasis_legb = models.CharField(max_length=255, blank=True, null=True)
    pricingbasis_legc = models.CharField(max_length=255, blank=True, null=True)
    Salecontractid = models.CharField(max_length=255, blank=True, null=True)
    Purchasecontractid = models.CharField(max_length=255, blank=True, null=True)
    Tran_Ref_No = models.CharField(max_length=255)
    paper = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    counterparty = models.CharField(max_length=255)
    pricing_basis1 = models.CharField(max_length=255)
    pricing_basis2 = models.CharField(max_length=255)
    Quantity = models.DecimalField(max_digits=20, decimal_places=2)
    Quantity_mt = models.DecimalField(max_digits=20, decimal_places=2)
    fixed_price = models.DecimalField(max_digits=20, decimal_places=2)
    pricing_period_from = models.DateField()
    pricing_period_to = models.DateField()
    floating_price = models.DecimalField(max_digits=20, decimal_places=2)
    settlement_value = models.DecimalField(max_digits=20, decimal_places=2)
    settlement_due = models.DecimalField(max_digits=20, decimal_places=2)
    settlement_date = models.DateField()
    credit_terms1 = models.DecimalField(max_digits=20, decimal_places=2)
    credit_terms2 = models.CharField(max_length=255)
    broker_name = models.CharField(max_length=255)
    broker_charges = models.CharField(max_length=255)
    charges_unit = models.CharField(max_length=255)
    traded_by = models.ForeignKey(User, related_name='hedging_trades', on_delete=models.PROTECT)
    traded_on = models.DateField()
    approved_by = models.ForeignKey(User, related_name='hedging_approvals', on_delete=models.PROTECT, null=True, blank=True)
    approved_on = models.DateField(null=True, blank=True)
    stop_loss_limit = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    delete_status = models.BooleanField(default=False)
    DateCreated = models.DateTimeField(auto_now_add=True)
    DateModified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.Tran_Ref_No} - {self.type}"

class HistoryRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    date = models.DateTimeField(auto_now_add=True)
    updated_column = models.CharField(max_length=255)
    old_value = models.CharField(max_length=255)
    new_value = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.updated_column} changed by {self.user}"