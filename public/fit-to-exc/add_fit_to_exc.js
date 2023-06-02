// Get the objects we need to modify
let addFitToExcForm = document.getElementById('add-fit-to-exc-form-ajax');

// Modify the objects we need
addFitToExcForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputWorkoutID = document.getElementById("input-WorkoutID");
    let inputExerciseID = document.getElementById("input-ExerciseID");

    // Get the values from the form fields
    let WorkoutIDValue = inputWorkoutID.value;
    let ExerciseIDValue = inputExerciseID.value;

    // Put our data we want to send in a javascript object
    let data = {
        WorkoutID: WorkoutIDValue,
        ExerciseID: ExerciseIDValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-fit-to-exc-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputWorkoutID.value = '';
            inputExerciseID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("fit-to-exc-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let WorkoutIDCell = document.createElement("TD");
    let ExerciseIDCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    WorkoutIDCell.innerText = newRow.Name;
    ExerciseIDCell.innerText = newRow.Email;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(WorkoutIDCell);
    row.appendChild(ExerciseIDCell);

    // Add the row to the table
    currentTable.appendChild(row);
}



// Get the objects we need to modify
let addFitToExcForm = document.getElementById('add-fit-to-exc-form-ajax');

// Modify the objects we need
addMemberForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputWorkoutID = document.getElementById("input-WorkoutID");
    let inputExerciseID = document.getElementById("input-ExerciseID");

    // Get the values from the form fields
    let WorkoutIDValue = inputWorkoutID.value;
    let ExerciseIDValue = inputExerciseID.value;

    // Put our data we want to send in a javascript object
    let data = {
        WorkoutID: WorkoutIDValue,
        ExerciseID: ExerciseIDValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-fit-to-exc-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputWorkoutID.value = '';
            inputExerciseID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("fit-to-exc-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let WoroutIDCell = document.createElement("TD");
    let ExerciseIDCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    WorkoutIDCell.innerText = newRow.WorkoutID;
    ExerciseIDCell.innerText = newRow.ExerciseID;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(WorkoutIDCell);
    row.appendChild(ExerciseIDCell);

    // Add the row to the table
    currentTable.appendChild(row);
}
