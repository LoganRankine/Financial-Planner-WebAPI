namespace webapi.Models.BudgetObjects
{
    public class BudgetItemObjectResponse
    {
        public decimal BudgetItemTotal {  get; set; }
        public List<BudgetItemResponse> BudgetItems { get; set; }
    }
}
