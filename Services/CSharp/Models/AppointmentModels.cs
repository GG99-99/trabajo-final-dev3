using System;
using System.Collections.Generic;

namespace FinalDev3.Services.Models
{
    public enum AppointmentStatus
    {
        Pending,
        Completed,
        Expired,
        Cancelled
    }

    public class AppointmentDto
    {
        public int AppointmentId { get; set; }
        public int WorkerId { get; set; }
        public int ClientId { get; set; }
        public int TattooId { get; set; }
        public string Start { get; set; } = string.Empty;
        public string End { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public AppointmentStatus Status { get; set; }
    }

    public class AppointmentBlockTimeDto
    {
        public string Start { get; set; } = string.Empty;
        public string End { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
    }

    public class AppointmentFilterDto
    {
        public int? AppointmentId { get; set; }
        public int? WorkerId { get; set; }
        public int? ClientId { get; set; }
        public int? TattooId { get; set; }
        public string? Start { get; set; }
        public string? End { get; set; }
        public DateTime? Date { get; set; }
        public AppointmentStatus? Status { get; set; }
    }

    public class GetBlocksRequestDto
    {
        public DateTime Date { get; set; }
        public int WorkerId { get; set; }
    }

    public class CreateAppointmentDto
    {
        public int WorkerId { get; set; }
        public int ClientId { get; set; }
        public int TattooId { get; set; }
        public string Start { get; set; } = string.Empty;
        public string End { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }

    public class AppointmentWithRelationsDto : AppointmentDto
    {
        public ClientWithRelationsDto? Client { get; set; }
        public WorkerWithPersonDto? Worker { get; set; }
        public TattooWithImgDto? Tattoo { get; set; }
        public BillWithRelationsDto? Bill { get; set; }
    }
