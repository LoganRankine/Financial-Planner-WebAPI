using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models.BudgetObjects
{
    public class CreateBudgetItem
    {
        public string? BudgetId { get; set; }
        public string? ItemName { get; set; }
        [Column(TypeName = "decimal(19,4)")]
        public decimal? ItemAmount { get; set; }
        public DateTime? PurchaseDate { get; set; }
    }
}
