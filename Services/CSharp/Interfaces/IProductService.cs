using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductWithRelationsDto>> GetManyAsync(GetManyProductFilterDto filters);
        Task<ProductWithRelationsDto?> GetAsync(int productId);
        Task<ProductWithRelationsDto> CreateAsync(CreateProductDto payload);
    }
}
