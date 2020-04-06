export class Station {
	Port: string;
	Id: number;
	TournamentId: any;
}

export class Boat {
	Name: string;
	Length: number;
	PercentCheckedIn: number;
	Id: number;
	TournamentId: any;
}

export class Member {
	Name: string;
	Age: any;
	IsCaptain: boolean;
	IsJunior: boolean;
	CheckedIn: boolean;
	Id: number;
	BoatId: number;
	TournamentId: any;
}

export class Group {
	Boat: Boat;
	Members: Array<Member>;
}

export class Tournament {
	StartDate: string;
	EndDate: string;
	Name: string;
	Location: string;
	Id: any;
}

export class Time{
	Hours: number;
	Minutes: number;
}


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
	FinClip: string;
	FinsClipped: string;
	StationNumber: number;
	MemberId: number;
	TournamentId: any;
	BoatId: number;
	Id: any;

	//Names
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

	public static finClips = [
    "Unspecified",
		"AD",
		"AN",
		"D",
		"LP",
		"LM",
		"LV",
		"RP",
		"RV",
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
    "Other": 200,
	};

	//in
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

export class User {
	Id: any;
	Username: string;
	Password: string;
	FirstName: string;
	LastName: string;
	Token: string;
	AccessLevel: number;
}
