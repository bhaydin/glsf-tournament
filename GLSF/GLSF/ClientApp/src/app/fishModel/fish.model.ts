export class Fish {
  //Names
	public static fishes = [
		"Chinook Salmon",
		"Coho Salmon",
		"Atlantic Salmon",
		"Brown Trout",
		"Lake Trout",
		"Rainbow Trout",
		"Yellow Perch",
		"Walleye",
		"Sauger",
	];

  //Lbs
	public static maxWeights = {
		"Chinook Salmon": 130,
		"Coho Salmon": 40,
		"Atlantic Salmon": 110,
		"Brown Trout": 60,
		"Lake Trout": 110,
		"Rainbow Trout": 40,
		"Yellow Perch": 10,
		"Walleye": 35,
		"Sauger": 20,
	};

    //mm
	public static maxLengths = {
		"Chinook Salmon": 60,
		"Coho Salmon": 50,
		"Atlantic Salmon": 70,
		"Brown Trout": 60,
		"Lake Trout": 60,
		"Rainbow Trout": 50,
		"Yellow Perch": 15,
		"Walleye": 50,
		"Sauger": 40,
	};

  Weight: number;
  Length: number;
  Species: string;
  Image: any;
  Date: string;
  SampleNumber: any;
  HasTag: boolean;
  Location: any;
  StationNumber: number;
}
