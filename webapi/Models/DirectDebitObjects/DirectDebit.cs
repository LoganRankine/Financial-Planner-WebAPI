using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models.DirectDebitObjects
{
    public class DirectDebit
    {
        [Key]
        public string DebitId { get; set; }
        [ForeignKey("Budget")]
        public string BudgetId { get; set; }
        public string DebitName { get; set; }
        [Column(TypeName = "decimal(19,4)")]
        public decimal DebitAmount { get; set; }
        [Column(TypeName = "decimal(19,4)")]
        public decimal DebitTotalAmount { get; set; }
        public DateTime DebitDate { get; set; }
        public int Frequency { get; set; }
        public DateTime DebitDueDate { get; set; }
    }
}
