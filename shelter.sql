DROP TABLE Applies;
DROP TABLE Employs;
DROP TABLE Plans;
DROP TABLE Donates;
DROP TABLE Attends;
DROP TABLE Vaccination;
DROP TABLE Adopters;
DROP TABLE AnimalAdmits;
DROP TABLE AnimalInfo;
DROP TABLE Employee;
DROP TABLE SalaryRanges;
DROP TABLE Volunteer;
DROP TABLE Staff;
DROP TABLE Events;
DROP TABLE InventoryHolds;
DROP TABLE Donor;
DROP TABLE Shelter;


CREATE TABLE Donor(
    donorID		    VARCHAR(8),
    lastName 		VARCHAR(200),
    firstName 		VARCHAR(200),
    PRIMARY KEY 		(donorID)
);

CREATE TABLE Events(
    -- changed 'location' to eventLocation
    eventLocation 		    VARCHAR(200),
    -- changed 'date' to eventDate
    eventDate			    DATE,
    title			        VARCHAR(200),
    -- changed 'type' to eventType
    eventType			    VARCHAR(200),
    PRIMARY KEY             (eventLocation, eventDate, title)
);

CREATE TABLE Shelter(
    branchID		    VARCHAR(8),
    phoneNum 		    CHAR(10)  		    NOT NULL,
    -- changed 'address' to shelterAddress
    shelterAddress 		VARCHAR(200) 		NOT NULL,
    PRIMARY KEY         (branchID),
    UNIQUE		        (phoneNum, shelterAddress)
); 

CREATE TABLE InventoryHolds(
    invID 			VARCHAR(8),
    branchID 		VARCHAR(8) 		    NOT NULL,
    quantity		INTEGER 		    NOT NULL	CHECK (quantity >= 0),
    -- changed 'type' to invType
    invType			VARCHAR(200) 		NOT NULL, 
    PRIMARY KEY (invID),
    FOREIGN KEY  (branchID) REFERENCES Shelter(branchID)
        ON DELETE CASCADE
        -- ON UPDATE CASCADE
);

CREATE TABLE Staff(
    staffID			VARCHAR(8),
    lastName 		VARCHAR(200)		NOT NULL,
    firstName 		VARCHAR(200)		NOT NULL,
    startDate		DATE			    NOT NULL, 
    phoneNum		CHAR(10)		    NOT NULL,
    PRIMARY KEY 		(staffID)
);

CREATE TABLE Volunteer(
    staffID			VARCHAR(8),
    -- changed 'hours' to volunteerHours
    volunteerHours 			INTEGER		CHECK (volunteerHours >= 0),
    PRIMARY KEY 		(staffID),
    FOREIGN KEY (staffID) REFERENCES Staff(staffID)
        ON DELETE CASCADE
        -- ON UPDATE CASCADE
);

CREATE TABLE SalaryRanges(
    position		VARCHAR(200),
    salary 			INTEGER 		NOT NULL	CHECK (salary > 0),	
    PRIMARY KEY 		(position)
);

CREATE TABLE Employee(
    staffID			VARCHAR(8),
    position		VARCHAR(200)		NOT NULL,
    PRIMARY KEY 		(staffID),
    FOREIGN KEY (staffID) REFERENCES Staff(staffID)
        ON DELETE CASCADE,
        -- ON UPDATE CASCADE,
    FOREIGN KEY (position) REFERENCES SalaryRanges(position)
        ON DELETE CASCADE
        -- ON UPDATE CASCADE
);

CREATE TABLE AnimalInfo(
    breed				VARCHAR(200),
    species				VARCHAR(200) NOT NULL,
    PRIMARY KEY (breed)
);

CREATE TABLE AnimalAdmits (
    animalID			VARCHAR(8),
    -- changed 'name' to animalName
    animalName			VARCHAR(200),
    breed				VARCHAR(200) 	NOT NULL,
    age                 INTEGER         CHECK (age >= 0) NOT NULL,
    dateAdmit			DATE 		    NOT NULL,
    branchID            VARCHAR(8),
    -- changed 'date' to dateAdmit
    PRIMARY KEY (animalID),
    FOREIGN KEY (branchID) REFERENCES Shelter(branchID)
        ON DELETE CASCADE,
        -- ON UPDATE CASCADE, 
    FOREIGN KEY (breed) REFERENCES AnimalInfo(breed)
        ON DELETE CASCADE
        -- ON UPDATE CASCADE
);

