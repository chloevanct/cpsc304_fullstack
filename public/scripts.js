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

/**
 * ANIMALS TABLE -----------------------------------------------------------------------------------------------------------
 */
// fetch and display available animals for adoption (nested aggregation with group by query)
async function fetchAndDisplayAvailableAnimals() {
  const tableElement = document.getElementById("animalsAvailableTable");
  const tableBody = tableElement.querySelector("tbody");

  // fetch data from backend
  const response = await fetch("/available-animals", {
    method: "GET",
  });
  const animalsData = await response.json();

  // always clear old, already fetched data before new fetching process.
  tableBody.innerHTML = "";

  // populate table with new data
  animalsData.rows.forEach((animal) => {
    const row = tableBody.insertRow();
    animal.forEach((value) => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
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

/**
 * APPLIES TABLE -----------------------------------------------------------------------------------------------------------
 */
// Fetches data on animals (AnimalAdmits, AnimalInfo, Vaccinations)
async function fetchAndDisplayApplications() {
  const tableElement = document.getElementById("applicationsTable");
  const tableBody = tableElement.querySelector("tbody");
  const applicationTable = await getApplications();

  // Always clear old, already fetched data before new fetching process.
  if (tableBody) {
    tableBody.innerHTML = "";
  }

  applicationTable.forEach((application) => {
    const row = tableBody.insertRow();
    application.forEach((field, index) => {
      const cell = row.insertCell(index);
      cell.textContent = field;
    });
  });
}

async function getApplications() {
  const applicationsResponse = await fetch("/applications", {
    method: "GET",
  });
  const animalResponseData = await applicationsResponse.json();
  const animalTable = animalResponseData["rows"];

  return animalTable;
}

// Inserts new records into the applies table.
async function insertApplication(event) {
  event.preventDefault();

  const branchIDValue = document.getElementById("insertBranchID").value;
  const adopterIDValue = document.getElementById("insertAdopterID").value;
  const animalIDValue = document.getElementById("insertAnimalID").value;
  const applicationStatusValue = document.getElementById(
    "insertApplicationStatus"
  ).value;
  const applicationDateValue = document.getElementById(
    "insertApplicationDate"
  ).value;

  const response = await fetch("/applications-submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branchID: branchIDValue,
      adopterID: adopterIDValue,
      animalID: animalIDValue,
      applicationStatus:
        applicationStatusValue.charAt(0).toUpperCase() +
        applicationStatusValue.slice(1).toLowerCase(),
      applicationDate: applicationDateValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("insertApplicationResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Data inserted successfully!";
    fetchTableData();
  } else {
    if (responseData.error.includes("ORA-00001")) {
      // Unique constraint violation
      messageElement.textContent =
        "Error! Cannot insert a duplicate application.";
    } else if (responseData.error.includes("ORA-01400")) {
      // Empty status/date fields
      messageElement.textContent =
        "Error! Please enter an application Status and Date";
    } else {
      messageElement.textContent =
        "Error inserting data! " + responseData.error;
    }
  }
}

// Deletes an application from the Applications Table
async function deleteApplication(event) {
  event.preventDefault();

  const branchIDValue = document.getElementById("deleteBranchID").value;
  const adopterIDValue = document.getElementById("deleteAdopterID").value;
  const animalIDValue = document.getElementById("deleteAnimalID").value;

  const response = await fetch("/applications-withdraw", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branchID: branchIDValue,
      adopterID: adopterIDValue,
      animalID: animalIDValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("deleteApplicationResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Application deleted successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error inserting data! " + responseData.error;
  }
}

// Updates status/date in the Applications table.
async function updateApplication(event) {
  event.preventDefault();

  const branchIDValue = document.getElementById("updateBranchID").value;
  const adopterIDValue = document.getElementById("updateAdopterID").value;
  const animalIDValue = document.getElementById("updateAnimalID").value;
  const newApplicationStatusValue = document.getElementById(
    "updateApplicationStatus"
  ).value;
  const newApplicationDateValue = document.getElementById(
    "updateApplicationDate"
  ).value;

  const response = await fetch("/applications-update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branchID: branchIDValue,
      adopterID: adopterIDValue,
      animalID: animalIDValue,
      applicationStatus:
        newApplicationStatusValue.charAt(0).toUpperCase() +
        newApplicationStatusValue.slice(1).toLowerCase(),
      applicationDate: newApplicationDateValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("updateApplicationResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Name updated successfully!";
    fetchTableData();
  } else {
    if (responseData.error.includes("ORA-01400")) {
      // Empty status/date fields
      messageElement.textContent =
        "Error! Please enter an application Status and Date";
    } else {
      messageElement.textContent =
        "Error inserting data! " + responseData.error;
    }
  }
}

/**
 * DEMOTABLE -----------------------------------------------------------------------------------------------------------
 */

// Fetches data from the demotable and displays it.
// async function fetchAndDisplayUsers() {
//   const tableElement = document.getElementById("demotable");
//   const tableBody = tableElement.querySelector("tbody");

//   const response = await fetch("/demotable", {
//     method: "GET",
//   });

//   const responseData = await response.json();
//   const demotableContent = responseData.data;

//   // Always clear old, already fetched data before new fetching process.
//   if (tableBody) {
//     tableBody.innerHTML = "";
//   }

//   demotableContent.forEach((user) => {
//     const row = tableBody.insertRow();
//     user.forEach((field, index) => {
//       const cell = row.insertCell(index);
//       cell.textContent = field;
//     });
//   });
// }

// // This function resets or initializes the demotable.
// async function resetDemotable() {
//   const response = await fetch("/initiate-demotable", {
//     method: "POST",
//   });
//   const responseData = await response.json();

//   if (responseData.success) {
//     const messageElement = document.getElementById("resetResultMsg");
//     messageElement.textContent = "demotable initiated successfully!";
//     fetchTableData();
//   } else {
//     alert("Error initiating table!");
//   }
// }

// // Inserts new records into the demotable.
// async function insertDemotable(event) {
//   event.preventDefault();

//   const idValue = document.getElementById("insertId").value;
//   const nameValue = document.getElementById("insertName").value;

//   const response = await fetch("/insert-demotable", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       id: idValue,
//       name: nameValue,
//     }),
//   });

//   const responseData = await response.json();
//   const messageElement = document.getElementById("insertResultMsg");

//   if (responseData.success) {
//     messageElement.textContent = "Data inserted successfully!";
//     fetchTableData();
//   } else {
//     messageElement.textContent = "Error inserting application!";
//   }
// }

// // Updates names in the demotable.
// async function updateNameDemotable(event) {
//   event.preventDefault();

//   const oldNameValue = document.getElementById("updateOldName").value;
//   const newNameValue = document.getElementById("updateNewName").value;

//   const response = await fetch("/update-name-demotable", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       oldName: oldNameValue,
//       newName: newNameValue,
//     }),
//   });

//   const responseData = await response.json();
//   const messageElement = document.getElementById("updateNameResultMsg");

//   if (responseData.success) {
//     messageElement.textContent = "Name updated successfully!";
//     fetchTableData();
//   } else {
//     messageElement.textContent = "Error updating application!";
//   }
// }

function addFilterRow() {
  const filterRows = document.getElementById("filterRows");
  filterRows.appendChild(filterRows.firstElementChild.cloneNode(true));
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
// async function countDemotable() {
//   const response = await fetch("/count-demotable", {
//     method: "GET",
//   });

//   const responseData = await response.json();
//   const messageElement = document.getElementById("countResultMsg");

//   if (responseData.success) {
//     const tupleCount = responseData.count;
//     messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
//   } else {
//     alert("Error in count demotable!");
//   }
// }

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

// fetch and display top donors (aggregation with having query)
async function fetchAndDisplayTopDonors() {
  const tableElement = document.getElementById("topDonorsTable");
  const tableBody = tableElement.querySelector("tbody");

  // fetch data from backend
  const response = await fetch("/top-donors", {
    method: "GET",
  });
  const donorData = await response.json();

  // always clear old, already fetched data before new fetching process.
  tableBody.innerHTML = "";

  // populate table with new data
  donorData.rows.forEach((donor) => {
    const row = tableBody.insertRow();
    donor.forEach((value) => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
  });
}

// fetch and display donors who've attend all events (divison query)
async function fetchAndDisplayDonorsWhoAttendedAllEvents() {
  const tableElement = document.getElementById("donorsAttendedAllEventsTable");
  const tableBody = tableElement.querySelector("tbody");

  // fetch data from backend
  const response = await fetch("/donors-attend-all-events", {
    method: "GET",
  });
  const donorData = await response.json();

  // always clear old, already fetched data before new fetching process.
  tableBody.innerHTML = "";

  // populate table with new data
  donorData.rows.forEach((donor) => {
    const row = tableBody.insertRow();
    donor.forEach((value) => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
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
    .getElementById("insertApplicationsTable")
    .addEventListener("submit", insertApplication);
  document
    .getElementById("deleteApplicationsTable")
    .addEventListener("submit", deleteApplication);
  document
    .getElementById("updateApplicationsTable")
    .addEventListener("submit", updateApplication);
  document
    .getElementById("fetchAvailableAnimals")
    .addEventListener("click", fetchAndDisplayAvailableAnimals);
  // document
  //   .getElementById("resetDemotable")
  //   .addEventListener("click", resetDemotable);
  // document
  //   .getElementById("insertDemotable")
  //   .addEventListener("submit", insertDemotable);
  // document
  //   .getElementById("updataNameDemotable")
  //   .addEventListener("submit", updateNameDemotable);
  // document
  //   .getElementById("countDemotable")
  //   .addEventListener("click", countDemotable);
  document
    .getElementById("displayProjectionTable")
    .addEventListener("click", displayProjectionTable);
  document
    .getElementById("applyFilters")
    .addEventListener("click", displayEventsTable);
  document.getElementById("addFilter").addEventListener("click", addFilterRow);
  document
    .getElementById("displayTopDonors")
    .addEventListener("click", fetchAndDisplayTopDonors);
  document
    .getElementById("displayDonorsAttendedEveryEvent")
    .addEventListener("click", fetchAndDisplayDonorsWhoAttendedAllEvents);
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
      const tableData = await getProjectionTable();
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

function addFilterRow() {
  const filterRows = document.getElementById("filterRows");
  filterRows.appendChild(filterRows.firstElementChild.cloneNode(true));
}

async function displayEventsTable() {
  const inputs = getSelectedInputs();
  const whereQuery = generateWhereQuery(inputs);
  const eventsTable = await getEventsTable("WHERE " + whereQuery);
  // console.log(eventsTable);
  const attributes = ["eventLocation", "eventDate", "title", "eventType"];

  let errorMessage = document.getElementById("warning");
  if (containsInvalidInputs(inputs)) {
    // errorMessage = document =
    errorMessage.style.display = "inline";
    return;
  }

  try {
    errorMessage.style.display = "none";
    const table = document.getElementById("selectionTable");

    table.innerHTML = "";
    const headerRow = table.insertRow();
    for (const attribute of attributes) {
      const headerCell = headerRow.insertCell();
      headerCell.textContent = attribute;
    }

    for (const rowValues of eventsTable) {
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

function containsInvalidInputs(inputs) {
  const invalidInputs = [
    ";",
    "INSERT",
    "DROP TABLE",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "(",
    ")",
  ];
  for (const input of inputs) {
    for (const invalidInput of invalidInputs) {
      // console.log(input);
      if (input.includes(invalidInput)) {
        console.log("invalid input");
        return true;
      }
    }
  }

  return false;
}

async function getEventsTable(whereQuery) {
  try {
    const response = await fetch("/events", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        where: whereQuery,
      }),
    });
    if (!response.ok) {
      throw new Error(`Error retrieving event table data!`);
    }
    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function generateWhereQuery(inputs) {
  let result = "";
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    let value;
    if (input[0] === "eventDate") {
      value = "DATE " + "'" + input[1] + "'";
    } else {
      value = "'" + input[1] + "'";
    }

    if (i === inputs.length - 1) {
      result = result + "" + input[0] + " " + "= " + value + " ";
    } else {
      result =
        result + "" + input[0] + " " + "= " + value + " " + input[2] + " ";
    }
  }

  return result;
}

function getSelectedInputs() {
  const filterRowElements = document
    .getElementById("filterRows")
    .querySelectorAll(".filterRow");
  const filterRowArray = Array.from(filterRowElements);

  const filters = [];

  for (const filterRow of filterRowArray) {
    const filter = [];
    filter.push(filterRow.children[0].selectedOptions[0].text);
    filter.push(filterRow.children[2].value);
    filter.push(filterRow.children[3].selectedOptions[0].text);
    filters.push(filter);
  }

  return filters;
}

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
  fetchAndDisplayAnimals();
  fetchAndDisplayApplications();
  // legacy
  // fetchAndDisplayUsers();
}
