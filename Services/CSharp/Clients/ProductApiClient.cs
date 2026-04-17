using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Clients
{
    public class ProductApiClient : BaseApiClient
    {
        public ProductApiClient(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IEnumerable<ProductWithRelationsDto>> GetManyAsync(int? providerId = null, int? categoryId = null)
        {
            var url = BuildUrl("api/products", new Dictionary<string, string?>
            {
                ["provider_id"] = providerId?.ToString(),
                ["category_id"] = categoryId?.ToString(),
            });
            return await GetAsync<IEnumerable<ProductWithRelationsDto>>(url) ?? new List<ProductWithRelationsDto>();
        }

        public async Task<ProductWithRelationsDto?> GetAsync(int productId)
        {
            var url = BuildUrl("api/products/detail", new Dictionary<string, string?>
            {
                ["product_id"] = productId.ToString(),
            });
            return await GetAsync<ProductWithRelationsDto?>(url);
        }

        public async Task<ProductWithRelationsDto> CreateAsync(CreateProductDto payload)
        {
            return await PostAsync<ProductWithRelationsDto>("api/products", payload);
        }
    }
}