CREATE TABLE Adopters(
    adopterID				VARCHAR(8),
    lastName				VARCHAR(200) NOT NULL,
    firstName				VARCHAR(200) NOT NULL,
    phoneNum				VARCHAR(10)	NOT NULL,
    PRIMARY KEY (adopterID)
);

CREATE TABLE Vaccination(
    vacType				VARCHAR(200),
     -- changed 'type' to vacType
    vacDate				DATE,
    -- changed 'date' to vacDate
    animalID			VARCHAR(8),
    PRIMARY KEY(vacType,vacDate,animalID),
    FOREIGN KEY (animalID) REFERENCES AnimalAdmits(animalID)
        ON DELETE CASCADE
        -- ON UPDATE CASCADE
);

CREATE TABLE Attends(
    donorID		VARCHAR(8),
    -- changed 'location' to attendsLocation
    attendsLocation 		VARCHAR(200),
    -- changed 'date' to attendsDate
    attendsDate 			DATE,
    title			        VARCHAR(200),	
    PRIMARY KEY (donorID, attendsLocation, attendsDate, title),
    FOREIGN KEY	(donorID) REFERENCES Donor(donorID) ON DELETE CASCADE,
        -- ON UPDATE CASCADE,
    FOREIGN KEY (attendsLocation, attendsDate, title) REFERENCES Events(eventLocation, eventDate, title) ON DELETE CASCADE
        -- ON UPDATE CASCADE
);

CREATE TABLE Donates(
    donorID		    VARCHAR(8),
    branchID 		VARCHAR(8),
    -- changed 'date' to donationDate
    donationDate 	DATE			NOT NULL,
    amount		    FLOAT			NOT NULL 	CHECK (amount > 0),
    PRIMARY KEY 		(donorID, branchID),
    FOREIGN KEY		(donorID) REFERENCES Donor(donorID)
        ON DELETE CASCADE,
        -- ON UPDATE CASCADE,
    FOREIGN KEY	(branchID) REFERENCES Shelter(branchID)
        ON DELETE CASCADE
        -- ON UPDATE CASCADE
);

CREATE TABLE Plans(
    -- changed 'location' to plansLocation
    plansLocation		VARCHAR(200),
    -- changed 'date' to plansDate
    plansDate	 		DATE,
    title 			VARCHAR(200),
    branchID		VARCHAR(8),				
    PRIMARY KEY 		(plansLocation,plansDate,title,branchID),
    FOREIGN KEY		(plansLocation,plansDate,title) REFERENCES Events(eventLocation, eventDate, title)
        ON DELETE CASCADE,
    -- ON UPDATE CASCADE,
    FOREIGN KEY		(branchID) REFERENCES
    Shelter(branchID)
                ON DELETE CASCADE
                -- ON UPDATE CASCADE
);

CREATE TABLE Employs(
    staffID			VARCHAR(8),
    branchID	 	VARCHAR(8),
    contractID	 	VARCHAR(8) 		NOT NULL,			
    PRIMARY KEY 	(branchID, staffID),
    FOREIGN KEY		(branchID) REFERENCES Shelter(branchID)
                ON DELETE CASCADE,
                -- ON UPDATE CASCADE,
    FOREIGN KEY		(staffID) REFERENCES Staff(staffID)
                ON DELETE CASCADE
                -- ON UPDATE CASCADE
);

-- changed Apply to Applies
CREATE TABLE Applies(
    branchID		VARCHAR(8),
    adopterID		VARCHAR(8),
    animalID		VARCHAR(8),
    -- changed 'status' to applicationStatus
    applicationStatus			VARCHAR(200)		NOT NULL ,
    -- changed 'date' to applicationDate
    applicationDate			DATE 			NOT NULL, 
    PRIMARY KEY		(branchID, adopterID, animalID),
    FOREIGN KEY 		(branchID) REFERENCES Shelter(branchID)
        ON DELETE CASCADE,
                -- ON UPDATE CASCADE,
    FOREIGN KEY 		(adopterID) REFERENCES Adopters(adopterID)
                ON DELETE CASCADE,
                -- ON UPDATE CASCADE,
    FOREIGN KEY 		(animalID) REFERENCES AnimalAdmits(animalID)
                ON DELETE CASCADE
                -- ON UPDATE CASCADE
);




