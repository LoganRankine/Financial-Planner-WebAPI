namespace webapi.Models
{
    public class UserSessionResponse
    {
        public bool Success { get; set; }
        public string? SessionID { get; set; }
        public string? Description { get; set; }
    }
}
