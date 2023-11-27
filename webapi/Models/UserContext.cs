using Microsoft.EntityFrameworkCore;
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
    }
}
