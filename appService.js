const oracledb = require("oracledb");
const loadEnvFile = require("./utils/envUtil");

const envVariables = loadEnvFile("./.env");

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
  user: envVariables.ORACLE_USER,
  password: envVariables.ORACLE_PASS,
  connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
  poolMax: 1,
};

// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
let poolMade = false;
async function withOracleDB(action) {
  let connection;
  try {
    if (!poolMade) {
      await oracledb.createPool(dbConfig);
      poolMade = true;
    }

    connection = await oracledb.getConnection();
    return await action(connection);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getAvailableAnimals() {
  const query =
    "SELECT A.animalID, A.animalName, A.breed, A.branchID FROM AnimalAdmits A WHERE A.animalID NOT IN (SELECT P.animalID FROM Applies P WHERE P.applicationStatus = 'Accepted') GROUP BY A.animalID, A.animalName, A.breed, A.branchID";
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(query);
    // console.log(result);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function getAnimals() {
  const query =
    "SELECT DISTINCT a.animalID, a.animalName, a.age, i.species, a.breed, a.branchID FROM AnimalInfo i JOIN AnimalAdmits a ON i.breed = a.breed WHERE NOT EXISTS (SELECT 1 FROM Applies ap WHERE a.animalID = ap.animalID AND ap.applicationStatus = 'Accepted')";
  // "SELECT DISTINCT a.animalID, a.animalName, a.age, i.species, a.breed, a.branchID FROM AnimalInfo i JOIN AnimalAdmits a ON i.breed = a.breed LEFT JOIN Applies ap ON a.animalID = ap.animalID AND ap.applicationStatus <> 'Approved'";
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(query);
    // console.log(result);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

// async function getAnimals() {
//   return await withOracleDB(async (connection) => {
//     const result = await connection.execute(
//       "SELECT * FROM AnimalInfo i, AnimalAdmits a WHERE i.breed = a.breed"
//     );
//     console.log(result);
//     return result.rows;
//   }).catch(() => {
//     return [];
//   });
// }

async function getTable(table_name, attributes) {
  try {
    return await withOracleDB(async (connection) => {
      const selectAttributes = attributes.join(", ");
      const query = `SELECT ${selectAttributes} FROM ${table_name}`;
      const result = await connection.execute(query);
      return result.rows;
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    return [];
  }
}

async function getVaccinationCounts() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      "SELECT a.animalID, COUNT(v.animalID) AS vaccination_count FROM AnimalInfo i, AnimalAdmits a, Vaccination v WHERE i.breed = a.breed AND a.animalID = v.animalID GROUP BY a.animalID"
    );
    // console.log(result);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function getEvents() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      "SELECT title, eventLocation, eventDate FROM Events"
    );
    console.log(result);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function getTableNames() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      "SELECT title, eventLocation, eventDate FROM Events"
    );
    console.log(result);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function getApplications() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT * FROM Applies");
    console.log(result);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function submitApplication(
  branchID,
  adopterID,
  animalID,
  applicationStatus,
  applicationDate
) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO Applies(branchID, adopterID, animalID, applicationStatus, applicationDate) 
            VALUES(:branchID, :adopterID, :animalID, :applicationStatus, TO_DATE(:applicationDate, 'YYYY-MM-DD'))`,
      { branchID, adopterID, animalID, applicationStatus, applicationDate },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function withdrawApplication(branchID, adopterID, animalID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `DELETE FROM Applies 
             WHERE branchID = :branchID AND adopterID = :adopterID AND animalID = :animalID`,
      { branchID, adopterID, animalID },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function updateApplication(
  branchID,
  adopterID,
  animalID,
  applicationStatus,
  applicationDate
) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE Applies 
             SET applicationStatus = :applicationStatus,
                 applicationDate = TO_DATE(:applicationDate, 'YYYY-MM-DD')
             WHERE branchID = :branchID AND adopterID = :adopterID AND animalID = :animalID`,
      { branchID, adopterID, animalID, applicationStatus, applicationDate },
      { autoCommit: true }
    );
    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

// // ----------------------------------------------------------
// // Wrapper to manage OracleDB actions, simplifying connection handling.
// async function withOracleDB(action) {
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     return await action(connection);
//   } catch (err) {
//     console.error(err);
//     throw err;
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   }
// }

// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
  return await withOracleDB(async (connection) => {
    return true;
  }).catch(() => {
    return false;
  });
}

async function fetchDemotableFromDb() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT * FROM DEMOTABLE");
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function initiateDemotable() {
  return await withOracleDB(async (connection) => {
    try {
      await connection.execute(`DROP TABLE DEMOTABLE`);
    } catch (err) {
      console.log("Table might not exist, proceeding to create...");
    }

    const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
    return true;
  }).catch(() => {
    return false;
  });
}

async function insertDemotable(id, name) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
      [id, name],
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function updateNameDemotable(oldName, newName) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
      [newName, oldName],
      { autoCommit: true }
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function countDemotable() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute("SELECT Count(*) FROM DEMOTABLE");
    return result.rows[0][0];
  }).catch(() => {
    return -1;
  });
}

module.exports = {
  testOracleConnection,
  fetchDemotableFromDb,
  initiateDemotable,
  insertDemotable,
  updateNameDemotable,
  countDemotable,
  getEvents,
  getAnimals,
  getTable,
  getVaccinationCounts,
  getApplications,
  submitApplication,
  withdrawApplication,
  updateApplication,
  getAvailableAnimals
};
