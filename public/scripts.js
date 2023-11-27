/*
 * These functions below are for various webpage functionalities.
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 *
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your
 *   backend endpoints
 * and
 *   HTML structure.
 *
 */

// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
  const statusElem = document.getElementById("dbStatus");
  const loadingGifElem = document.getElementById("loadingGif");

  const response = await fetch("/check-db-connection", {
    method: "GET",
  });

  // Hide the loading GIF once the response is received.
  loadingGifElem.style.display = "none";
  // Display the statusElem's text in the placeholder.
  statusElem.style.display = "inline";

  response
    .text()
    .then((text) => {
      statusElem.textContent = text;
    })
    .catch((error) => {
      statusElem.textContent = "connection timed out"; // Adjust error handling if required.
    });
}

// Fetches data on animals (AnimalAdmits, AnimalInfo, Vaccinations)
async function fetchAndDisplayAnimals() {
  const tableElement = document.getElementById("animaltable");
  const tableBody = tableElement.querySelector("tbody");

  //   const animalResponse = await fetch("/animals", {
  //     method: "GET",
  //   });
  //   const animalResponseData = await animalResponse.json();
  const animalTable = await getAnimals();
  const vaccinationTable = await getVaccinations();

  // Always clear old, already fetched data before new fetching process.
  if (tableBody) {
    tableBody.innerHTML = "";
  }

  animalTable.forEach((animal) => {
    const row = tableBody.insertRow();
    animal.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
    const cell = row.insertCell(6);
    cell.textContent = getVaccinationCount(animal[0], vaccinationTable);
  });
}

async function getAnimals() {
  const animalResponse = await fetch("/animals", {
    method: "GET",
  });
  const animalResponseData = await animalResponse.json();
  const animalTable = animalResponseData["rows"];

  return animalTable;
}

async function getVaccinations() {
  const vaccinationResponse = await fetch("/vaccinations", {
    method: "GET",
  });
  const vaccinationResponseData = await vaccinationResponse.json();
  const vaccinationTable = vaccinationResponseData["rows"];
  return vaccinationTable;
}

