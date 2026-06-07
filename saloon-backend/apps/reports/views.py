import csv
from datetime import date, timedelta
from django.db.models import Sum, Count, Avg, F
from django.db.models.functions import TruncDay, TruncMonth
from django.http import HttpResponse
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.pos.models import Sale, SaleItem
from apps.appointments.models import Appointment
from apps.customers.models import Client
from apps.staff.models import StaffProfile
from apps.accounts.permissions import IsAdminOrManager


def get_date_range(request):
    today = timezone.localdate()
    start = request.query_params.get('start', str(today - timedelta(days=30)))
    end = request.query_params.get('end', str(today))
    return start, end


def company_filter(request):
    """Return a dict suitable for queryset .filter(**company_filter(request))."""
    if request.user.is_super_admin:
        return {}
    return {'company': request.user.company}


class SalesReportView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):
        start, end = get_date_range(request)
        sales = Sale.objects.filter(
            created_at__date__range=[start, end],
            status='completed',
            **company_filter(request),
        )
        by_day = list(
            sales.annotate(day=TruncDay('created_at'))
            .values('day').annotate(total=Sum('total_amount'), count=Count('id'))
            .order_by('day')
        )
        summary = sales.aggregate(
            total_revenue=Sum('total_amount'),
            total_sales=Count('id'),
            avg_sale=Avg('total_amount'),
        )
        summary['by_day'] = by_day
        summary['by_payment_method'] = list(
            sales.values('payment_method').annotate(total=Sum('total_amount'), count=Count('id'))
        )
        return Response(summary)


class StaffCommissionReportView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):
        start, end = get_date_range(request)
        staff_sales = (
            Sale.objects.filter(
                created_at__date__range=[start, end],
                status='completed',
                **company_filter(request),
            )
            .values('staff__user__first_name', 'staff__user__last_name', 'staff__commission_rate')
            .annotate(total_sales=Sum('total_amount'), sale_count=Count('id'))
        )
        result = []
        for row in staff_sales:
            commission = (row['total_sales'] or 0) * (row['staff__commission_rate'] or 0) / 100
            result.append({
                'staff_name': f"{row['staff__user__first_name']} {row['staff__user__last_name']}",
                'total_sales': row['total_sales'],
                'sale_count': row['sale_count'],
                'commission_rate': row['staff__commission_rate'],
                'commission_amount': round(commission, 2),
            })
        return Response(result)


class ServicePopularityReportView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):
        start, end = get_date_range(request)
        sale_filter = {'sale__status': 'completed', 'sale__created_at__date__range': [start, end]}
        if not request.user.is_super_admin:
            sale_filter['sale__company'] = request.user.company
        data = list(
            SaleItem.objects.filter(item_type='service', **sale_filter)
            .values('item_name')
            .annotate(count=Count('id'), revenue=Sum('total_price'))
            .order_by('-count')[:20]
        )
        return Response(data)


class DashboardKPIView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):
        today = timezone.localdate()
        period = request.query_params.get('period', 'week')
        cf = company_filter(request)

        if period == 'day':
            days = 1
        elif period == 'month':
            days = 30
        else:
            days = 7

        start_date = today - timedelta(days=days)

        today_sales = Sale.objects.filter(created_at__date=today, status='completed', **cf)
        today_appts = Appointment.objects.filter(start_time__date=today, **cf)

        trend = list(
            Sale.objects.filter(created_at__date__gte=start_date, status='completed', **cf)
            .annotate(day=TruncDay('created_at'))
            .values('day')
            .annotate(total=Sum('total_amount'), count=Count('id'))
            .order_by('day')
        )
        sales_trend = [
            {'date': str(t['day'].date()), 'total': float(t['total'] or 0), 'count': t['count']}
            for t in trend
        ]

        payment_dist = list(
            Sale.objects.filter(created_at__date__gte=start_date, status='completed', **cf)
            .values('payment_method')
            .annotate(amount=Sum('total_amount'), count=Count('id'))
        )

        sale_item_filter = {
            'sale__created_at__date__gte': start_date,
            'item_type': 'service',
            'sale__status': 'completed',
        }
        if not request.user.is_super_admin:
            sale_item_filter['sale__company'] = request.user.company

        top_services = list(
            SaleItem.objects.filter(**sale_item_filter)
            .values('item_name')
            .annotate(count=Count('id'), revenue=Sum('total_price'))
            .order_by('-count')[:5]
        )
        top_services = [
            {'service_name': s['item_name'], 'count': s['count'], 'revenue': float(s['revenue'] or 0)}
            for s in top_services
        ]

        from apps.inventory.models import Product
        low_stock = list(
            Product.objects.filter(stock_qty__lte=F('min_stock_threshold'), is_active=True, **cf)
            .values('name', 'stock_qty', 'min_stock_threshold')[:10]
        )

        booked_appts = list(
            today_appts.filter(status__in=['pending', 'confirmed'])
            .select_related('client', 'service')
            .values('id', 'client__name', 'service__name', 'start_time', 'status')
            .order_by('start_time')[:10]
        )
        booked_appts = [
            {
                'id': a['id'],
                'client_name': a['client__name'],
                'service_name': a['service__name'],
                'start_time': str(a['start_time']),
                'status': a['status'],
            }
            for a in booked_appts
        ]

        monthly_sales = float(
            Sale.objects.filter(
                created_at__date__gte=today.replace(day=1), status='completed', **cf
            ).aggregate(t=Sum('total_amount'))['t'] or 0
        )

        client_qs = Client.objects.filter(**cf)

        return Response({
            'today_revenue': float(today_sales.aggregate(t=Sum('total_amount'))['t'] or 0),
            'today_sales_count': today_sales.count(),
            'today_appointments': today_appts.count(),
            'pending_appointments': today_appts.filter(status='pending').count(),
            'total_clients': client_qs.count(),
            'total_customers': client_qs.count(),
            'new_clients_today': client_qs.filter(created_at__date=today).count(),
            'monthly_sales': monthly_sales,
            'total_expenses': 0,
            'net_profit': monthly_sales,
            'sales_trend': sales_trend,
            'payment_distribution': payment_dist,
            'top_services': top_services,
            'low_stock_items': low_stock,
            'booked_appointments': booked_appts,
        })


class SalesExportCSVView(APIView):
    permission_classes = [IsAdminOrManager]

    def get(self, request):
        start, end = get_date_range(request)
        sales = Sale.objects.filter(
            created_at__date__range=[start, end],
            **company_filter(request),
        ).select_related('client', 'staff__user')
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="sales_{start}_{end}.csv"'
        writer = csv.writer(response)
        writer.writerow(['ID', 'Date', 'Client', 'Staff', 'Subtotal', 'Discount', 'Tax', 'Total', 'Payment Method', 'Status'])
        for sale in sales:
            writer.writerow([
                sale.id,
                sale.created_at.strftime('%Y-%m-%d %H:%M'),
                sale.client.name if sale.client else '',
                sale.staff.user.full_name if sale.staff else '',
                sale.subtotal, sale.discount_amount, sale.tax_amount,
                sale.total_amount, sale.payment_method, sale.status,
            ])
        return response
