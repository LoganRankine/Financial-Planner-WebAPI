using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using webapi.Models.BudgetObjects;

namespace webapi.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; }
        public string SessionId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public ICollection<Budget> Budgets { get; set; }

    }
}
