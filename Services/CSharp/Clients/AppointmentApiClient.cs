using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Clients
{
    public class AppointmentApiClient : BaseApiClient
    {
        public AppointmentApiClient(HttpClient httpClient) : base(httpClient)
        {
        }

        public async Task<IEnumerable<AppointmentWithRelationsDto>> GetManyAsync(AppointmentFilterDto filters)
        {
            var query = new Dictionary<string, string?>
            {
                ["appointment_id"] = filters.AppointmentId?.ToString(),
                ["worker_id"] = filters.WorkerId?.ToString(),
                ["client_id"] = filters.ClientId?.ToString(),
                ["tattoo_id"] = filters.TattooId?.ToString(),
                ["start"] = filters.Start,
                ["end"] = filters.End,
                ["date"] = filters.Date?.ToString("o"),
                ["status"] = filters.Status?.ToString().ToLowerInvariant(),
            };

            var url = BuildUrl("api/appointments", query);
            return await GetAsync<IEnumerable<AppointmentWithRelationsDto>>(url) ?? Array.Empty<AppointmentWithRelationsDto>();
        }

        public async Task<IEnumerable<AppointmentBlockTimeDto>> GetBlocksAsync(DateTime date, int workerId)
        {
            var url = BuildUrl("api/appointments/blocks", new Dictionary<string, string?>
            {
                ["date"] = date.ToString("o"),
                ["worker_id"] = workerId.ToString(),
            });
            return await GetAsync<IEnumerable<AppointmentBlockTimeDto>>(url) ?? Array.Empty<AppointmentBlockTimeDto>();
        }

        public async Task<AppointmentWithRelationsDto> CreateAsync(CreateAppointmentDto payload)
        {
            return await PostAsync<AppointmentWithRelationsDto>("api/appointments", payload);
        }

        public async Task<bool> UpdateStatusAsync(UpdateAppointmentStatusDto payload)
        {
            return await PutAsync<bool>("api/appointments/status", payload);
        }
    }
}
