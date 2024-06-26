﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using webapi.Models.BudgetItemObjects;
using webapi.Models.DirectDebitObjects;

namespace webapi.Models.BudgetObjects
{
    public class Budget
    {
        [Key]
        public string BudgetId { get; set; }

        [ForeignKey("User")]
        public string Id { get; set; }

        public string BudgetName { get; set; }

        [Column(TypeName = "decimal(19,4)")]
        public decimal AvailableAmount { get; set; }

        [Column(TypeName = "decimal(19,4)")]
        public decimal WeeklyAmount { get; set; }

        [Column(TypeName = "decimal(19,4)")]
        public decimal BudgetAmount { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public virtual List<BudgetItem> BudgetItems { get; set; }

        public virtual List<DirectDebit> DirectDebits { get; set; }

        public virtual User User { get; set; }
    }
}
