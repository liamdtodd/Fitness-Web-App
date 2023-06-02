/* CS 340 Project - Liam Todd and Aaron Ducote */

/*
 * SETUP
 */

var express = require('express');
var exphbs = require('express-handlebars');
var mysql = require('mysql2');
PORT = 5742;

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

        const data = {
            fittoexc: fitexerResults
        };

        res.render('fit-to-exc', data);
    });
});

app.get('/nutrients', function (req, res) {
    db.pool.query('SELECT * FROM Nutrients', function (error, nutrientsResults) {
        if (error) {
            console.log('Error getting data from database: ', error);
            return res.status(500);
        }

        const data = {
            nutrients: nutrientsResults
        };

        res.render('nutrients', data);
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

        const data = {
            fitness: fitnessResults
        };

        res.render('fitness', data);
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
    const { WorkoutID, ExerciseID } = req.body;

    console.log(WorkoutID)
    console.log(ExerciseID)
    db.pool.query(
        'INSERT INTO FitnesstoExercise (WorkoutID, ExerciseID) VALUES (?, ?)',
        [parseInt(WorkoutID), parseInt(ExerciseID)], function (error) {
            if (error) {
                console.error('Error inserting fitness-to-exercise data into the database:', error);
                return res.status(500);
            }

            res.redirect('/fit-to-exc');
        });
});

//add row to Fitness
app.post('/add-fitness', function (req, res) {
    const { memberID, type, time } = req.body;

    db.pool.query(
        'INSERT INTO Fitness (MemberID, Type, Time) VALUES (?, ?, ?)',
        [parseInt(memberID), type, parseInt(time)],
        function (error) {
            if (error) {
                console.error('Error inserting fitness data into the database:', error);
                return res.status(500).send('Internal Server Error');
            }

            res.redirect('/');
        });
});

//add row to Exercise
app.post('/add-exercise', function (req, res) {
    const { name, sets, reps, weight } = req.body;

    db.pool.query('INSERT INTO Exercise (Name, Sets, Repetitions, Weight) VALUES (?, ?, ?, ?)',
        [name, parseInt(sets), parseInt(reps), parseInt(weight)], function (error) {
            if (error) {
                console.error('Error inserting exercise data into the database:', error);
                return res.status(500).send('Internal Server Error');
            }

            res.redirect('/');
        });
});

//add row to Nutrients
app.post('/add-nutrient', function (req, res) {
    const { type, count, memberID } = req.body;

    db.pool.query('INSERT INTO Nutrients (Type, NutrientCount, MemberID) VALUES (?, ?, ?)',
        [type, parseInt(count), parseInt(memberID)], function (error) {
            if (error) {
                console.error('Error inserting nutrient data into the database:', error);
                return res.status(500).send('Internal Server Error');
            }

            res.redirect('/');
        });
});

//UPDATES

//update Member
app.put('/put-member-ajax', function (req, res, next) {
    let data = req.body;

    let email = data.Email;
    let memberID = parseInt(data.MemberID);

    queryUpdateEmail = 'UPDATE Member SET Email = ? WHERE Member.MemberID = ?';
    selectMember = `SELECT * FROM Member WHERE Member.MemberID = ?`


    // Run the 1st query
    db.pool.query(queryUpdateEmail, [email, memberID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectMember, [memberID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

//update fitness
app.put('/put-fitness-ajax', function (req, res, next) {
    let data = req.body;

    let Type = data.Type;
    let WorkoutID = parseInt(data.WorkoutID);

    queryUpdateType = 'UPDATE Fitness SET Type = ? WHERE Fitness.WorkoutID = ?';
    selectWorkout = `SELECT * FROM Fitness WHERE Fitness.WorkoutID = ?`


    // Run the 1st query
    db.pool.query(queryUpdateType, [Type, WorkoutID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectWorkout, [WorkoutID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});



//update nutrients
app.put('/put-nutrient-ajax', function (req, res, next) {
    let data = req.body;

    let Count = parseInt(data.NutrientCount);
    let NutrientID = parseInt(data.NutrientID);

    queryUpdateCount = 'UPDATE Nutrients SET NutrientCount = ? WHERE Nutrients.NutrientID = ?';
    selectNutrient = `SELECT * FROM Nutrients WHERE Nutrients.NutrientID = ?`


    // Run the 1st query
    db.pool.query(queryUpdateCount, [Count, NutrientID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectNutrient, [NutrientID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

//update fit-to-exc
app.put('/put-fit-to-exc-ajax', function (req, res, next) {
    let data = req.body;

    let WorkoutID = data.WorkoutID;
    let ExerciseID = parseInt(data.ExerciseID);

    queryUpdateWorkoutID = 'UPDATE Fitness SET WorkoutID = ? WHERE Fitness.WorkoutID = ?';
    queryUpdateExerciseID = 'UPDATE Exercise SET ExerciseID = ? WHERE Exercise.ExerciseID = ?'
    // queryUpdateType = 'UPDATE Nutrients SET Type = ? WHERE Nutrients.NutrientID = ?';
    selectNutrient = `SELECT * FROM Nutrients WHERE Nutrients.NutrientID = ?`


    // Run the 1st query
    db.pool.query(queryUpdateWorkoutID, [WorkoutID, ExerciseID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(queryUpdateExerciseID, [ExerciseID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

//update exercise
app.put('/put-exercise-ajax', function (req, res, next) {
    let data = req.body;

    let Sets = parseInt(data.Sets);
    let ExerciseID = parseInt(data.ExerciseID);

    queryUpdateSets = 'UPDATE Exercise SET Sets = ? WHERE Exercise.ExerciseID = ?';
    selectExercise = `SELECT * FROM Exercise WHERE Exercise.ExerciseID = ?`


    // Run the 1st query
    db.pool.query(queryUpdateSets, [Sets, ExerciseID], function (error, rows, fields) {
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else {
            // Run the second query
            db.pool.query(selectExercise, [ExerciseID], function (error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
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
    })
});

// delete exercise
app.delete('/delete-exercise-ajax/', function (req, res, next) {
    let data = req.body;
    let ExerciseID = parseInt(data.id);
    let DeleteExercise = `DELETE FROM Exercise WHERE Exercise.ExerciseID = ?`;
    let deleteMember2 = `DELETE FROM bsg_people WHERE id = ?`;


    // Run the 1st query
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
    })
});

// delete fitness
app.delete('/delete-fitness-ajax/', function (req, res, next) {
    let data = req.body;
    let WorkoutID = parseInt(data.id);
    let deleteWorkout = `DELETE FROM Fitness WHERE Fitness.WorkoutID = ?`;
    let deleteMember2 = `DELETE FROM bsg_people WHERE id = ?`;


    // Run the 1st query
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
    let deleteFitToExc = `DELETE FROM FitnesstoExercise WHERE FitnesstoExercise.WorkoutID = ?`;
    let deleteMember2 = `DELETE FROM bsg_people WHERE id = ?`;


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