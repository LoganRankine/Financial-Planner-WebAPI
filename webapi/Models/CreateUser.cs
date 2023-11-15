using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class CreateUser
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Confirm_Password { get; set; }

    }
}
