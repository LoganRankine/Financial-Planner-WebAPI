using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace webapi.Models.BudgetObjects
{
    public class BudgetItemResponse
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string ItemId { get; set; }
        public string BudgetId { get; set; }
        public string ItemName { get; set; }
        public decimal ItemAmount { get; set; }
        public DateTime PurchaseDate { get; set; }

    }
}
