using System;

namespace FinalDev3.Services.Models
{
    public enum PersonType
    {
        Client,
        Cashier,
        Worker
    }

    public class PersonDto
    {
        public int PersonId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Password { get; set; }
        public PersonType Type { get; set; }
    }

    public class ClientPublicDto
    {
        public int ClientId { get; set; }
        public int PersonId { get; set; }
        public string? MedicalNotes { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }

    public class ClientWithRelationsDto
    {
        public int ClientId { get; set; }
        public int PersonId { get; set; }
        public string? MedicalNotes { get; set; }
        public PersonDto? Person { get; set; }
    }

    public class ClientCreateDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public PersonType Type { get; set; } = PersonType.Client;
        public string MedicalNotes { get; set; } = string.Empty;
    }
}
