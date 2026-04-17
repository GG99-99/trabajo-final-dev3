using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;
using System;

namespace FinalDev3.Services.Clients
{
    public class PaymentApiClient : BaseApiClient
    {
        public PaymentApiClient(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<PaymentSuccessfulDto> CreateAsync(CreatePaymentDto payload)
        {
            return await PostAsync<PaymentSuccessfulDto>("api/payments", payload);
        }

        public async Task<PaymentWithRelationsDto?> GetAsync(int paymentId, int? billId = null, DateTime? date = null, bool? relations = null, bool? isRefunded = null)
        {
            var url = BuildUrl("api/payments/detail", new Dictionary<string, string?>
            {
                ["payment_id"] = paymentId.ToString(),
                ["bill_id"] = billId?.ToString(),
                ["date"] = date?.ToString("o"),
                ["relations"] = relations?.ToString().ToLowerInvariant(),
                ["is_refunded"] = isRefunded?.ToString().ToLowerInvariant(),
            });
            return await GetAsync<PaymentWithRelationsDto?>(url);
        }

        public async Task<IEnumerable<PaymentWithRelationsDto>> GetManyAsync(int? billId = null, DateTime? date = null, bool? relations = null, bool? isRefunded = null)
        {
            var url = BuildUrl("api/payments", new Dictionary<string, string?>
            {
                ["bill_id"] = billId?.ToString(),
                ["date"] = date?.ToString("o"),
                ["relations"] = relations?.ToString().ToLowerInvariant(),
                ["is_refunded"] = isRefunded?.ToString().ToLowerInvariant(),
            });
            return await GetAsync<IEnumerable<PaymentWithRelationsDto>>(url) ?? new List<PaymentWithRelationsDto>();
        }

        public async Task<IEnumerable<PaymentWithRelationsDto>> GetManyByMonthAsync(int year, int month)
        {
            var url = BuildUrl("api/payments/month", new Dictionary<string, string?>
            {
                ["year"] = year.ToString(),
                ["month"] = month.ToString(),
            });
            return await GetAsync<IEnumerable<PaymentWithRelationsDto>>(url) ?? new List<PaymentWithRelationsDto>();
        }
    }
}
