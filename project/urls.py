from django.contrib import admin
from django.urls import path, include  # Include is required for app URL inclusion

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('invoices.urls')),  # Include the URLs of the invoices app
]
