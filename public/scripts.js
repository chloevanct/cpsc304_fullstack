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
 * ANIMALS TABLE --------------------------------------------------------------
 */
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

  //   console.log(vaccinationTable);

  //   const vaccinationResponse = await fetch("/vaccinations", {
  //     method: "GET",
  //   });
  //   const vaccinationResponseData = await vaccinationResponse.json();
  //   const vaccinationTable = vaccinationResponseData["rows"];
  //   console.log(vaccinationTable);

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
 * APPLIES TABLE --------------------------------------------------------------
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
  const applicationStatusValue = document.getElementById("insertApplicationStatus").value;
  const applicationDateValue = document.getElementById("insertApplicationDate").value;

  const response = await fetch("/applications-submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branchID: branchIDValue,
      adopterID: adopterIDValue,
      animalID: animalIDValue,
      applicationStatus: applicationStatusValue,
      applicationDate: applicationDateValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("insertApplicationResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Data inserted successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error inserting data!";
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
    messageElement.textContent = "Error deleting application!";
  }
}

// Updates status/date in the Applications table.
async function updateApplication(event) {
  event.preventDefault();

  const branchIDValue = document.getElementById("updateBranchID").value;
  const adopterIDValue = document.getElementById("updateAdopterID").value;
  const animalIDValue = document.getElementById("updateAnimalID").value;
  const newApplicationStatusValue = document.getElementById("updateApplicationStatus").value;
  const newApplicationDateValue = document.getElementById("updateApplicationDate").value;

  const response = await fetch("/applications-update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branchID: branchIDValue,
      adopterID: adopterIDValue,
      animalID: animalIDValue,
      applicationStatus: newApplicationStatusValue,
      applicationDate: newApplicationDateValue,
    }),
  });

  const responseData = await response.json();
  const messageElement = document.getElementById("updateApplicationResultMsg");

  if (responseData.success) {
    messageElement.textContent = "Name updated successfully!";
    fetchTableData();
  } else {
    messageElement.textContent = "Error updating name!";
  }
}


/**
 * DEMOTABLE STUFF -------------------------------------------------------------
 */

// Fetches data from the Applies database and displays it.
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

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
  checkDbConnection();
  fetchTableData();
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
};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
  fetchAndDisplayAnimals();
  fetchAndDisplayApplications();
  // legacy
  fetchAndDisplayUsers();
}
