# Generated by Django 5.2 on 2025-04-10 17:14

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='FwdPriceQuotesValues',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quote_name', models.CharField(max_length=255)),
                ('period_from', models.DateField()),
                ('period_to', models.DateField()),
                ('value', models.DecimalField(decimal_places=2, max_digits=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'unique_together': {('quote_name', 'period_from', 'period_to')},
            },
        ),
        migrations.CreateModel(
            name='HedgingSpr',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('group_name', models.CharField(max_length=255)),
                ('leg1_fix', models.DecimalField(decimal_places=2, max_digits=20)),
                ('leg2_fix', models.DecimalField(decimal_places=2, max_digits=20)),
                ('leg1_float', models.DecimalField(decimal_places=2, max_digits=20)),
                ('leg2_float', models.DecimalField(decimal_places=2, max_digits=20)),
                ('hedging_type', models.CharField(choices=[('FlatPrice', 'Flat Price'), ('Spread', 'Spread')], max_length=20)),
                ('pricingbasis_sp', models.CharField(blank=True, max_length=255, null=True)),
                ('pricingbasis_leg1', models.CharField(blank=True, max_length=255, null=True)),
                ('pricingbasis_leg2', models.CharField(blank=True, max_length=255, null=True)),
                ('pricingbasis_leg3', models.CharField(blank=True, max_length=255, null=True)),
                ('pricingbasis_sp1', models.CharField(blank=True, max_length=255, null=True)),
                ('pricingbasis_lega', models.CharField(blank=True, max_length=255, null=True)),
                ('pricingbasis_legb', models.CharField(blank=True, max_length=255, null=True)),
                ('pricingbasis_legc', models.CharField(blank=True, max_length=255, null=True)),
                ('Salecontractid', models.CharField(blank=True, max_length=255, null=True)),
                ('Purchasecontractid', models.CharField(blank=True, max_length=255, null=True)),
                ('Tran_Ref_No', models.CharField(max_length=255)),
                ('paper', models.CharField(max_length=255)),
                ('type', models.CharField(choices=[('Bought', 'Bought'), ('Sold', 'Sold')], max_length=10)),
                ('counterparty', models.CharField(max_length=255)),
                ('pricing_basis1', models.CharField(max_length=255)),
                ('pricing_basis2', models.CharField(max_length=255)),
                ('Quantity', models.DecimalField(decimal_places=2, max_digits=20)),
                ('Quantity_mt', models.DecimalField(decimal_places=2, max_digits=20)),
                ('fixed_price', models.DecimalField(decimal_places=2, max_digits=20)),
                ('pricing_period_from', models.DateField()),
                ('pricing_period_to', models.DateField()),
                ('floating_price', models.DecimalField(decimal_places=2, max_digits=20)),
                ('settlement_value', models.DecimalField(decimal_places=2, max_digits=20)),
                ('settlement_due', models.DecimalField(decimal_places=2, max_digits=20)),
                ('settlement_date', models.DateField()),
                ('credit_terms1', models.DecimalField(decimal_places=2, max_digits=20)),
                ('credit_terms2', models.CharField(max_length=255)),
                ('broker_name', models.CharField(max_length=255)),
                ('broker_charges', models.CharField(max_length=255)),
                ('charges_unit', models.CharField(max_length=255)),
                ('traded_on', models.DateField()),
                ('approved_on', models.DateField(blank=True, null=True)),
                ('stop_loss_limit', models.DecimalField(blank=True, decimal_places=2, max_digits=20, null=True)),
                ('delete_status', models.BooleanField(default=False)),
                ('DateCreated', models.DateTimeField(auto_now_add=True)),
                ('DateModified', models.DateTimeField(auto_now=True)),
                ('approved_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='hedging_approvals', to=settings.AUTH_USER_MODEL)),
                ('traded_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='hedging_trades', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='HistoryRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('updated_column', models.CharField(max_length=255)),
                ('old_value', models.CharField(max_length=255)),
                ('new_value', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
