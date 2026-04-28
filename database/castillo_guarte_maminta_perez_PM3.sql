-- SCHEMA




CREATE SCHEMA LTOIMS;

USE LTOIMS;

CREATE TABLE driver(
	driverno CHAR(13) NOT NULL,
	licno CHAR(13) NOT NULL,
	address VARCHAR(100) NOT NULL,
	birthdate DATE NOT NULL,
	lictype	VARCHAR(20) NOT NULL,
	licstatus VARCHAR(20) NOT NULL,
	fname VARCHAR(30) NOT NULL,
	mname VARCHAR(30),
	lname VARCHAR(30) NOT NULL,
	sex VARCHAR(6) NOT NULL,
	licexpiration DATE NOT NULL,
	CONSTRAINT driver_driverno_pk PRIMARY KEY (driverno),
	CONSTRAINT driver_licno_uk UNIQUE (licno)
);

CREATE TABLE vehicle(
	chassisno CHAR(17) NOT NULL,
	engineno CHAR(20) NOT NULL,
	plateno CHAR(8)	NOT NULL,
	color VARCHAR(20) NOT NULL,
	myear DATE NOT NULL,
	vehicletype VARCHAR(30) NOT NULL,
	model VARCHAR(30) NOT NULL,
	make VARCHAR(30) NOT NULL,
	driverno CHAR(13) NOT NULL,
	CONSTRAINT vehicle_chassisno_pk PRIMARY KEY (chassisno),
	CONSTRAINT vehicle_engineno_uk UNIQUE (engineno),
	CONSTRAINT vehicle_plateno_uk UNIQUE (plateno),
	CONSTRAINT vehicle_driverno_fk FOREIGN KEY (driverno) REFERENCES driver(driverno)
);

CREATE TABLE traffic_violation(
	violationno CHAR(13) NOT NULL,
	violationtype VARCHAR(30) NOT NULL,
	violationdate DATE NOT NULL,
	violationloc VARCHAR(100) NOT NULL,
	fineamount DOUBLE NOT NULL,
	appofficer VARCHAR(100),
	violationstatus VARCHAR(20) NOT NULL,
	driverno CHAR(13) NOT NULL,
	chassisno CHAR(17) NOT NULL,
	CONSTRAINT traffic_violation_violationno_pk PRIMARY KEY (violationno),
	CONSTRAINT traffic_violation_driverno_fk FOREIGN KEY (driverno) REFERENCES driver(driverno),
	CONSTRAINT traffic_violation_chassisno_fk FOREIGN KEY (chassisno) REFERENCES vehicle(chassisno)
);

CREATE TABLE vehicle_registration(
	registrationno CHAR(8) NOT NULL,
	regstrationdate DATE NOT NULL,
	expirationdate DATE NOT NULL,
	registrationstatus VARCHAR(20) NOT NULL,
	chassisno CHAR(17) NOT NULL,
	CONSTRAINT vehicle_registration_registrationno_pk PRIMARY KEY (registrationno),
	CONSTRAINT vehicle_registration_chassisno_fk FOREIGN KEY (chassisno) REFERENCES vehicle(chassisno)
);




-- DATA




-- sample data for existing database schema "127_milestone3_schema.sql"

-- DRIVERS
INSERT INTO driver VALUES
('D000000000001','LIC000000001','Quezon City, Metro Manila','1995-06-15','Non-Professional','valid','Juan','Santos','Dela Cruz','Male','2027-06-15'),
('D000000000002','LIC000000002','Los Banos, Laguna','1988-03-22','Professional','valid','Maria','Reyes','Santos','Female','2026-03-22'),
('D000000000003','LIC000000003','Cebu City, Cebu','2002-11-10','Student Permit','valid','Carlos',NULL,'Garcia','Male','2025-11-10'),
('D000000000004','LIC000000004','Davao City, Davao del Sur','1975-01-05','Professional','suspended','Ana','Lopez','Torres','Female','2024-01-05'),
('D000000000005','LIC000000005','Baguio City, Benguet','1990-09-30','Non-Professional','expired','Mark','Diaz','Flores','Male','2023-09-30'),
('D000000000006','LIC000000006','Iloilo City, Iloilo','1985-02-18','Professional','valid','Jose','Cruz','Ramirez','Male','2027-02-18'),
('D000000000007','LIC000000007','Pasig City, Metro Manila','1998-12-01','Non-Professional','valid','Liza','Morales','Tan','Female','2026-12-01'),
('D000000000008','LIC000000008','Makati City, Metro Manila','1993-07-25','Professional','revoked','Paolo','Rivera','Gomez','Male','2024-07-25'),
('D000000000009','LIC000000009','Taguig City, Metro Manila','2000-04-14','Student Permit','valid','Ella','Santos','Lim','Female','2025-04-14'),
('D000000000010','LIC000000010','Cagayan de Oro, Misamis Oriental','1982-08-09','Professional','expired','Ramon','Uy','Chua','Male','2023-08-09');

