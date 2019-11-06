using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace GLSF.Controllers
{
	public class Fish
	{
		[DataMember]
		public double Weight { set; get; }
		[DataMember]
		public double Length { set; get; }
		[DataMember]
		public string Species { set; get; }
		[DataMember]
		public string? Image { set; get; }
		[DataMember]
		public string Date { set; get; }
		[Key]
		[DataMember]
		public int? SampleNumber { set; get; }
		[DataMember]
		public bool HasTag { set; get; }
		[DataMember]
		public string? Location { set; get; }
		[DataMember]
		public int StationNumber { set; get; }
	}
}
