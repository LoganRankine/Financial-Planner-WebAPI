namespace webapi.Models.BudgetObjects
{
    public class UpdateBudgetResponse
    {
        public required bool Success { get; set; }
        public required string Description { get; set; }
        public Budget Budget { get; set; }
    }
}
