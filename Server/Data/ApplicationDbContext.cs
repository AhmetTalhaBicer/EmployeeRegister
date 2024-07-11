using ImageApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ImageApp.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
        {
            
        }
        public DbSet<EmployeeModel> Employees { get; set; }
    }
}
