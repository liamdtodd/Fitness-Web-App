/* CS 340 Project - Liam Todd and Aaron Ducote */

/*
 * SETUP
 */

var express = require('express');
var exphbs = require('express-handlebars');
var mysql = require('mysql2');
PORT = 5743;

var app = express();

const { engine } = require('express-handlebars');
app.engine('hbs', engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views')

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

var db = require('./database/db-connector')


/* 
 * ROUTES
 */

// GET ROUTES
app.get('/', function(req, res) {
    res.render('index', {});
});


app.get('/member', function (req, res) {
    db.pool.query('SELECT * FROM Member', function (error, memberResults) {
        if (error) {
            console.log('Error getting data from database: ', error);
            return res.status(500);
        }

        const data = {
            member: memberResults
        };

        res.render('member', data);
    });
});


app.get('/fit-to-exc', function (req, res) {
    db.pool.query('SELECT * FROM FitnesstoExercise', function (error, fitexerResults) {
        if (error) {
            console.log('Error getting data from database: ', error);
            return res.status(500);
        }

        db.pool.query('SELECT * FROM Exercise', function (error, exerciseResults) {
            if (error) {
                console.log('Error getting data from database: ', error);
                return res.status(500);
            }

            const data = {
                fittoexc: fitexerResults,
                exercise: exerciseResults
            };

            res.render('fit-to-exc', data);
        });
    });
});

app.get('/nutrients', function (req, res) {
    db.pool.query('SELECT * FROM Nutrients', function (error, nutrientsResults) {
        if (error) {
            console.log('Error getting data from database: ', error);
            return res.status(500);
        }

        db.pool.query('SELECT * FROM Member', function(error, memberResults) {
            if (error) {
                console.log('Error gettings data from database: ', error);
                return res.status(500);
            }

            const data = {
                nutrients: nutrientsResults,
                member: memberResults
            };

            res.render('nutrients', data);
        });
    });
});

app.get('/exercise', function (req, res) {
    db.pool.query('SELECT * FROM Exercise', function (error, exerciseResults) {
        if (error) {
            console.log('Error getting data from database: ', error);
            return res.status(500);
        }

        const data = {
            exercise: exerciseResults
        };

        res.render('exercise', data);
    });
});

app.get('/fitness', function (req, res) {
    db.pool.query('SELECT * FROM Fitness', function (error, fitnessResults) {
        if (error) {
            console.log('Error getting data from database: ', error);
            return res.status(500);
        }

        db.pool.query('SELECT * FROM Member', function (error, memberResults) {
            if (error) {
                console.log('Error getting data from database: ', error);
                return res.status(500);
            }

            const data = {
                fitness: fitnessResults,
                member: memberResults
            };
    
            res.render('fitness', data);
        });
    });
});

// POST ROUTES

//add row to Member
app.post('/add-member', function(req, res) {
    const {inputName, inputEmail, inputHeight, inputWeight, inputAge} = req.body

    db.pool.query('INSERT INTO Member (Name, Email, Height, Weight, Age) VALUES (?, ?, ?, ?, ?)',
        [inputName, inputEmail, parseInt(inputHeight), parseInt(inputWeight), parseInt(inputAge)], function(error) {
            if (error) {
                console.log('Error inserting to database: ', error);
                return res.status(500);
            }

            res.redirect('/member');
        });
});

//add row to FitnesstoExercise
app.post('/add-fit-to-exc-ajax', function (req, res) {
    const { inputWorkoutID, inputExerciseID } = req.body;

    db.pool.query(
        'INSERT INTO FitnesstoExercise (WorkoutID, ExerciseID) VALUES (?, ?)',
        [parseInt(inputWorkoutID), parseInt(inputExerciseID)], function (error) {
            if (error) {
                console.error('Error inserting fitness-to-exercise data into the database:', error);
                return res.status(500);
            }

            res.redirect('/fit-to-exc');
        });
});

//add row to Fitness
app.post('/add-fitness', function (req, res) {
    const { inputMemberID, inputType, inputTime } = req.body;

    db.pool.query(
        'INSERT INTO Fitness (MemberID, Type, Time) VALUES (?, ?, ?)',
        [parseInt(inputMemberID), inputType, parseInt(inputTime)],
        function (error) {
            if (error) {
                console.error('Error inserting fitness data into the database:', error);
                return res.status(500).send('Internal Server Error');
            }

            res.redirect('/fitness');
        });
});

//add row to Exercise
app.post('/add-exercise-form-ajax', function (req, res) {
    const { inputName, inputSets, inputRepetitions, inputWeight } = req.body;


    db.pool.query('INSERT INTO Exercise (Name, Sets, Repetitions, Weight) VALUES (?, ?, ?, ?)',
        [inputName, parseInt(inputSets), parseInt(inputRepetitions), parseInt(inputWeight)], function (error) {
            if (error) {
                console.error('Error inserting exercise data into the database:', error);
                return res.status(500).send('Internal Server Error');
            }

            res.redirect('/exercise');
        });
});

//add row to Nutrients
app.post('/add-nutrient', function (req, res) {
    const { inputType, inputNutrientCount, inputMemberID } = req.body;

    db.pool.query('INSERT INTO Nutrients (Type, NutrientCount, MemberID) VALUES (?, ?, ?)',
        [inputType, parseInt(inputNutrientCount), parseInt(inputMemberID)], function (error) {
            if (error) {
                console.error('Error inserting nutrient data into the database:', error);
                return res.status(500).send('Internal Server Error');
            }

            res.redirect('/nutrients');
        });
});

//find data of searched Member
app.post('/search-member-ajax', function(req, res) {
    const {MemberID} = req.body;

    db.pool.query('SELECT * FROM Member', function (error, memberResults) {
        if (error) {
            console.log('Error getting data from database: ', error);
            return res.status(500);
        }

        db.pool.query('SELECT * FROM Member WHERE MemberID = ?',
            [parseInt(MemberID)], function (error, results) {
                if (error) {
                    console.log('Error adding data from database:', error);
                    return res.status(500).send('Internal Server Error');
                }


            const data = {
                member: memberResults,
                searchMember: results
            };

            res.send(data.searchMember);
        });
    });
});

//UPDATES

//update Member
app.put('/put-member-ajax', function (req, res, next) {
    let data = req.body;

    let email = data.Email;
    let memberID = parseInt(data.MemberID);
    let name = data.Name;
    let height = parseInt(data.Height);
    let weight = parseInt(data.Weight);
    let age = parseInt(data.Age);


    queryUpdateEmail = 'UPDATE Member SET Email = ? WHERE Member.MemberID = ?';
    queryUpdateName = 'UPDATE Member SET Name = ? WHERE Member.MemberID = ?';
    queryUpdateHeight = 'UPDATE Member SET Height = ? WHERE Member.MemberID = ?';
    queryUpdateWeight = 'UPDATE Member SET Weight = ? WHERE Member.MemberID = ?';
    queryUpdateAge = 'UPDATE Member SET Age = ? WHERE Member.MemberID = ?';
    selectMember = `SELECT * FROM Member WHERE Member.MemberID = ?`


    if (Number.isNaN(memberID)) {
        res.sendStatus(204)
    }

    else {
        // Run the 1st query
        if (email != "") {
            db.pool.query(queryUpdateEmail, [email, memberID], function (error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                }
            })
        }
        // Run the 2nd query
        if (name != "") {
            db.pool.query(queryUpdateName, [name, memberID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400)
                }
            })
        }
        // Run the third query
        if (height != "") {
            db.pool.query(queryUpdateHeight, [height, memberID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
            })
        }
        // Run the fourth query
        if (weight != "") {
            db.pool.query(queryUpdateWeight, [weight, memberID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400)
                }
            })
        }
        if (age != "") {
            db.pool.query(queryUpdateAge, [age, memberID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400)
                }
            })
        }
        return res.redirect("/member")
    }
});

