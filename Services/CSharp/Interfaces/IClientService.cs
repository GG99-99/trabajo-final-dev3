using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Interfaces
{
    public interface IClientService
    {
        Task<IEnumerable<ClientPublicDto>> GetManyAsync();
        Task<ClientPublicDto?> GetAsync(int clientId);
        Task<ClientPublicDto> CreateAsync(ClientCreateDto payload);
        Task<bool> SoftDeleteAsync(int clientId);
    }
}
