drop table if exists Member;
create table Member (
    MemberID int not null AUTO_INCREMENT,
    Name varchar(50) not null,
    Email varchar(50) not null,
    Height int not null,
    Weight int not null,
    Age int not null,
    Primary Key (MemberID)
);

drop table if exists Nutrients;
create table Nutrients (
    NutrientID int not null auto_increment,
    Type varchar(50) not null,
    NutrientCount int not null,
    MemberID int not null,
    Primary Key (NutrientID),
    Foreign Key (MemberID) References Member(MemberID)
);

drop table if exists Fitness;
create table Fitness (
    WorkoutID int not null auto_increment,
    Type varchar(50) not null,
    Time int,
    MemberID int not null,
    Primary Key (WorkoutID),
    Foreign Key (MemberID) References Member(MemberID)
);

drop table if exists Exercise;
create table Exercise (
    ExerciseID int not null auto_increment,
    Name varchar(25) not null,
    Sets int not null,
    Repetitions int not null,
    Weight int,
    Primary Key (ExerciseID)
);

drop table if exists FitnesstoExercise;
create table FitnesstoExercise (
    WorkoutID int not null,
    ExerciseID int not null,
    Primary Key (WorkoutID, ExerciseID),
    Foreign Key (WorkoutID) References Fitness(WorkoutID),
    Foreign Key (ExerciseID) References Exercise(ExerciseID)
);

-- sample data shown in HTML
insert into Member(Name, Email, Height, Weight, Age)
values ("Liam", "example1@gmail.com", 71, 190, 21),
		("Daniel", "anotherone@outlook.com", 71, 200, 21),
        ("Todd", "email@yahoo.com", 71, 175, 21);
        
insert into Fitness(Type, MemberID)
values ("Chest", (select MemberID from Member where Name = "Liam")),
		("Back", (select MemberID from Member where Name = "Liam")),
        ("Legs", (select MemberID from Member where Name = "Todd"));
        
insert into Nutrients(Type, NutrientCount, MemberID)
values ("Carbohydrates", 480, (select MemberID from Member where Name = "Liam")),
		("Protein", 220, (select MemberID from Member where Name = "Liam")),
        ("Fats", 140, (select MemberID from Member where Name = "Liam"));

insert into Exercise(Name, Sets,  Repetitions, Weight)
values ("Bench Press", 3, 6, 150),
        ("Incline Press", 3, 10, 100),
        ("Pec Flys", 3, 12, 85);

insert into FitnesstoExercise(WorkoutID, ExerciseID)
values (1, 1),
        (1, 2),
        (1, 3);