//update fitness
app.put('/put-fitness-ajax', function (req, res, next) {
    let data = req.body;

    let Type = data.Type;
    let WorkoutID = parseInt(data.WorkoutID);
    let time = parseInt(data.Time)
    let memberID = parseInt(data.MemberID)


    queryUpdateType = 'UPDATE Fitness SET Type = ? WHERE Fitness.WorkoutID = ?';
    queryUpdateTime = 'UPDATE Fitness SET Time = ? WHERE Fitness.WorkoutID = ?';
    queryUpdateMemID = 'UPDATE Fitness SET MemberID = ? WHERE Fitness.WorkoutID = ?';
    selectWorkout = `SELECT * FROM Fitness WHERE Fitness.WorkoutID = ?`


    if (Number.isNaN(WorkoutID)) {
        res.sendStatus(204)
    }

    else {
        // Run the 1st query
        if (Type != "") {
            db.pool.query(queryUpdateType, [Type, WorkoutID], function (error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                }
            })
        }
        // Run the 2nd query
        if (time != "") {
            db.pool.query(queryUpdateTime, [time, WorkoutID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400)
                }
            })
        }
        if (memberID != "") {
            db.pool.query(queryUpdateMemID, [memberID, WorkoutID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400)
                }
            })
        }
        return res.redirect("/fitness")
    }
});



