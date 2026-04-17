using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Interfaces
{
    public interface IWorkerService
    {
        Task<IEnumerable<WorkerPublicDto>> GetManyAsync();
        Task<WorkerPublicDto?> GetAsync(int workerId);
    }
}
