// Get the objects we need to modify
let addExerciseForm = document.getElementById('add-exercise-form-ajax');

// Modify the objects we need
addExerciseForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-Name");
    let inputSets = document.getElementById("input-Sets");
    let inputReps = document.getElementById("input-Repetitions");
    let inputWeight = document.getElementById("input-Weight");

    // Get the values from the form fields
    let NameValue = inputName.value;
    let SetsValue = inputSets.value;
    let RepsValue = inputReps.value;
    let WeightValue = inputWeight.value;

    // Put our data we want to send in a javascript object
    let data = {
        Name: NameValue,
        Sets: SetsValue,
        Repetitions: RepsValue,
        Weight: WeightValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-exercise-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputSets.value = '';
            inputReps.value = '';
            inputWeight.value = '';
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
    let currentTable = document.getElementById("exercise-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let NameCell = document.createElement("TD");
    let SetsCell = document.createElement("TD");
    let RepsCell = document.createElement("TD");
    let WeightCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    NameCell.innerText = newRow.Name;
    SetsCell.innerText = newRow.Sets;
    RepsCell.innerText = newRow.Repetitions;
    WeightCell.innerText = newRow.Weight;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(NameCell);
    row.appendChild(SetsCell);
    row.appendChild(RepsCell);
    row.appendChild(WeightCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
