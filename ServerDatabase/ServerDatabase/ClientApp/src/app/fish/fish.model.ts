export class Fishes {
    public static maxWeights = {
        "Chinook Salmon": 130,
        "Coho Salmon": 40,
        "Atlantic Salmon": 110,
        "Brown Trout": 60,
        "Lake Trout": 110,
        "Steelhead": 40,
        "Yellow Perch": 10,
        "Walleye": 35,
        "Sauger": 20, 
    }

    public static maxLengths = {
        "Chinook Salmon": 60,
        "Coho Salmon": 50,
        "Atlantic Salmon": 70,
        "Brown Trout": 60,
        "Lake Trout": 60,
        "Steelhead": 50,
        "Yellow Perch": 15,
        "Walleye": 50,
        "Sauger": 40, 
    }

}

export class Fish {
    Weight: number;
    Length: number;
    Species: string;
    Image: string;
    Date: string;
    TagID: any;
}
