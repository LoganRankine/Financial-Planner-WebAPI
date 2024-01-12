namespace webapi.Models.BudgetObjects
{
    public class EditBudget
    {
        public string BudgetId { get; set; }
        public string? BudgetName { get; set; }
        public decimal? BudgetAmount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
