using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;
using System;

namespace FinalDev3.Services.Clients
{
    public class BillApiClient : BaseApiClient
    {
        public BillApiClient(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IEnumerable<BillWithRelationsDto>> GetManyAsync(DateTime? date = null, BillStatus? status = null, int? clientId = null, int? cashierId = null, bool? relations = null)
        {
            var url = BuildUrl("api/bills", new Dictionary<string, string?>
            {
                ["date"] = date?.ToString("o"),
                ["status"] = status?.ToString().ToLowerInvariant(),
                ["client_id"] = clientId?.ToString(),
                ["cashier_id"] = cashierId?.ToString(),
                ["relations"] = relations?.ToString().ToLowerInvariant(),
            });
            return await GetAsync<IEnumerable<BillWithRelationsDto>>(url) ?? new List<BillWithRelationsDto>();
        }

        public async Task<BillWithRelationsDto?> GetAsync(int billId, bool? relations = null)
        {
            var url = BuildUrl("api/bills/detail", new Dictionary<string, string?>
            {
                ["bill_id"] = billId.ToString(),
                ["relations"] = relations?.ToString().ToLowerInvariant(),
            });
            return await GetAsync<BillWithRelationsDto?>(url);
        }

        public async Task<BillFinanceDto> GetTotalAsync(int billId)
        {
            var url = BuildUrl("api/bills/total", new Dictionary<string, string?>
            {
                ["bill_id"] = billId.ToString(),
            });
            return await GetAsync<BillFinanceDto>(url);
        }

        public async Task<IEnumerable<BillProductDetailDto>> GetStockMovementsAsync(int billId)
        {
            var url = BuildUrl("api/bills/stock-movements", new Dictionary<string, string?>
            {
                ["bill_id"] = billId.ToString(),
            });
            return await GetAsync<IEnumerable<BillProductDetailDto>>(url) ?? new List<BillProductDetailDto>();
        }

        public async Task<IEnumerable<BillTattooItemDto>> GetTattoosAsync(int billId)
        {
            var url = BuildUrl("api/bills/tattoos", new Dictionary<string, string?>
            {
                ["bill_id"] = billId.ToString(),
            });
            return await GetAsync<IEnumerable<BillTattooItemDto>>(url) ?? new List<BillTattooItemDto>();
        }

        public async Task<BillWithRelationsDto> CreateAsync(CreateFullBillDto payload)
        {
            return await PostAsync<BillWithRelationsDto>("api/bills", payload);
        }

        public async Task<bool> UpdateStateAsync(UpdateBillStatusDto payload)
        {
            return await PutAsync<bool>("api/bills/state", payload);
        }
    }
}
