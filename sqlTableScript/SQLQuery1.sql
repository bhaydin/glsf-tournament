use FishDB;

drop table if exists Fishes;
create table Fishes(
	Weight float not null,
	Length float not null,
	Species varchar(30) not null,
	Image nvarchar(max) null,
	Date varchar(11) not null,
	SampleNumber int null,
	HasTag bit not null,
	port nvarchar(300) null,
	isValid bit not null,
	StationNumber int not null,
	TournamentId int not null,
	BoatId int not null,
	Id int not null identity primary key,
);

drop table if exists Tournaments;

create table Tournaments(
	StartDate varchar(11) not null,
	EndDate varchar(11) not null,
	Name varchar(300) not null,
	Location varchar(300) not null,
	Id int not null primary key,
);

drop table if exists Boats;
create table Boats(
	Name varchar(300) not null,
	Members varchar(500) not null,
	Length float not null,
	Id int not null,
	TournamentId int not null,
	constraint PK_BoatId primary key (Id, TournamentId),
);

drop table if exists Stations;
create table Stations(
	Port varchar(300) not null,
	Id int not null,
	TournamentId int not null,
	constraint PK_StationsId primary key (Id, TournamentId),
);
alter table Fishes add constraint FK_StationId foreign key (StationNumber, TournamentId) references Stations (Id, TournamentId);
alter table Fishes add constraint FK_BoatId foreign key (BoatId, TournamentId) references Boats (Id, TournamentId);
alter table Boats add constraint FK_Boat_TournamentId foreign key (TournamentId) references Tournaments(Id);
alter table Stations add constraint FK_Station_TournamentId foreign key (TournamentId) references Tournaments(Id);

