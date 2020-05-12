//Station class/data model for database and server
export class Station {
	Port: string;
	Id: number;
	TournamentId: any;
}

//Boat class/data model for database and server
export class Boat {
	Name: string;
	Length: number;
	CheckedIn: boolean;
	Id: number;
	TournamentId: any;
}

//Member class/data model for database and server
export class Member {
	Name: string;
	Age: any;
	IsCaptain: boolean;
	IsJunior: boolean;
	Id: number;
	BoatId: number;
	TournamentId: any;
}

//Group class/data model for server
//Used to easily send a boat and the attached members
export class Group {
	Boat: Boat;
	Members: Array<Member>;
}


//Tournament class/data model for server and database
export class Tournament {
	StartDate: string;
	EndDate: string;
	Name: string;
	Location: string;
	Id: any;
}

//Time class for tournament hour/minute entry fields
//Makes it simple to add specified time to a date
export class Time{
	Hours: number;
	Minutes: number;
}


//Fish class/data model for server and database
export class Fish {
	Weight: number;
	Length: number;
	Species: string;
	Image: any;
	Date: string;
	SampleNumber: any;
	HasTag: boolean;
	Port: string;
	IsValid: boolean;
	NoClips: boolean;
	FinsClipped: string;
	StationNumber: number;
	MemberId: number;
	TournamentId: any;
	BoatId: number;
	Id: any;

	//Names of fish in lake michigan, expand if needed
	public static fishes = [
		"Atlantic Salmon",
		"Brown Trout",
		"Chinook Salmon",
		"Coho Salmon",
		"Lake Trout",
		"Rainbow Trout",
		"Sauger",
		"Yellow Perch",
		"Walleye",
    "Other", 
	];

	//Lbs of each specified fish in a dictionary (Maxes)
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
    "Other": 200,
	};

	//Inches of each specified fish in a dictionary (Maxes)
	public static maxLengths = {
		"Chinook Salmon": 60,
		"Coho Salmon": 60,
		"Atlantic Salmon": 70,
		"Brown Trout": 60,
		"Lake Trout": 60,
		"Rainbow Trout": 60,
		"Yellow Perch": 15,
		"Walleye": 60,
		"Sauger": 40,
    "Other": 80,
    };
}

//User class/data model for database and server
export class User {
	Id: any;
	Username: string;
	Password: string;
	FirstName: string;
	LastName: string;
	Token: string;
	AccessLevel: number;
}