-- VEHICLES
INSERT INTO vehicle VALUES
('CHASSIS000000001','ENGINE000000001','ABC1234','Red','2018-01-01','private car','Vios','Toyota','D000000000001'),
('CHASSIS000000002','ENGINE000000002','XYZ5678','Blue','2020-01-01','motorcycle','Click 125','Honda','D000000000001'),
('CHASSIS000000003','ENGINE000000003','JKL4321','White','2015-01-01','public utility vehicle','Jeepney','Isuzu','D000000000002'),
('CHASSIS000000004','ENGINE000000004','MNO8765','Black','2019-01-01','private car','Fortuner','Toyota','D000000000003'),
('CHASSIS000000005','ENGINE000000005','QRS1357','Green','2017-01-01','motorcycle','NMAX','Yamaha','D000000000004'),
('CHASSIS000000006','ENGINE000000006','TUV2468','Silver','2021-01-01','private car','Civic','Honda','D000000000006'),
('CHASSIS000000007','ENGINE000000007','WXY9753','Yellow','2016-01-01','public utility vehicle','UV Express','Toyota','D000000000007'),
('CHASSIS000000008','ENGINE000000008','AAA1111','Black','2022-01-01','motorcycle','Raider 150','Suzuki','D000000000008'),
('CHASSIS000000009','ENGINE000000009','BBB2222','White','2014-01-01','private car','Altis','Toyota','D000000000009'),
('CHASSIS000000010','ENGINE000000010','CCC3333','Blue','2013-01-01','public utility vehicle','Bus','Hyundai','D000000000010');

-- TRAFFIC VIOLATIONS
INSERT INTO traffic_violation VALUES
('V000000000001','overspeeding','2024-05-10','Quezon City, Metro Manila',1500,'Officer Reyes','unpaid','D000000000001','CHASSIS000000001'),
('V000000000002','reckless driving','2024-06-12','Los Banos, Laguna',2000,'Officer Cruz','paid','D000000000002','CHASSIS000000003'),
('V000000000003','illegal parking','2024-07-01','Cebu City, Cebu',500,NULL,'unpaid','D000000000003','CHASSIS000000004'),
('V000000000004','overspeeding','2023-12-20','Davao City, Davao del Sur',1500,'Officer Lim','contested','D000000000004','CHASSIS000000005'),
('V000000000005','reckless driving','2024-01-15','Baguio City, Benguet',2000,'Officer Tan','paid','D000000000005','CHASSIS000000002'),
('V000000000006','illegal parking','2024-03-10','Iloilo City, Iloilo',500,NULL,'unpaid','D000000000006','CHASSIS000000006'),
('V000000000007','overspeeding','2024-02-18','Pasig City, Metro Manila',1500,'Officer Cruz','paid','D000000000007','CHASSIS000000007'),
('V000000000008','reckless driving','2024-04-22','Makati City, Metro Manila',2000,'Officer Reyes','unpaid','D000000000008','CHASSIS000000008'),
('V000000000009','illegal parking','2024-06-30','Taguig City, Metro Manila',500,NULL,'contested','D000000000009','CHASSIS000000009'),
('V000000000010','overspeeding','2024-07-05','Cagayan de Oro, Misamis Oriental',1500,'Officer Lim','paid','D000000000010','CHASSIS000000010');

-- VEHICLE REGISTRATION
INSERT INTO vehicle_registration VALUES
('REG00001','2024-01-01','2025-01-01','active','CHASSIS000000001'),
('REG00002','2023-01-01','2024-01-01','expired','CHASSIS000000002'),
('REG00003','2024-03-15','2025-03-15','active','CHASSIS000000003'),
('REG00004','2022-06-01','2023-06-01','expired','CHASSIS000000004'),
('REG00005','2024-07-01','2025-07-01','active','CHASSIS000000005'),
('REG00006','2024-02-01','2025-02-01','active','CHASSIS000000006'),
('REG00007','2023-05-01','2024-05-01','expired','CHASSIS000000007'),
('REG00008','2024-08-01','2025-08-01','active','CHASSIS000000008'),
('REG00009','2022-09-01','2023-09-01','expired','CHASSIS000000009'),
('REG00010','2024-10-01','2025-10-01','active','CHASSIS000000010');




-- REPORTS




