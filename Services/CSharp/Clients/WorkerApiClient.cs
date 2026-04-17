using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Clients
{
    public class WorkerApiClient : BaseApiClient
    {
        public WorkerApiClient(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IEnumerable<WorkerPublicDto>> GetManyAsync()
        {
            return await GetAsync<IEnumerable<WorkerPublicDto>>("api/workers") ?? new List<WorkerPublicDto>();
        }

        public async Task<WorkerPublicDto?> GetAsync(int workerId)
        {
            var url = BuildUrl("api/workers/detail", new Dictionary<string, string?>
            {
                ["worker_id"] = workerId.ToString(),
            });
            return await GetAsync<WorkerPublicDto?>(url);
        }
    }
}
