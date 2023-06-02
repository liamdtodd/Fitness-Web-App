// Get the objects we need to modify
let addMemberForm = document.getElementById('add-member-form-ajax');

// Modify the objects we need
addMemberForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-Name");
    let inputEmail = document.getElementById("input-Email");
    let inputHeight = document.getElementById("input-Height");
    let inputWeight = document.getElementById("input-Weight");
    let inputAge = document.getElementById("input-Age");

    // Get the values from the form fields
    let NameValue = inputName.value;
    let EmailValue = inputEmail.value;
    let HeightValue = inputHeight.value;
    let WeightValue = inputWeight.value;
    let AgeValue = inputAge.value;

    // Put our data we want to send in a javascript object
    let data = {
        Name: NameValue,
        Email: EmailValue,
        Height: HeightValue,
        Weight: WeightValue,
        Age: AgeValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-member-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputEmail.value = '';
            inputHeight.value = '';
            inputWeight.value = '';
            inputAge.value = '';
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
    let currentTable = document.getElementById("member-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let NameCell = document.createElement("TD");
    let EmailCell = document.createElement("TD");
    let HeightCell = document.createElement("TD");
    let WeightCell = document.createElement("TD");
    let AgeCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.id;
    NameCell.innerText = newRow.Name;
    EmailCell.innerText = newRow.Email;
    HeightCell.innerText = newRow.Height;
    WeightCell.innerText = newRow.Weight;
    AgeCell.innerText = newRow.Age;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(NameCell);
    row.appendChild(EmailCell);
    row.appendChild(HeightCell);
    row.appendChild(WeightCell);
    row.appendChild(AgeCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