//update nutrients
app.put('/put-nutrient-ajax', function (req, res, next) {
    let data = req.body;

    let Count = parseInt(data.NutrientCount);
    let NutrientID = parseInt(data.NutrientID);
    let Type = data.Type
    let MemberID = parseInt(data.MemberID)

    queryUpdateCount = 'UPDATE Nutrients SET NutrientCount = ? WHERE Nutrients.NutrientID = ?';
    queryUpdateType = 'UPDATE Nutrients SET Type = ? WHERE Nutrients.NutrientID = ?';
    queryUpdateMemID = 'UPDATE Nutrients SET MemberID = ? WHERE Nutrients.NutrientID = ?';
    selectNutrient = `SELECT * FROM Nutrients WHERE Nutrients.NutrientID = ?`

    if (Number.isNaN(NutrientID)) {
        res.sendStatus(204)
    }

    else {
        // Run the 1st query
        if (Count != "") {
            db.pool.query(queryUpdateCount, [Count, NutrientID], function (error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                }
            })
        }
        // Run the 2nd query
        if (Type != "") {
            db.pool.query(queryUpdateType, [Type, NutrientID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400)
                }
            })
        }
        if (MemberID != "") {
            db.pool.query(queryUpdateMemID, [MemberID, NutrientID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400)
                }
            })
        }
        return res.redirect("/nutrients")
    }
});

//update fit-to-exc
app.put('/put-fit-to-exc-ajax', function (req, res, next) {
    let data = req.body;

    let WorkoutID = parseInt(data.WorkoutID);
    let ExerciseID = parseInt(data.ExerciseID);

    queryUpdateExerciseID = 'UPDATE FitnesstoExercise SET ExerciseID = ? WHERE FitnesstoExercise.WorkoutID = ?';

    selectNutrient = `SELECT * FROM Nutrients WHERE Nutrients.NutrientID = ?`


    // Run the 1st query
    db.pool.query(queryUpdateExerciseID, [ExerciseID, WorkoutID], function (error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.send(rows);
        }
    })

});

