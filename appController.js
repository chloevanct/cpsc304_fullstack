const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------

router.get('/animals', async (req, res) => {
    try {
        const animals = await appService.getAnimals();
        res.json({rows: animals});
    } catch (err) {
        console.log("error getting animal table");
    }
});

router.get('/applications', async (req, res) => {
    try {
        const applications = await appService.getApplications();
        res.json({rows: applications});
    } catch (err) {
        console.log("error getting animal table");
    }
});

// Endpoint for INSERTING an entry in the Applies table
// REQUIRES branchID, adopterID, animalID, applicationStatus and applicationDate in request body 
// EXPECTS applicationDate to be in the form "YYYY-MM-DD"
router.post('/applications-submit', async (req, res) => {
    const {branchID, adopterID, animalID, applicationStatus, applicationDate} = req.body;
    const updateResult = await appService.submitApplication(branchID, adopterID, animalID, applicationStatus, applicationDate);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// Endpoint for DELETING an entry in the Applies table
// REQUIRES branchID, adopterID, animalID in request body to correctly identify which row to remove
router.delete('/applications-withdraw', async (req, res) => {
    const {branchID, adopterID, animalID} = req.body;
    const updateResult = await appService.withdrawApplication(branchID, adopterID, animalID);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// Endpoint for UPDATING an entry in the Applies table
// REQUIRES branchID, adopterID, animalID in request body to correctly identify which row to update
//          the given applicationStatus and applicationDate are the NEW desired values for these fields
// EXPECTS applicationDate to be in the form "YYYY-MM-DD"

router.put('/applications-update', async (req, res) => {
    const {branchID, adopterID, animalID, applicationStatus, applicationDate} = req.body;
    const updateResult = await appService.updateApplication(branchID, adopterID, animalID, applicationStatus, applicationDate);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({ data: tableContent });
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});


module.exports = router;