use FishDB;

drop table if exists Fish;
create table Fish(
	Weight float not null,
	Length float not null,
	Species varchar(30) not null,
	Image nvarchar(max) null,
	Date varchar(11) not null,
	SampleNumber int null,
	HasTag bit not null,
	Location nvarchar(300) null,
	StationNumber int not null,
	isValid bit not null,
	TournamentId int not null,
	BoatId int not null,
	Id int not null identity primary key,
);

drop table if exists Tournament;

create table Tournament(
	StartDate varchar(11) not null,
	EndDate varchar(11) not null,
	Name varchar(300) not null,
	Location varchar(300) not null,
	Id int not null primary key,
);

drop table if exists BoatGroup;
create table BoatGroup(
	Name varchar(300) not null,
	AgeGroup varchar(50) not null,
	Id int not null,
	TournamentId int not null,
	constraint PK_BoatId primary key (Id, TournamentId),

);
alter table Fish add constraint FK_BoatId foreign key (BoatId, TournamentId) references BoatGroup (Id, TournamentId);
alter table BoatGroup add constraint FK_Boat_TournamentId foreign key (TournamentId) references Tournament(Id);
