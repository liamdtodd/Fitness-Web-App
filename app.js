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

//add row to FitnesstoExercise
app.post('/add-fit-to-exc', function (req, res) {
    const { fitnessID, exerciseID } = req.body;

    db.pool.query(
        'INSERT INTO FitnesstoExercise (FitnessID, ExerciseID) VALUES (?, ?)',
        [parseInt(fitnessID), parseInt(exerciseID)], function (error) {
            if (error) {
                console.error('Error inserting fitness-to-exercise data into the database:', error);
                return res.status(500);
            }

            res.redirect('/fit-to-exc');
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

/*
 * LISTENER
 */

app.listen(PORT, function() {
	console.log('Express started on http://localhost:' + PORT + '; press Ctrl+C to terminate.');
});