function getVaccinationCount(animalID, vaccinationTable) {
  for (const row of vaccinationTable) {
    if (row[0] === animalID) {
      return row[1];
    }
  }
  return 0;
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
  const tableElement = document.getElementById("demotable");
  const tableBody = tableElement.querySelector("tbody");

  const response = await fetch("/demotable", {
    method: "GET",
  });

  const responseData = await response.json();
  const demotableContent = responseData.data;

  // Always clear old, already fetched data before new fetching process.
  if (tableBody) {
    tableBody.innerHTML = "";
  }

  demotableContent.forEach((user) => {
    const row = tableBody.insertRow();
    user.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}

// This function resets or initializes the demotable.
async function resetDemotable() {
  const response = await fetch("/initiate-demotable", {
    method: "POST",
  });
  const responseData = await response.json();

  if (responseData.success) {
    const messageElement = document.getElementById("resetResultMsg");
    messageElement.textContent = "demotable initiated successfully!";
    fetchTableData();
  } else {
    alert("Error initiating table!");
  }
}

// Inserts new records into the demotable.
async function insertDemotable(event) {
  event.preventDefault();

  const idValue = document.getElementById("insertId").value;
  const nameValue = document.getElementById("insertName").value;

  const response = await fetch("/insert-demotable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: idValue,
      name: nameValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("insertResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Data inserted successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error inserting data!";
  }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
  event.preventDefault();

  const oldNameValue = document.getElementById("updateOldName").value;
  const newNameValue = document.getElementById("updateNewName").value;

  const response = await fetch("/update-name-demotable", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oldName: oldNameValue,
      newName: newNameValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("updateNameResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Name updated successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error updating name!";
  }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
  const response = await fetch("/count-demotable", {
    method: "GET",
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("countResultMsg");

  if (responseData.success) {
    const tupleCount = responseData.count;
    messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
  } else {
    alert("Error in count demotable!");
  }
}

// Define the table attributes dictionary

// Function to fill the dropdown lists
function fillDropdownLists() {
  let tables = {
    Donor: ["donorID", "lastName", "firstName"],
    Events: ["eventLocation", "eventDate", "title", "eventType"],
    Shelter: ["branchID", "phoneNum", "shelterAddress"],
    InventoryHolds: ["invID", "branchID", "quantity", "invType"],
    Staff: ["staffID", "lastName", "firstName", "startDate", "phoneNum"],
    Volunteer: ["staffID", "volunteerHours"],
    SalaryRanges: ["position", "salary"],
    Employee: ["staffID", "position"],
    AnimalInfo: ["breed", "species"],
    AnimalAdmits: [
      "animalID",
      "breed",
      "animalName",
      "age",
      "dateAdmit",
      "branchID",
    ],
    Adopters: ["adopterID", "lastName", "firstName", "phoneNum"],
    Vaccination: ["vacType", "vacDate", "animalID"],
    Attends: ["donorID", "attendsLocation", "attendsDate", "title"],
    Donates: ["donorID", "branchID", "donationDate", "amount"],
    Plans: ["plansLocation", "plansDate", "title", "branchID"],
    Employs: ["staffID", "branchID", "contractID"],
    Applies: [
      "branchID",
      "adopterID",
      "animalID",
      "applicationStatus",
      "applicationDate",
    ],
  };
  const tableDropdown = document.getElementById("tableDropdown");
  const attributeDropdown = document.getElementById("attributeDropdown");

  for (const table in tables) {
    const option = document.createElement("option");
    option.value = table;
    option.text = table;
    tableDropdown.add(option);
  }

  tableDropdown.addEventListener("change", () => {
    const selectedTable = tableDropdown.value;
    const attributes = tables[selectedTable] || [];
    attributeDropdown.innerHTML = "";
    for (const attribute of attributes) {
      const option = document.createElement("option");
      option.value = attribute;
      option.text = attribute;
      attributeDropdown.add(option);
    }
    attributeDropdown.multiple = true;
  });
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
  checkDbConnection();
  fetchTableData();
  fillDropdownLists();
  document
    .getElementById("resetDemotable")
    .addEventListener("click", resetDemotable);
  document
    .getElementById("insertDemotable")
    .addEventListener("submit", insertDemotable);
  document
    .getElementById("updataNameDemotable")
    .addEventListener("submit", updateNameDemotable);
  document
    .getElementById("countDemotable")
    .addEventListener("click", countDemotable);
  document
    .getElementById("displayProjectionTable")
    .addEventListener("click", displayProjectionTable);
};
async function displayProjectionTable() {
  const tableName = document.getElementById("tableDropdown").value;

  const dropdown = document.getElementById("attributeDropdown");
  const selectedOptions = Array.from(dropdown.selectedOptions).map(
    (option) => option.value
  );
  const rows = getProjectionTable();

  if (selectedOptions.length > 0) {
    try {
      const tableData = await getProjectionTable(tableName, selectedOptions);
      const table = document.getElementById("projectionResultTable");

      table.innerHTML = "";
      const headerRow = table.insertRow();
      for (const attribute of selectedOptions) {
        const headerCell = headerRow.insertCell();
        headerCell.textContent = attribute;
      }

      // Populate table values
      for (const rowValues of tableData) {
        const row = table.insertRow();
        for (const rowValue of rowValues) {
          const cell = row.insertCell();
          cell.textContent = rowValue;
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

async function getProjectionTable() {
  const tableName = document.getElementById("tableDropdown").value;
  const dropdown = document.getElementById("attributeDropdown");
  const selectedOptions = Array.from(dropdown.selectedOptions).map(
    (option) => option.value
  );

  if (selectedOptions.length > 0) {
    try {
      const response = await fetch("/projection", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table_name: tableName,
          attributes: selectedOptions,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error retrieving Projection table data!`);
      }
      const responseData = await response.json();

      return responseData;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
  fetchAndDisplayAnimals();

  // legacy
  fetchAndDisplayUsers();
}