-- Donor(donorID: varchar[8], lastName: varchar[200], firstName: varchar[200])
INSERT INTO Donor(donorID, lastName, firstName) VALUES ('1', 'John', 'Smith');
INSERT INTO Donor(donorID, lastName, firstName) VALUES ('2', 'James', 'Smith');
INSERT INTO Donor(donorID, lastName, firstName) VALUES ('3', 'Anna', 'Lee');
INSERT INTO Donor(donorID, lastName, firstName) VALUES ('4', 'James', 'Monroe');
INSERT INTO Donor(donorID, lastName, firstName) VALUES ('5', 'John', 'Smith');

-- -- Shelter(branchID: varchar[8], phoneNum: varchar[10], shelterAddress: varchar[200])
INSERT INTO Shelter(branchID, phoneNum, shelterAddress) VALUES ('12345678', '7781230033', '123 west 10th avenue, Vancouver, BC V6E9TS');
INSERT INTO Shelter(branchID, phoneNum, shelterAddress) VALUES ('12345679', '7781230034', '123 west 11th avenue, Vancouver, BC V6E9TS');
INSERT INTO Shelter(branchID, phoneNum, shelterAddress) VALUES ('12345680', '7781230035', '123 west 12th avenue, Vancouver, BC V6E9TS');
INSERT INTO Shelter(branchID, phoneNum, shelterAddress) VALUES ('12345681', '7781230036', '123 west 13th avenue, Vancouver, BC V6E9TS');
INSERT INTO Shelter(branchID, phoneNum, shelterAddress) VALUES ('12345682', '7781230037', '123 west 14th avenue, Vancouver, BC V6E9TS');



-- InventoryHolds(invID: varchar[8], branchID: varchar[8], quantity: integer, invType: varchar[200])
INSERT INTO InventoryHolds(invID, branchID, quantity, invType) 
    VALUES('11111111', '12345678', 12, 'syringe');
INSERT INTO InventoryHolds(invID, branchID, quantity, invType) 
    VALUES('11111112', '12345678', 1, 'comb');
INSERT INTO InventoryHolds(invID, branchID, quantity, invType) 
    VALUES('11111113', '12345678', 22, 'collars');
INSERT INTO InventoryHolds(invID, branchID, quantity, invType) 
    VALUES('11111114', '12345678', 12, 'flea medicine');
INSERT INTO InventoryHolds(invID, branchID, quantity, invType) 
    VALUES('11111115', '12345678', 3, 'cat treats');


-- Staff(staffID: varchar[8],lastName: varchar[200], firstName: varchar[200], startDate: date, phoneNum: varchar[10])
INSERT INTO Staff (staffID, lastName, firstName, startDate, phoneNum)
    VALUES ('00000000', 'Johnson', 'Emily', TO_DATE('2015-10-23', 'YYYY-MM-DD'), '7783751826');
INSERT INTO Staff (staffID, lastName, firstName, startDate, phoneNum)
    VALUES ('00000001', 'Martinez', 'David', TO_DATE('1999-10-23', 'YYYY-MM-DD'), '2504338590');
INSERT INTO Staff (staffID, lastName, firstName, startDate, phoneNum)
    VALUES ('00000002', 'Anderson', 'Sarah', TO_DATE('2009-01-25', 'YYYY-MM-DD'), '6042973456');
INSERT INTO Staff (staffID, lastName, firstName, startDate, phoneNum)
    VALUES ('00000003', 'Wilson', 'Michael', TO_DATE('2021-12-01', 'YYYY-MM-DD'), '6041234567');
INSERT INTO Staff (staffID, lastName, firstName, startDate, phoneNum)
    VALUES ('00000004', 'Davis', 'Olivia', TO_DATE('2021-7-01', 'YYYY-MM-DD'), '6040001234');
INSERT INTO Staff (staffID, lastName, firstName, startDate, phoneNum)
    VALUES ('00000005', 'Taylor', 'Sophia', TO_DATE('2021-8-01', 'YYYY-MM-DD'), '6047893456');
INSERT INTO Staff (staffID, lastName, firstName, startDate, phoneNum)
    VALUES ('00000006', 'Brown', 'Ethan', TO_DATE('2021-9-01', 'YYYY-MM-DD'), '7784560192');
INSERT INTO Staff (staffID, lastName, firstName, startDate, phoneNum)
    VALUES ('00000007', 'Miller', 'Ava', TO_DATE('2021-10-01', 'YYYY-MM-DD'), '7782950146'); 
