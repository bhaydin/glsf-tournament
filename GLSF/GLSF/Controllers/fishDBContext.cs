using Microsoft.EntityFrameworkCore;

namespace GLSF.Controllers
{
	public class fishDBContext : DbContext
	{
		public fishDBContext(DbContextOptions<fishDBContext> options):base(options){

		}
		public DbSet<Fish> Fishes { get; set; }

	}
}
