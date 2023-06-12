// Get the objects we need to modify
let updateMemberForm = document.getElementById('update-member-form-ajax');

// Modify the objects we need
updateMemberForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputMemberID = document.getElementById("mySelect");
    let inputName = document.getElementById("input-Name-update");


    //console.log(document.querySelector('#updateSelect').value)
    // Get the values from the form fields
    let MemberIDValue = document.querySelector('#updateSelect').value;
    let NameValue = document.querySelector('#updateMemberName').value;
    let EmailValue = document.querySelector('#updateEmail').value;
    let HeightValue = document.querySelector('#updateHeight').value;
    let WeightValue = document.querySelector('#updateMemberWeight').value;
    let AgeValue = document.querySelector('#updateAge').value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld



    // Put our data we want to send in a javascript object
    let data = {
        MemberID: MemberIDValue,
        Name: NameValue,
        Email: EmailValue,
        Height: HeightValue,
        Weight: WeightValue,
        Age: AgeValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-member-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, EmailValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    setTimeout(() => {
        location.reload();
    }, 500);
})


function updateRow(data, MemberID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("member-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == MemberID) {

            // Get the location of the row where we found the matching member ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].Email; 
       }
    }

}
