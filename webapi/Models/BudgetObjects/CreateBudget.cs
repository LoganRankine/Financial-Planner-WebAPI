namespace webapi.Models.BudgetObjects
{
    public class CreateBudget
    {
        public string BudgetName { get; set; }
        public decimal BudgetAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
