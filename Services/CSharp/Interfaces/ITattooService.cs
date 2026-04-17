using System.Collections.Generic;
using System.Threading.Tasks;
using FinalDev3.Services.Models;

namespace FinalDev3.Services.Interfaces
{
    public interface ITattooService
    {
        Task<IEnumerable<TattooWithImgDto>> GetManyAsync();
        Task<TattooWithImgDto?> GetAsync(int tattooId);
        Task<IEnumerable<TattooMaterialDetailDto>> GetMaterialsAsync(int tattooId);
        Task<TattooWithImgDto> CreateAsync(CreateTattooRequestDto payload);
    }
}