INSERT INTO Staff (staffID, lastName, firstName, startDate, phoneNum)
    VALUES ('00000008', 'Clark', 'James', TO_DATE('2021-11-01', 'YYYY-MM-DD'), '2507182934');
INSERT INTO Staff (staffID, lastName, firstName, startDate, phoneNum)
    VALUES ('00000009', 'Hernandez', 'Mia', TO_DATE('2021-12-01', 'YYYY-MM-DD'), '6046782048');
    
-- -- Volunteer(staffID: varchar[8], volunteerHours: integer)
INSERT INTO Volunteer(staffID, volunteerHours)
    VALUES('00000000', 10);
INSERT INTO Volunteer(staffID, volunteerHours)
    VALUES('00000001', 5);
INSERT INTO Volunteer(staffID, volunteerHours)
    VALUES('00000002', 32);
INSERT INTO Volunteer(staffID, volunteerHours)
    VALUES('00000003', 400);
INSERT INTO Volunteer(staffID, volunteerHours)
    VALUES('00000004', 111);

-- Events(location: varchar[200], eventDate: date, title: varchar[200], eventType: varchar[200])
INSERT INTO Events (eventLocation, eventDate,title,eventType)
    VALUES ('Stanley Park', TO_DATE('2023-07-15', 'YYYY-MM-DD'), 'PetPalooza', 'Education');
INSERT INTO Events (eventLocation, eventDate,title,eventType)
    VALUES ('New Brighton Park', TO_DATE('2021-03-04', 'YYYY-MM-DD'), 'Furry Friends Fair', 'Adoption');
INSERT INTO Events (eventLocation, eventDate,title,eventType)
    VALUES ('Olympic Oval', TO_DATE('2022-05-15', 'YYYY-MM-DD'), 'Strut for Strays 5K', 'Fundraising');
INSERT INTO Events (eventLocation, eventDate,title,eventType)
    VALUES ('Vancouver Art Gallery', TO_DATE('2025-09-15', 'YYYY-MM-DD'), 'Paws and Painting Night', 'Fundraising');
INSERT INTO Events (eventLocation, eventDate,title,eventType)
    VALUES ('Queen Elizabeth Park', TO_DATE('2022-10-31', 'YYYY-MM-DD'), 'Barktoberfest', 'Fundraising');

    
-- -- SalaryRanges(position: varchar[200], salary: integer)
INSERT INTO SalaryRanges(position, salary)
    VALUES('Administrative Assistant', 50000);
INSERT INTO  SalaryRanges(position, salary)
    VALUES('Veterinarian', 90000);
INSERT INTO  SalaryRanges(position, salary)
    VALUES('Social Media Administrator', 60000);
INSERT INTO  SalaryRanges(position, salary)
    VALUES('Cleaning Assistant', 55000);
INSERT INTO  SalaryRanges(position, salary)
    VALUES('CEO', 120000);
    
-- Employee(staffID: varchar[8], position: varchar[200])
INSERT INTO Employee(staffID, position)
    VALUES('00000005', 'Administrative Assistant');
INSERT INTO Employee(staffID, position)
    VALUES('00000006', 'Veterinarian');
INSERT INTO Employee(staffID, position)
    VALUES('00000007', 'Social Media Administrator');
INSERT INTO Employee(staffID, position)
    VALUES('00000008', 'Cleaning Assistant');
INSERT INTO Employee(staffID, position)
    VALUES('00000009', 'CEO');

-- AnimalInfo(breed: varchar[200], species: varchar[200])
INSERT INTO AnimalInfo (breed, species) VALUES ('Dog', 'Dog');
INSERT INTO AnimalInfo (breed, species)  VALUES ('Cat', 'Cat');
INSERT INTO AnimalInfo (breed, species) VALUES ('German Shepherd', 'Dog');
INSERT INTO AnimalInfo (breed, species)  VALUES ('Siamese Cat', 'Cat');
INSERT INTO AnimalInfo (breed, species)  VALUES  ('French Bulldog', 'Dog');


-- AnimalAdmits(animalID: varchar[8], breed: varchar[200], animalName: varchar[200], age: integer, dateAdmit: date, branchID: varchar[8])
INSERT INTO AnimalAdmits (animalID, breed, animalName, age, dateAdmit, branchID) 
    VALUES ('1', 'Dog', 'Mochi', 2, TO_DATE('2022-4-30', 'YYYY-MM-DD'), '12345678');
