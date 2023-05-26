---------------------------- 
-- SELECT Queries
---------------------------- 
select name as "Member Name", MemberID from Member;

select Member.name as "Member Name", Fitness.Type as "Workout Type" from Fitness
inner join Member on Member.MemberID = Fitness.MemberID;

select Member.name as "Member Name", Nutrients.Type as "Macro:", Nutrients.NutrientCount from Nutrients 
inner join Member on Member.MemberID = Nutrients.MemberID;

---------------------------- 
-- INSERT Queries
---------------------------- 
insert into Member(Name, Email, Height, Weight, Age)
values (:nameInput, :emailInput, :heightInput, :weightInput, :ageInput);

insert into Fitness(Type, MemberID)
values (:typeInput, (select MemberID from Member where MemberID = :memberIDInput));

insert into Nutrients(Type, NutrientCount, MemberID)
values (:typeInput, :countInput, (select MemberID from Member where MemberID = :memberIDInput));

insert into Exercise(Name, Sets, Repetitions, Weight)
values (:nameInput, :setsInput, :repsInput, :weightInput);

insert into FitnesstoExercise(WorkoutID, ExerciseID)
values ((select WorkoutID from Fitness where WorkoutID = :inputWorkoutID), (select ExerciseID from Exercise where ExerciseID = :inputExerciseID));

----------------------------- 
-- UPDATE Queries
-----------------------------
update Member set Name = :nameInput, Email = :emailInput, Height = :heightInput, Weight = :weightInput, Age = :ageInput where MemberID = :updateMemberID;

-----------------------------
-- DELETE Queries
----------------------------- 
delete from Member where MemberID = :deleteMemberID;

delete from Exercise where ExerciseID = :deleteExerciseID;

delete from Fitness where WorkoutID = :deleteWorkoutID;