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
    db.pool.query('SELECT * FROM Member', function(error, memberResults) {
        if (error) {
            console.log('Error getting data from database: ', error);
            return res.status(500);
        }

        db.pool.query('SELECT * FROM Fitness', function(error, fitnessResults) {
            if (error) {
                console.log('Error getting data from database: ', error);
                return res.status(500);
            }

            db.pool.query('SELECT * FROM Exercise', function(error, exerciseResults) {
                if (error) {
                    console.log('Error getting data from database: ', error);
                    return res.status(500);
                }

                db.pool.query('SELECT * FROM Nutrients', function(error, nutrientResults) {
                    if (error) {
                        console.log('Error getting data from database: ', error);
                        return res.status(500);
                    }

                    db.pool.query('SELECT * FROM FitnesstoExercise', function(error, fitexerResults) {
                        if (error) {
                            console.log('Error getting data from database: ', error);
                            return res.status(500);
                        }

                        const data = {
                            member: memberResults
                        };

                        res.render('index', data);
                    });
                });
            });
        });
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

            res.redirect('/');
        });
});

//add row to Fitness
app.post('/add-fitness', function(req, res) {
    const {memberID, type, time } = req.body;
  
    db.pool.query(
      'INSERT INTO Fitness (MemberID, Type, Time) VALUES (?, ?, ?)',
      [parseInt(memberID), type, parseInt(time)],
      function(error) {
        if (error) {
          console.error('Error inserting fitness data into the database:', error);
          return res.status(500).send('Internal Server Error');
        }
  
        res.redirect('/');
      });
});

//add row to Exercise
app.post('/add-exercise', function(req, res) {
    const {name, sets, reps, weight} = req.body;
  
    db.pool.query('INSERT INTO Exercise (Name, Sets, Repetitions, Weight) VALUES (?, ?, ?, ?)', 
        [exerciseName, parseInt(sets), parseInt(reps), parseInt(weight)], function(error) {
      if (error) {
        console.error('Error inserting exercise data into the database:', error);
        return res.status(500).send('Internal Server Error');
      }
  
      res.redirect('/');
    });
});

//add row to Nutrients
app.post('/add-nutrients', function(req, res) {
    const {type, count, memberID} = req.body;
  
    db.pool.query('INSERT INTO Nutrients (Type, NutrientCount, MemberID) VALUES (?, ?, ?)', 
        [type, parseInt(count), parseInt(memberID)], function(error) {
      if (error) {
        console.error('Error inserting nutrient data into the database:', error);
        return res.status(500).send('Internal Server Error');
      }
  
      res.redirect('/');
    });
});

//add row to FitnesstoExercise
app.post('/add-fitnesstoexercise', function(req, res) {
    const { fitnessID, exerciseID } = req.body;
  
    db.pool.query(
      'INSERT INTO FitnesstoExercise (FitnessID, ExerciseID) VALUES (?, ?, ?)',
      [parseInt(fitnessID), parseInt(exerciseID)],
      function(error) {
        if (error) {
          console.error('Error inserting fitness-to-exercise data into the database:', error);
          return res.status(500).send('Internal Server Error');
        }
  
        res.redirect('/');
      });
});

//update Member
app.post('/update-member', function(req, res) {
    const {memberID, email, height, weight, age} = req.body;

    db.pool.query('UPDATE Member SET Email = ?, Height = ?, Weight = ?, Age = ? WHERE MemberID = ?',
        [email, parseInt(height), parseInt(weight), parseInt(age), parseInt(memberID)], function(error) {
            if (error) {
                console.log('Error updating data to database: ', error);
                return res.status(500);
            }

            res.redirect('/');
        });
});

//update Nutrients
app.post('/update-nutrients', function(req, res) {
    const {nutrientID, type, nutrientCount, memberID} = req.body;

    db.pool.query('UPDATE Nutrients SET Type = ?, NutrientCount = ?, MemberID = ? WHERE NutrientID = ?', 
        [type, parseInt(nutrientCount), parseInt(memberID), parseInt(nutrientID)], function(error) {
            if (error) {
                console.log('Error updating database: ', error);
                return res.status(500);
            }

            res.redirect('/');
        });
});

//update FitnesstoExercise
app.post('/update-fit-to-exc', function(req, res) {
    const {oldworkoutID, oldexerciseID, newworkoutID, newexerciseID} = req.body;

    db.pool.query('UPDATE FitnesstoExercise SET WorkoutID = ?, ExerciseID = ? WHERE WorkoutID = ? AND ExerciseID = ?', 
        [parseInt(newworkoutID), parseInt(newexerciseID), parseInt(oldworkoutID), parseInt(oldexerciseID)], function(error) {
            if (error) {
                console.log('Error updating database: ', error);
                return res.status(500);
            }

            res.redirect('/');
        });
});

//delete a Member
app.post('/delete-member', function(req, res) {
    const {memberID} = req.body;

    db.pool.query('DELETE FROM Member WHERE MemberID = ?', [parseInt(memberID)], function(error) {
        if (error) {
            console.log('Error deleting from databse: ', error);
            return res.status(500);
        }

        res.redirect('/');
    });
});

//delete row from Nutrients
app.post('/delete-nutrients', function(req, res) {
    const {nutrientID} = req.body;

    db.pool.query('DELETE FROM Nutrients WHERE NutrientID = ?', [parseInt(nutrientID)], function(error) {
        if (error) {
            console.log('Error deleting from database: ', error);
            return res.status(500);
        }

        res.redirect('/');
    });
});

//delete row from FitnesstoExercise
app.post('/delete-fit-to-exc', function(req, res) {
    const {workoutID, exerciseID} = req.body;

    db.pool.query('DELETE FROM FitnesstoExercise WHERE WorkoutID = ? AND ExerciseID = ?', [parseInt(workoutID), parseInt(exerciseID)], function(error) {
        if (error) {
            console.log('Error deleting data from database: ', error);
            return res.status(500);
        }

        res.redirect('/');
    });
});

/*
 * LISTENER
 */

app.listen(PORT, function() {
	console.log('Express started on http://localhost:' + PORT + '; press Ctrl+C to terminate.');
});