INSERT INTO AnimalAdmits (animalID, breed, animalName, age, dateAdmit, branchID) 
    VALUES ('2', 'Cat', 'Biscuit', 5, TO_DATE('2022-5-31', 'YYYY-MM-DD'), '12345678');
INSERT INTO AnimalAdmits (animalID, breed, animalName, age, dateAdmit, branchID) 
    VALUES ('3', 'German Shepherd', 'Rex', 0, TO_DATE('2022-6-30', 'YYYY-MM-DD'), '12345678');
INSERT INTO AnimalAdmits (animalID, breed, animalName, age, dateAdmit, branchID) 
    VALUES ('4', 'Siamese Cat', 'Biscuit', 2, TO_DATE('2022-7-31', 'YYYY-MM-DD'), '12345678');
INSERT INTO AnimalAdmits (animalID, breed, animalName, age, dateAdmit, branchID) 
    VALUES ('5', 'French Bulldog', 'Sasha', 12, TO_DATE('2022-8-31', 'YYYY-MM-DD'), '12345678');

-- -- Vaccination(vacType: varchar[200], vacDate: date, animalID: varchar[8])
INSERT INTO Vaccination (vacType,vacDate,animalID) VALUES ('Rabies', TO_DATE('2022-10-1', 'YYYY-MM-DD'), '1');
INSERT INTO Vaccination (vacType,vacDate,animalID) VALUES ('Flu', TO_DATE('2022-10-2', 'YYYY-MM-DD'), '2');
INSERT INTO Vaccination (vacType,vacDate,animalID) VALUES ('Rabies', TO_DATE('2022-10-3', 'YYYY-MM-DD'), '1');
INSERT INTO Vaccination (vacType,vacDate,animalID) VALUES ('Rabies', TO_DATE('2022-10-4', 'YYYY-MM-DD'), '1');
INSERT INTO Vaccination (vacType,vacDate,animalID) VALUES ('Rabies', TO_DATE('2022-10-5', 'YYYY-MM-DD'), '2');


-- Adopters(adopterID: varchar[8], lastName: varchar[200], firstName: varchar[200], phoneNum: varchar[10])
INSERT INTO Adopters(adopterID, lastName, firstName, phoneNum) 
		VALUES('100', 'Smith', 'John', '6043121111');
INSERT INTO Adopters(adopterID, lastName, firstName, phoneNum) 
		VALUES('101', 'Smythe', 'Jon', '6043121112');
INSERT INTO Adopters(adopterID, lastName, firstName, phoneNum) 
		VALUES('102', 'Adams', 'Gerald', '6043121113');
INSERT INTO Adopters(adopterID, lastName, firstName, phoneNum) 
		VALUES('103', 'Lillard', 'Leslie', '6043121114');
INSERT INTO Adopters(adopterID, lastName, firstName, phoneNum) 
		VALUES('104', 'Rapport', 'Rita', '6043121115');
        
-- Attends(donorID: varchar[8], attendsLocation: varchar[200], attendsDate: date, title: varchar[200])
INSERT INTO Attends (donorID, attendsLocation, attendsDate, title) VALUES ('1', 'New Brighton Park', TO_DATE('2021-03-04', 'YYYY-MM-DD'), 'Furry Friends Fair');
INSERT INTO Attends (donorID, attendsLocation, attendsDate, title) VALUES ('2', 'New Brighton Park', TO_DATE('2021-03-04', 'YYYY-MM-DD'), 'Furry Friends Fair');
INSERT INTO Attends (donorID, attendsLocation, attendsDate, title) VALUES ('3', 'New Brighton Park', TO_DATE('2021-03-04', 'YYYY-MM-DD'), 'Furry Friends Fair');
INSERT INTO Attends (donorID, attendsLocation, attendsDate, title) VALUES ('4', 'New Brighton Park', TO_DATE('2021-03-04', 'YYYY-MM-DD'), 'Furry Friends Fair');
INSERT INTO Attends (donorID, attendsLocation, attendsDate, title) VALUES ('5', 'New Brighton Park', TO_DATE('2021-03-04', 'YYYY-MM-DD'), 'Furry Friends Fair');

