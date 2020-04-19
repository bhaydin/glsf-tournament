"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Station = /** @class */ (function () {
    function Station() {
    }
    return Station;
}());
exports.Station = Station;
var Boat = /** @class */ (function () {
    function Boat() {
    }
    return Boat;
}());
exports.Boat = Boat;
var Member = /** @class */ (function () {
    function Member() {
    }
    return Member;
}());
exports.Member = Member;
var Group = /** @class */ (function () {
    function Group() {
    }
    return Group;
}());
exports.Group = Group;
var Tournament = /** @class */ (function () {
    function Tournament() {
    }
    return Tournament;
}());
exports.Tournament = Tournament;
var Time = /** @class */ (function () {
    function Time() {
    }
    return Time;
}());
exports.Time = Time;
var Fish = /** @class */ (function () {
    function Fish() {
    }
    //Names
    Fish.fishes = [
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
    Fish.finClips = [
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
    Fish.maxWeights = {
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
    Fish.maxLengths = {
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
    return Fish;
}());
exports.Fish = Fish;
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=dataSchemas.js.map