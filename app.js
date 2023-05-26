/* CS 340 Project - Liam Todd and Aaron Ducote */

/*
 * SETUP
 */

var express = require('express');
var exphbs = require('express-handlebars');
var mysql = require('mysql2');
PORT = 5742;

var app = express();
<<<<<<< HEAD
const { engine } = require('express-handlebars');
app.engine('hbs', engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views')

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
=======
>>>>>>> cbb1bd1a81daa5c0726446b6dbee75a2d893b03e

const pool = mysql.createPool({
    host: 'localhost',
    user: 'toddl',
    password: 'RockSaltAndNails5',
    database: 'cs340_toddl',
    connectionLimit: 10
})

<<<<<<< HEAD
var db = require('./database/db-connector')

=======
const { engine } = require('express-handlebars');
app.engine('hbs', engine({extname: '.hbs'}));
app.set('view engine', 'hbs');
>>>>>>> cbb1bd1a81daa5c0726446b6dbee75a2d893b03e

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
                            member: memberResults,
                            fitness: fitnessResults,
                            exercise: exerciseResults,
                            nutrients: nutrientResults,
                            fitnesstoExercise: fitexerResults
                        };

                        res.render('main', data);
                    });
                });
            });
        });
    });
});

// POST ROUTES

app.post('/add-member', function(req, res) {
    const {inputName, inputEmail, inputHeight, inputWeight, inputAge} = req.body

    pool.query('INSERT INTO Member (Name, Email, Height, Weight, Age) VALUES (?, ?, ?, ?, ?',
        [inputName, inputEmail, parseInt(inputHeight), parseInt(inputWeight), parseInt(inputAge)], function(error) {
            if (error) {
                console.log('Error inserting to database: ', error);
                return res.status(500);
            }

            res.redirect('/');
        });
});

app.post('/add-fitness', (req, res) => {
    const { memberID, date, weight, caloriesBurned } = req.body;
  
    db.pool.query(
      'INSERT INTO Fitness (MemberID, Date, Weight, CaloriesBurned) VALUES (?, ?, ?, ?)',
      [parseInt(memberID), date, parseInt(weight), parseInt(caloriesBurned)],
      function(error) {
        if (error) {
          console.error('Error inserting fitness data into the database:', error);
          return res.status(500).send('Internal Server Error');
        }
  
        res.redirect('/');
      });
});

app.post('/add-exercise', (req, res) => {
    const { exerciseName } = req.body;
  
    db.pool.query('INSERT INTO Exercise (Name) VALUES (?)', [exerciseName], function(error) {
      if (error) {
        console.error('Error inserting exercise data into the database:', error);
        return res.status(500).send('Internal Server Error');
      }
  
      res.redirect('/');
    });
});

app.post('/add-nutrient', (req, res) => {
    const { nutrientName } = req.body;
  
    db.pool.query('INSERT INTO Nutrients (Name) VALUES (?)', [nutrientName], function(error) {
      if (error) {
        console.error('Error inserting nutrient data into the database:', error);
        return res.status(500).send('Internal Server Error');
      }
  
      res.redirect('/');
    });
});

app.post('/add-fitnesstoexercise', (req, res) => {
    const { fitnessID, exerciseID, duration } = req.body;
  
    db.pool.query(
      'INSERT INTO FitnesstoExercise (FitnessID, ExerciseID, Duration) VALUES (?, ?, ?)',
      [parseInt(fitnessID), parseInt(exerciseID), parseInt(duration)],
      function(error) {
        if (error) {
          console.error('Error inserting fitness-to-exercise data into the database:', error);
          return res.status(500).send('Internal Server Error');
        }
  
        res.redirect('/');
      });
});

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

/*
 * LISTENER
 */

app.listen(PORT, function() {
	console.log('Express started on http://localhost:' + PORT + '; press Ctrl+C to terminate.');
});
