use FishDB;

drop table Fishes;
drop table Members;
drop table Stations;
drop table Boats;
drop table Tournaments;

drop table if exists Fishes;
create table Fishes(
	Weight float not null,
	Length float not null,
	Species varchar(30) not null,
	Image nvarchar(max) null,
	Date varchar(25) not null,
	SampleNumber nvarchar(300) null,
	HasTag bit not null,
	Port nvarchar(300) null,
	IsValid bit not null,
	NoClips bit not null,
	FinsClipped nvarchar(30) null,
	StationNumber int not null,
	MemberId int not null,
	TournamentId UNIQUEIDENTIFIER not null,
	BoatId int not null,
	Id UNIQUEIDENTIFIER PRIMARY KEY,
);

drop table if exists Tournaments;
create table Tournaments(
	StartDate varchar(25) not null,
	EndDate varchar(25) not null,
	Name varchar(300) not null,
	Location varchar(300) not null,
	Id UNIQUEIDENTIFIER PRIMARY KEY,
);

drop table if exists Boats;
create table Boats(
	Name varchar(300) not null,
	Length float not null,
	CheckedIn bit not null,
	Id int not null,
	TournamentId UNIQUEIDENTIFIER not null,
	constraint PK_BoatId primary key (Id, TournamentId),
);

drop table if exists Stations;
create table Stations(
	Port varchar(300) not null,
	Id int not null,
	TournamentId UNIQUEIDENTIFIER not null,
	constraint PK_StationsId primary key (Id, TournamentId),
);

drop table if exists Users;
create table Users(
	Id UNIQUEIDENTIFIER not null primary key,
	FirstName varchar(300) not null,
	LastName varchar(300) not null,
	PasswordHash binary(64) not null,
	Username varchar(300) not null,
	AccessLevel int not null,
	Email varchar(300) not null,
	PhoneNumber varchar(30) not null,
);

drop table if exists Members;
create table Members(
	Name varchar(300) not null,
	Age int not null,
	IsCaptain bit not null,
	IsJunior bit not null,
	Id int not null,
	BoatId int not null,
	TournamentId UNIQUEIDENTIFIER not null,
	constraint PK_MembersId primary key (Id, TournamentId, BoatId),
);

alter table Members add constraint FK_Member_TournamentId foreign key (TournamentId) references Tournaments(Id);
alter table Members add constraint FK_Member_BoatId foreign key (BoatId, TournamentId) references Boats(Id, TournamentId);

alter table Fishes add constraint FK_Fish_MemberId foreign key (MemberId, TournamentId, BoatId) references Members(Id, TournamentId, BoatId)
alter table Fishes add constraint FK_Fish_StationId foreign key (StationNumber, TournamentId) references Stations (Id, TournamentId);
alter table Fishes add constraint FK_Fish_BoatId foreign key (BoatId, TournamentId) references Boats (Id, TournamentId);
alter table Fishes add constraint FK_Fish_TournamentId foreign key (TournamentId) references Tournaments (Id);

alter table Boats add constraint FK_Boat_TournamentId foreign key (TournamentId) references Tournaments(Id);

alter table Stations add constraint FK_Station_TournamentId foreign key (TournamentId) references Tournaments(Id);

