using System.Collections.Generic;

namespace FinalDev3.Services.Models
{
    public class GetTattooDto
    {
        public int TattooId { get; set; }
    }

    public class GetTattooMaterialsDto
    {
        public int TattooId { get; set; }
    }

    public class CreateImgDto
    {
        public string Source { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class TattooMaterialRequestDto
    {
        public int ProductVariantId { get; set; }
        public int Quantity { get; set; }
    }

    public class CreateTattooRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public string Time { get; set; } = string.Empty;
        public CreateImgDto Img { get; set; } = new CreateImgDto();
        public List<TattooMaterialRequestDto> Materials { get; set; } = new();
    }

    public class ImgDto
    {
        public int ImgId { get; set; }
        public string Source { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class TattooWithImgDto
    {
        public int TattooId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public string Time { get; set; } = string.Empty;
        public ImgDto? Img { get; set; }
    }

    public class TattooMaterialDetailDto
    {
        public int ProductVariantId { get; set; }
        public int Quantity { get; set; }
    }

    public class TattooWithMaterialsDto
    {
        public int TattooId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public string Time { get; set; } = string.Empty;
        public List<TattooMaterialDetailDto> Materials { get; set; } = new();
    }
}
