using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models.BudgetObjects
{
    public class BudgetResponse
    {
        public string BudgetId { get; set; }
        public string BudgetName { get; set; }
        public decimal AvailableAmount { get; set; }
        public decimal WeeklyAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