-- Donates(donorID: varchar[8], branchID: varchar[8], date: date, amount: float)
INSERT INTO Donates (donorID, branchID, donationDate, amount) VALUES ('1' ,'12345678', TO_DATE('2008-07-12', 'YYYY-MM-DD'), '3000.00');
INSERT INTO Donates (donorID, branchID, donationDate, amount) VALUES ('2', '12345679', TO_DATE('2021-10-1', 'YYYY-MM-DD'), '100.00');
INSERT INTO Donates (donorID, branchID, donationDate, amount) VALUES ('3', '12345680', TO_DATE('2000-09-20', 'YYYY-MM-DD'), '500.00');
INSERT INTO Donates (donorID, branchID, donationDate, amount) VALUES ('4', '12345681', TO_DATE('2020-11-08', 'YYYY-MM-DD'), '50.00');
INSERT INTO Donates (donorID, branchID, donationDate, amount) VALUES ('5', '12345682', TO_DATE('2022-02-14', 'YYYY-MM-DD'), '888.88');

-- Plans(location: varchar[200], plansDate: date, title: varchar[200], branchID: varchar[8])
INSERT INTO Plans (plansLocation, plansDate, title, branchID) 
    VALUES ('Stanley Park', TO_DATE('2023-07-15', 'YYYY-MM-DD'), 'PetPalooza','12345678');
INSERT INTO Plans (plansLocation,plansDate,title,branchID) 
    VALUES ('New Brighton Park', TO_DATE('2021-03-04', 'YYYY-MM-DD'), 'Furry Friends Fair','12345679');
INSERT INTO Plans (plansLocation,plansDate,title,branchID) 
    VALUES ('Olympic Oval', TO_DATE('2022-05-15', 'YYYY-MM-DD'), 'Strut for Strays 5K','12345678');
INSERT INTO Plans (plansLocation,plansDate,title,branchID)
    VALUES ('Vancouver Art Gallery', TO_DATE('2025-09-15', 'YYYY-MM-DD'), 'Paws and Painting Night','12345679');
INSERT INTO Plans (plansLocation,plansDate,title,branchID) 
    VALUES ('Queen Elizabeth Park', TO_DATE('2022-10-31', 'YYYY-MM-DD'), 'Barktoberfest','12345680');

-- Employs(staffID: varchar[8], branchID: varchar[8], contractID: varchar[8])
INSERT INTO Employs(staffID,branchID,contractID) VALUES ('00000000','12345678', '1');
INSERT INTO Employs(staffID,branchID,contractID) VALUES ('00000001','12345678', '2');
INSERT INTO Employs(staffID,branchID,contractID) VALUES ('00000002','12345678', '3');
INSERT INTO Employs(staffID,branchID,contractID) VALUES ('00000003','12345678', '4');
INSERT INTO Employs(staffID,branchID,contractID) VALUES ('00000004','12345679', '5');
INSERT INTO Employs(staffID,branchID,contractID) VALUES ('00000005','12345679', '6');
INSERT INTO Employs(staffID,branchID,contractID) VALUES ('00000006','12345679', '7');
INSERT INTO Employs(staffID,branchID,contractID) VALUES ('00000007','12345679', '8');
INSERT INTO Employs(staffID,branchID,contractID) VALUES ('00000008','12345679', '9');
INSERT INTO Employs(staffID,branchID,contractID) VALUES ('00000009','12345678', '10');

-- Applies(branchID: varchar[8], adopterID: varchar[8], animalID: varchar[8], applicationStatus: varchar[200], applicationDate: date)
INSERT INTO Applies(branchID, adopterID, animalID, applicationStatus, applicationDate) 
		VALUES('12345678', '100', '1', 'Pending', TO_DATE('2021-11-12', 'YYYY-MM-DD'));
INSERT INTO Applies(branchID, adopterID, animalID, applicationStatus, applicationDate) 
		VALUES('12345678', '101', '1', 'Rejected', TO_DATE('2020-05-31', 'YYYY-MM-DD'));
INSERT INTO Applies(branchID, adopterID, animalID, applicationStatus, applicationDate) 
		VALUES('12345678', '102', '1', 'Rejected', TO_DATE('2022-10-31', 'YYYY-MM-DD'));
INSERT INTO Applies(branchID, adopterID, animalID, applicationStatus, applicationDate) 
		VALUES('12345678', '103', '1', 'Pending', TO_DATE('2021-10-31', 'YYYY-MM-DD'));
INSERT INTO Applies(branchID, adopterID, animalID, applicationStatus, applicationDate) 
    VALUES('12345678', '104', '1', 'Accepted', TO_DATE('2020-9-30', 'YYYY-MM-DD'));


