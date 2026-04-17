namespace FinalDev3.Services.Models
{
    public class WorkerPublicDto
    {
        public int WorkerId { get; set; }
        public int PersonId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
    }

    public class WorkerWithPersonDto : WorkerPublicDto
    {
        public PersonDto? Person { get; set; }
    }
}
