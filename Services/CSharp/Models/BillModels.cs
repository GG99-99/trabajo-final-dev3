using System;
using System.Collections.Generic;

namespace FinalDev3.Services.Models
{
    public enum BillStatus
    {
        Pending,
        Partially,
        Paid,
        Cancelled,
        Refunded
    }

    public class GetManyBillFilterDto
    {
        public DateTime? Date { get; set; }
        public BillStatus? Status { get; set; }
        public int? ClientId { get; set; }
        public int? CashierId { get; set; }
        public bool? Relations { get; set; }
    }

    public class GetBillDto
    {
        public int BillId { get; set; }
        public bool? Relations { get; set; }
    }

    public class BillProductItemDto
    {
        public int ProductVariantId { get; set; }
        public int Quantity { get; set; }
    }

    public class BillAggregateDto
    {
        public int BillId { get; set; }
        public decimal Amount { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class BillDiscountDto
    {
        public int BillId { get; set; }
        public decimal Amount { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class BillExtraDto
    {
        public List<BillAggregateDto> Aggregates { get; set; } = new();
        public List<BillDiscountDto> Discounts { get; set; } = new();
    }

    public class CreateFullBillDto
    {
        public int ClientId { get; set; }
        public int WorkerId { get; set; }
        public int CashierId { get; set; }
        public int? AppointmentId { get; set; }
        public DateTime CreateAt { get; set; }
        public List<int> TattooIds { get; set; } = new();
        public List<BillProductItemDto> Items { get; set; } = new();
        public BillExtraDto Extra { get; set; } = new BillExtraDto();
    }

    public class UpdateBillStatusDto
    {
        public int BillId { get; set; }
        public BillStatus Status { get; set; }
    }

    public class BillProductDetailDto
    {
        public string ProductName { get; set; } = string.Empty;
        public string Presentation { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockMovementQuantity { get; set; }
        public int InventoryItemId { get; set; }
    }

    public class BillTattooItemDto
    {
        public int TattooId { get; set; }
        public decimal Price { get; set; }
    }

    public class BillFinanceDto
    {
        public int BillId { get; set; }
        public decimal Total { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalAfterDiscount { get; set; }
        public decimal Debt { get; set; }
        public decimal Overpaid { get; set; }
    }

    public class BillPaymentDto
    {
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public string Method { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; }
    }

    public class BillWithRelationsDto
    {
        public int BillId { get; set; }
        public int ClientId { get; set; }
        public int WorkerId { get; set; }
        public int CashierId { get; set; }
        public int? AppointmentId { get; set; }
        public DateTime CreateAt { get; set; }
        public BillStatus Status { get; set; }
        public List<BillProductDetailDto> Details { get; set; } = new();
        public List<BillTattooItemDto> Tattoos { get; set; } = new();
        public List<BillPaymentDto> Payments { get; set; } = new();
        public List<BillAggregateDto> Aggregates { get; set; } = new();
        public List<BillDiscountDto> Discounts { get; set; } = new();
        public ClientWithRelationsDto? Client { get; set; }
        public WorkerWithPersonDto? Worker { get; set; }
    }
}
