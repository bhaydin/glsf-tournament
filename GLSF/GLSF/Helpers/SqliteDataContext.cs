using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace GLSF.Helpers
{
    public class SqliteDataContext : DataContext
    {
        public SqliteDataContext(IConfiguration configuration) : base(configuration) { }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to sqlite database
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")); // TODO: Verify prod is different
        }
    }
}