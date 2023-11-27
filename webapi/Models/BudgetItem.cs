using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class BudgetItem
    {
        [Key]
        public string ItemId { get; set; }
        [ForeignKey("Budget")]
        public string BudgetId { get; set; }
        public Budget Budget { get; set; }
        public string ItemName { get; set; }
        [Column(TypeName = "decimal(19,4)")]
        public decimal ItemAmount { get; set; }
        public DateTime PurchaseDate { get; set; }
    }
}
