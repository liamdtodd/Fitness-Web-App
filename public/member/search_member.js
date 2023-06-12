let searchMemberData = document.querySelector('#search-member-ajax');

searchMemberData.addEventListener('submit', function(error) {
    error.preventDefault();

    let MemberIDValue = document.querySelector('#propertySelect').value;

    let data = {
        MemberID: MemberIDValue
    }

    //AJAX req
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/search-member-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            let searchResults = JSON.parse(xhttp.responseText);
            addRowToTable(searchResults);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

function addRowToTable(searchResults) {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("search-table");

    // Get the location where we should insert the new row (end of table)
    //let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
   // let parsedData = JSON.parse(data);
    //let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    searchResults.forEach(function(member) {
        let row = document.createElement("TR");
        let idCell = document.createElement("TD");
        let NameCell = document.createElement("TD");
        let EmailCell = document.createElement("TD");
        let HeightCell = document.createElement("TD");
        let WeightCell = document.createElement("TD");
        let AgeCell = document.createElement("TD");

        // Fill the cells with correct data
        idCell.textContent = member.id;
        NameCell.textContent = member.Name;
        EmailCell.textContent = member.Email;
        HeightCell.textContent = member.Height;
        WeightCell.textContent = member.Weight;
        AgeCell.textContent = member.Age;

        // Add the cells to the row 
        row.appendChild(idCell);
        row.appendChild(NameCell);
        row.appendChild(EmailCell);
        row.appendChild(HeightCell);
        row.appendChild(WeightCell);
        row.appendChild(AgeCell);
        
        // Add the row to the table
        currentTable.appendChild(row);
    });
}