//update exercise
app.put('/put-exercise-ajax', function (req, res, next) {
    let data = req.body;

    let Sets = parseInt(data.Sets);
    let ExerciseID = parseInt(data.ExerciseID);
    let Name = data.Name;
    let Reps = data.Repetitions;
    let Weight = parseInt(data.Weight);

    queryUpdateSets = 'UPDATE Exercise SET Sets = ? WHERE Exercise.ExerciseID = ?';
    queryUpdateName = 'UPDATE Exercise SET Name = ? WHERE Exercise.ExerciseID = ?';
    queryUpdateReps = 'UPDATE Exercise SET Repetitions = ? WHERE Exercise.ExerciseID = ?';
    queryUpdateWeight = 'UPDATE Exercise SET Weight = ? WHERE Exercise.ExerciseID = ?';
    selectExercise = `SELECT * FROM Exercise WHERE Exercise.ExerciseID = ?`


    if (Number.isNaN(ExerciseID)) {
        res.sendStatus(204)
    }

    else {
        // Run the 1st query
        if (Sets != "") {
            db.pool.query(queryUpdateSets, [Sets, ExerciseID], function (error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                }
            })
        }
        // Run the 2nd query
        if (Name != "") {
            db.pool.query(queryUpdateName, [Name, ExerciseID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400)
                }
            })
        }
        if (Reps != "") {
            db.pool.query(queryUpdateReps, [Reps, ExerciseID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400)
                }
            })
        }
        if (Weight != "") {
            db.pool.query(queryUpdateWeight, [Weight, ExerciseID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400)
                }
            })
        }
        return res.redirect("/exercise")
    }
});

//DELETES

//delete Member
app.delete('/delete-member-ajax/', function (req, res, next) {
    let data = req.body;
    let MemberID = parseInt(data.id);
    let deleteMember = `DELETE FROM Member WHERE Member.MemberID = ?`;
    let deleteMember2 = `DELETE FROM bsg_people WHERE id = ?`;


    // Run the 1st query
    db.pool.query(deleteMember, [MemberID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        res.redirect('/member');
    })
});

// delete exercise
app.delete('/delete-exercise-ajax/', function (req, res, next) {
    let data = req.body;
    let ExerciseID = parseInt(data.id);
    let DeleteFitToExc = `DELETE FROM FitnesstoExercise WHERE FitnesstoExercise.ExerciseID = ?`;
    let DeleteExercise = `DELETE FROM Exercise WHERE Exercise.ExerciseID = ?`;


    // Run the 1st query
    db.pool.query(DeleteFitToExc, [ExerciseID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
    })
    db.pool.query(DeleteExercise, [ExerciseID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
    })
});

// delete nutrient
app.delete('/delete-nutrient-ajax/', function (req, res, next) {
    let data = req.body;
    let NutrientID = parseInt(data.id);
    let deleteNutrient = `DELETE FROM Nutrients WHERE Nutrients.NutrientID = ?`;
    let deleteMember2 = `DELETE FROM bsg_people WHERE id = ?`;


    // Run the 1st query
    db.pool.query(deleteNutrient, [NutrientID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        res.redirect('/nutrients');
    })
});

// delete fitness
app.delete('/delete-fitness-ajax/', function (req, res, next) {
    let data = req.body;
    let WorkoutID = parseInt(data.id);
    let DeleteFitToExc = `DELETE FROM FitnesstoExercise WHERE FitnesstoExercise.WorkoutID = ?`;
    let deleteWorkout = `DELETE FROM Fitness WHERE Fitness.WorkoutID = ?`;


    db.pool.query(DeleteFitToExc, [WorkoutID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
    })
    db.pool.query(deleteWorkout, [WorkoutID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
    })
});

// detele fit-to-exc
app.delete('/delete-fit-to-exc-ajax/', function (req, res, next) {
    let data = req.body;
    let WorkoutID = parseInt(data.id);
    let deleteFitToExc = 'DELETE FROM FitnesstoExercise WHERE FitnesstoExercise.WorkoutID = ?;'

    // Run the 1st query
    db.pool.query(deleteFitToExc, [WorkoutID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
    })
});
/*
 * LISTENER
 */

app.listen(PORT, function() {
	console.log('Express started on http://localhost:' + PORT + '; press Ctrl+C to terminate.');
});