using Microsoft.EntityFrameworkCore;
using webapi.Models.BudgetItemObjects;
using webapi.Models.BudgetObjects;
using webapi.Models.DirectDebitObjects;

namespace webapi.Models
{
    public class UserContext : DbContext 
    {

        public UserContext(DbContextOptions<UserContext> options)
                : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<BudgetItem> BudgetItems { get; set; }
        public DbSet<DirectDebit> DirectDebits { get; set; }
    }
}
