using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Clients
{
    public class ClientApiClient : BaseApiClient
    {
        public ClientApiClient(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IEnumerable<ClientPublicDto>> GetManyAsync()
        {
            return await GetAsync<IEnumerable<ClientPublicDto>>("api/clients") ?? new List<ClientPublicDto>();
        }

        public async Task<ClientPublicDto?> GetAsync(int clientId)
        {
            var url = BuildUrl("api/clients/detail", new Dictionary<string, string?>
            {
                ["client_id"] = clientId.ToString(),
            });
            return await GetAsync<ClientPublicDto?>(url);
        }

        public async Task<ClientPublicDto> CreateAsync(ClientCreateDto payload)
        {
            return await PostAsync<ClientPublicDto>("api/clients", payload);
        }

        public async Task<bool> SoftDeleteAsync(int clientId)
        {
            return await DeleteAsync($"api/clients/{clientId}");
        }
    }
}
