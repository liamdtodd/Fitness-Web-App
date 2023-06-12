// Get the objects we need to modify
let updateFitToExcForm = document.getElementById('update-fit-to-exc-form-ajax');

// Modify the objects we need
updateFitToExcForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputWorkoutID = document.getElementById("mySelect");
    let inputExerciseID = document.getElementById("input-ExerciseID-update");

    // Get the values from the form fields
    let WorkoutIDValue = document.querySelector('#updateSelect').value;
    let ExerciseIDValue = document.querySelector('#updateExerciseSelect').value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld



    // Put our data we want to send in a javascript object
    let data = {
        WorkoutID: WorkoutIDValue,
        ExerciseID: ExerciseIDValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-fit-to-exc-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, WorkoutIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, WorkoutID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("fit-to-exc-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == WorkoutID) {

            // Get the location of the row where we found the matching fit-to-exc ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
