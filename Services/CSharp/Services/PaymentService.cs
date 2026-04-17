using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Interfaces;
using FinalDev3.Services.Models;
using FinalDev3.Services.Clients;

namespace FinalDev3.Services.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly PaymentApiClient _apiClient;

        public PaymentService(PaymentApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        public async Task<PaymentSuccessfulDto> CreateAsync(CreatePaymentDto payload)
        {
            return await _apiClient.CreateAsync(payload);
        }

        public async Task<PaymentWithRelationsDto?> GetAsync(GetPaymentDto filters)
        {
            return await _apiClient.GetAsync(
                filters.PaymentId,
                filters.BillId,
                filters.Date,
                filters.Relations,
                filters.IsRefunded
            );
        }

        public async Task<IEnumerable<PaymentWithRelationsDto>> GetManyAsync(GetManyPaymentFilterDto filters)
        {
            return await _apiClient.GetManyAsync(
                filters.BillId,
                filters.Date,
                filters.Relations,
                filters.IsRefunded
            );
        }

        public async Task<IEnumerable<PaymentWithRelationsDto>> GetManyByMonthAsync(GetManyPaymentByMonthDto filters)
        {
            return await _apiClient.GetManyByMonthAsync(filters.Year, filters.Month);
        }
    }
}
