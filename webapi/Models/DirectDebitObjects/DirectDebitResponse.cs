namespace webapi.Models.DirectDebitObjects
{
    public class DirectDebitResponse
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string DebitId { get; set; }
        public string BudgetId { get; set; }
        public string DebitName { get; set; }
        public decimal DebitAmount { get; set; }
        public DateTime DebitDate { get; set; }
        public int Frequency { get; set; }
        public decimal DebitTotalAmount { get; set; }
        public DateTime DebitDueDate { get; set; }

    }
}
