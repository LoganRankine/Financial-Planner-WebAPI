namespace webapi.Models.DirectDebitObjects
{
    public class DirectDebitResponse
    {
        public string DebitId { get; set; }
        public string DebitName { get; set; }
        public decimal DebitAmount { get; set; }
        public DateTime DebitDate { get; set; }
        public int Frequency { get; set; }

    }
}
