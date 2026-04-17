using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Interfaces
{
    public interface IAppointmentService
    {
        Task<IEnumerable<AppointmentWithRelationsDto>> GetManyAsync(AppointmentFilterDto filters);
        Task<IEnumerable<AppointmentBlockTimeDto>> GetBlocksAsync(GetBlocksRequestDto filters);
        Task<AppointmentWithRelationsDto> CreateAsync(CreateAppointmentDto payload);
        Task<bool> UpdateStatusAsync(int appointmentId, AppointmentStatus status);
    }
}
