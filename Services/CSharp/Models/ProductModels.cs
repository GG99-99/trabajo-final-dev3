using System.Collections.Generic;

namespace FinalDev3.Services.Models
{
    public class GetProductDto
    {
        public int ProductId { get; set; }
    }

    public class GetManyProductFilterDto
    {
        public int? ProviderId { get; set; }
        public int? CategoryId { get; set; }
    }

    public class CreateProductDto
    {
        public int CategoryId { get; set; }
        public int ProviderId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
    }

    public class ProductVariantDto
    {
        public int ProductVariantId { get; set; }
        public int ProductId { get; set; }
        public string Presentation { get; set; } = string.Empty;
        public int MinStockLevel { get; set; }
        public decimal Price { get; set; }
        public string Unit { get; set; } = string.Empty;
    }

    public class ProductWithRelationsDto
    {
        public int ProductId { get; set; }
        public int CategoryId { get; set; }
        public int ProviderId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public List<ProductVariantDto> Variants { get; set; } = new();
    }
}
