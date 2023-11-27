using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class Budget
    {
        [Key]
        public string BudgetId { get; set; }
        [ForeignKey("User")]
        public string Id { get; set; }
        public string BudgetName { get; set; }
        [Column(TypeName = "decimal(19,4)")]
        public decimal BudgetAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public ICollection<BudgetItem> BudgetItems { get; set; }
        public User User { get; set; }

    }
}
