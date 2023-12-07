using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace webapi.Models.DirectDebitObjects
{
    public class CreateDirectDebit
    {
        public string BudgetId { get; set; }
        public string DebitName { get; set; }
        public decimal DebitAmount { get; set; }
        public DateTime DebitDate { get; set; }
        public int Frequency { get; set; }
    }
}
