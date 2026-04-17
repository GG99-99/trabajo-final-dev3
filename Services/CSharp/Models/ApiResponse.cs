namespace FinalDev3.Services.Models
{
    public class ApiResponse<T>
    {
        public bool Ok { get; set; }
        public T? Data { get; set; }
        public object? Error { get; set; }
    }
}
