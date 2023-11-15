using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace webapi.Models
{
    public class User
    {
        [Key]
        [System.Text.Json.Serialization.JsonIgnore]
        public string Id { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public string SessionId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
