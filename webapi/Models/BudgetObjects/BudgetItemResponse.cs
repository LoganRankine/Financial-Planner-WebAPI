using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace webapi.Models.BudgetObjects
{
    public class BudgetItemResponse
    {
        [Key]
        public string ItemId { get; set; }
        public string ItemName { get; set; }
        public decimal ItemAmount { get; set; }
        public DateTime PurchaseDate { get; set; }

    }
}
