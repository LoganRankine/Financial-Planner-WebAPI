namespace webapi.Models
{
    public class CreateUserResponse
    {
        public bool Success { get; set; }
        public bool UserNameExists { get; set; }
        public bool PasswordsMatch { get; set; }
        public bool EmailExists { get; set; }
        public string Desciption { get; set; }
    }
}
