using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Clients
{
    public class TattooApiClient : BaseApiClient
    {
        public TattooApiClient(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IEnumerable<TattooWithImgDto>> GetManyAsync()
        {
            return await GetAsync<IEnumerable<TattooWithImgDto>>("api/tattoos") ?? new List<TattooWithImgDto>();
        }

        public async Task<TattooWithImgDto?> GetAsync(int tattooId)
        {
            var url = BuildUrl("api/tattoos/detail", new Dictionary<string, string?>
            {
                ["tattoo_id"] = tattooId.ToString(),
            });
            return await GetAsync<TattooWithImgDto?>(url);
        }

        public async Task<IEnumerable<TattooMaterialDetailDto>> GetMaterialsAsync(int tattooId)
        {
            var url = BuildUrl("api/tattoos/materials", new Dictionary<string, string?>
            {
                ["tattoo_id"] = tattooId.ToString(),
            });
            return await GetAsync<IEnumerable<TattooMaterialDetailDto>>(url) ?? new List<TattooMaterialDetailDto>();
        }

        public async Task<TattooWithImgDto> CreateAsync(CreateTattooRequestDto payload)
        {
            return await PostAsync<TattooWithImgDto>("api/tattoos", payload);
        }
    }
}
