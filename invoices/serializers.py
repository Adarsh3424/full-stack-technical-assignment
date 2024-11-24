from rest_framework import serializers
from .models import Invoice, InvoiceDetail

class InvoiceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceDetail
        fields = ['id', 'description', 'quantity', 'unit_price', 'line_total']

    def update(self, instance, validated_data):
        instance.description = validated_data.get('description', instance.description)
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.unit_price = validated_data.get('unit_price', instance.unit_price)
        instance.line_total = instance.quantity * instance.unit_price  # Recalculate line_total
        instance.save()
        return instance


class InvoiceSerializer(serializers.ModelSerializer):
    details = InvoiceDetailSerializer(many=True)

    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'customer_name', 'date', 'details']

    def update(self, instance, validated_data):
        # Update the Invoice fields
        instance.invoice_number = validated_data.get('invoice_number', instance.invoice_number)
        instance.customer_name = validated_data.get('customer_name', instance.customer_name)
        instance.date = validated_data.get('date', instance.date)
        instance.save()

        # Update InvoiceDetail records
        details_data = validated_data.pop('details', [])
        current_detail_ids = [detail.id for detail in instance.details.all()]
        sent_detail_ids = [detail_data.get('id') for detail_data in details_data]

        # Delete details not in sent data
        for detail_id in current_detail_ids:
            if detail_id not in sent_detail_ids:
                InvoiceDetail.objects.filter(id=detail_id).delete()

        # Update or create details
        for detail_data in details_data:
            detail_id = detail_data.get('id')
            if detail_id and detail_id in current_detail_ids:
                # Update existing detail
                detail_instance = InvoiceDetail.objects.get(id=detail_id, invoice=instance)
                detail_serializer = InvoiceDetailSerializer(detail_instance, data=detail_data, partial=True)
                if detail_serializer.is_valid():
                    detail_serializer.save()
                else:
                    raise serializers.ValidationError(detail_serializer.errors)
            else:
                # Create new detail
                InvoiceDetail.objects.create(invoice=instance, **detail_data)

        return instance

    def create(self, validated_data):
        # Create the invoice
        details_data = validated_data.pop('details', [])
        invoice = Invoice.objects.create(**validated_data)

        # Create InvoiceDetail records
        for detail_data in details_data:
            InvoiceDetail.objects.create(invoice=invoice, **detail_data)

        return invoice