-- 1) View all registered drivers filtered by: License type, License status, Age range, Sex
SELECT 
    d.driverno,
    CONCAT(d.fname, ' ', COALESCE(CONCAT(d.mname, ' '), ''), d.lname) AS full_name,
    d.birthdate,
    TIMESTAMPDIFF(YEAR, d.birthdate, CURDATE()) AS age,
    d.sex,
    d.address,
    d.licno,
    d.lictype,
    d.licstatus,
    d.licexpiration
FROM driver d
WHERE d.lictype = 'Professional'
  AND d.licstatus = 'valid'
  AND d.sex = 'Female'
  AND TIMESTAMPDIFF(YEAR, d.birthdate, CURDATE()) BETWEEN 18 AND 60
ORDER BY d.lname, d.fname;


-- 2) View all vehicles owned by a given driver (using driverno)
SELECT
    d.driverno,
    CONCAT(d.fname, ' ', COALESCE(CONCAT(d.mname, ' '), ''), d.lname) AS owner_name,
    v.chassisno,
    v.engineno,
    v.plateno,
    v.vehicletype,
    v.make,
    v.model,
    YEAR(v.myear) AS model_year,
    v.color
FROM driver d
JOIN vehicle v
    ON d.driverno = v.driverno
WHERE d.driverno = 'D000000000001'
ORDER BY v.plateno;


-- 3) View all vehicles with expired registrations as of a given date
SELECT
    v.plateno,
    v.chassisno,
    v.engineno,
    v.vehicletype,
    v.make,
    v.model,
    YEAR(v.myear) AS model_year,
    v.color,
    vr.registrationno,
    vr.regstrationdate,
    vr.expirationdate,
    vr.registrationstatus,
    CONCAT(d.fname, ' ', COALESCE(CONCAT(d.mname, ' '), ''), d.lname) AS owner_name
FROM vehicle_registration vr
JOIN vehicle v
    ON vr.chassisno = v.chassisno
JOIN driver d
    ON v.driverno = d.driverno
WHERE vr.expirationdate < '2025-01-01'          -- sample date
ORDER BY vr.expirationdate ASC, v.plateno;


-- 4) View all drivers with expired or suspended licenses
SELECT
    d.driverno,
    CONCAT(d.fname, ' ', COALESCE(CONCAT(d.mname, ' '), ''), d.lname) AS full_name,
    d.licno,
    d.lictype,
    d.licstatus,
    d.licexpiration,
    d.address,
    d.sex,
    d.birthdate
FROM driver d
WHERE d.licstatus IN ('expired', 'suspended')
   OR d.licexpiration < CURDATE()
ORDER BY d.licstatus, d.licexpiration, d.lname, d.fname;


-- 5) View all traffic violations committed by a given driver within a specified date range (by driverno)
SELECT
    tv.violationno,
    tv.violationtype,
    tv.violationdate,
    tv.violationloc,
    tv.fineamount,
    tv.appofficer,
    tv.violationstatus,
    v.plateno,
    v.vehicletype,
    v.make,
    v.model,
    CONCAT(d.fname, ' ', COALESCE(CONCAT(d.mname, ' '), ''), d.lname) AS driver_name
FROM traffic_violation tv
JOIN driver d
    ON tv.driverno = d.driverno
JOIN vehicle v
    ON tv.chassisno = v.chassisno
WHERE d.driverno = 'D000000000001'
  AND tv.violationdate BETWEEN '2024-01-01' AND '2024-12-31'            -- sample date range
ORDER BY tv.violationdate, tv.violationno;


-- 6) View the total number of violations per violation type for a given year
SELECT
    YEAR(tv.violationdate) AS violation_year,
    tv.violationtype,
    COUNT(*) AS total_violations
FROM traffic_violation tv
WHERE YEAR(tv.violationdate) = 2024             -- example for year 2024
GROUP BY YEAR(tv.violationdate), tv.violationtype
ORDER BY total_violations DESC, tv.violationtype;


-- 7) View all vehicles involved in violations within a given city or region
SELECT DISTINCT
    v.plateno,
    v.chassisno,
    v.engineno,
    v.vehicletype,
    v.make,
    v.model,
    YEAR(v.myear) AS model_year,
    v.color,
    CONCAT(d.fname, ' ', COALESCE(CONCAT(d.mname, ' '), ''), d.lname) AS owner_name,
    tv.violationloc
FROM traffic_violation tv
JOIN vehicle v
    ON tv.chassisno = v.chassisno
JOIN driver d
    ON v.driverno = d.driverno
WHERE tv.violationloc LIKE '%Metro Manila%'             -- sample city/region
ORDER BY v.plateno;