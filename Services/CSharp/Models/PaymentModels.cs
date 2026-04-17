using System;
using System.Collections.Generic;

namespace FinalDev3.Services.Models
{
    public enum PaymentMethod
    {
        Cash,
        CreditCard,
        Transfer
    }

    public class CreatePaymentDto
    {
        public int BillId { get; set; }
        public int CashierId { get; set; }
        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; }
        public string TransactionRef { get; set; } = string.Empty;
    }

    public class GetPaymentDto
    {
        public int PaymentId { get; set; }
        public int? BillId { get; set; }
        public DateTime? Date { get; set; }
        public bool? Relations { get; set; }
        public bool? IsRefunded { get; set; }
    }

    public class GetManyPaymentFilterDto
    {
        public int? BillId { get; set; }
        public DateTime? Date { get; set; }
        public bool? Relations { get; set; }
        public bool? IsRefunded { get; set; }
    }

    public class GetManyPaymentByMonthDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
    }

    public class PaymentWithRelationsDto
    {
        public int PaymentId { get; set; }
        public int BillId { get; set; }
        public int CashierId { get; set; }
        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; }
        public string TransactionRef { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; }
        public bool IsRefunded { get; set; }
        public BillWithRelationsDto? Bill { get; set; }
    }

    public class PaymentSuccessfulDto
    {
        public int BillId { get; set; }
        public int CashierId { get; set; }
        public int PaymentId { get; set; }
        public decimal Devolution { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal Debt { get; set; }
        public PaymentMethod Method { get; set; }
    }
}
