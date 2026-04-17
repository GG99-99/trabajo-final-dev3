using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentSuccessfulDto> CreateAsync(CreatePaymentDto payload);
        Task<PaymentWithRelationsDto?> GetAsync(GetPaymentDto filters);
        Task<IEnumerable<PaymentWithRelationsDto>> GetManyAsync(GetManyPaymentFilterDto filters);
        Task<IEnumerable<PaymentWithRelationsDto>> GetManyByMonthAsync(GetManyPaymentByMonthDto filters);
    }
}
