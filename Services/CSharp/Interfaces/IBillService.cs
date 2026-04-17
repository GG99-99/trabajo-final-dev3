using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Interfaces
{
    public interface IBillService
    {
        Task<IEnumerable<BillWithRelationsDto>> GetManyAsync(GetManyBillFilterDto filters);
        Task<BillWithRelationsDto?> GetAsync(GetBillDto filters);
        Task<BillFinanceDto> GetTotalAsync(int billId);
        Task<IEnumerable<BillProductDetailDto>> GetStockMovementsAsync(int billId);
        Task<IEnumerable<BillTattooItemDto>> GetTattoosAsync(int billId);
        Task<BillWithRelationsDto> CreateAsync(CreateFullBillDto payload);
        Task<bool> UpdateStateAsync(UpdateBillStatusDto payload);
    }
}
