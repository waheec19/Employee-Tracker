USE employee_managerDB;

INSERT INTO department(name)
VALUES ("Sales"),("IT"),("Finance"),("Legal"),("Communication");

SELECT * FROM department;

INSERT INTO role(title,salary,department_id)
VALUES 
("Sales Coordinator",40000.00,1),
("Sales Lead",65000.00,1),
("Sales Manager",80000.00,1),
("Helpdesk Agent",40000.00,2),
("Senior Engineer",85000.00,2),
("Lead Engineer",110000.00,2),
("Accounts Coordinator",55000.00,3),
("Accounts Manager",80000.00,3),
("Associate Counsel",80000.00,4),
("Lead Counsel",180000.00,4),
("Human Resource Specialist",50000.00,5),
("Media Planner",90000.00,5);

SELECT * FROM role;

SELECT 
	department.id,
	department.name,
    role.id ,
    role.title,
    role.salary
FROM department 
	INNER JOIN role on role.department_id = department.id
ORDER BY department.id, role.salary ASC;

INSERT INTO employee(first_name, last_name,role_id)
VALUES
("John","Wick",1),
("Charlie","Kelly",2),
("Homer","Simpson",3),
("Dwight","Schrute",4),
("Sandy","Cheeks",4),
("Nikola","Tesla",5),
("Anne","Hathaway",6),
("Hard","Blastcheese",7),
("Tex","Avery",8),
("JoAnn","Fabric",8),
("Holly", "Golightly",9);

SELECT * FROM employee;

UPDATE employee SET manager_id = 2 WHERE id = 1;
UPDATE employee SET manager_id = 3 WHERE id = 2;
UPDATE employee SET manager_id = 7 WHERE id = 4;
UPDATE employee SET manager_id = 7 WHERE id = 5;
UPDATE employee SET manager_id = 7 WHERE id = 6;
UPDATE employee SET manager_id = 11 WHERE id = 8;
UPDATE employee SET manager_id = 11 WHERE id = 9;
UPDATE employee SET manager_id = 11 WHERE id = 10;

SELECT * FROM employee;

SELECT
	employee.first_name,
    employee.last_name,
    department.name,
    role.title    
FROM employee 
	INNER JOIN role on role.id = employee.role_id
    INNER JOIN department on department.id = role.department_id
ORDER BY employee.id;



SELECT DISTINCT 
emp1.id,
concat(emp1.first_name, ' ', emp1.last_name) AS Employee,
ro1.title AS Job_Title,
dep1.name AS Department,
ro1.salary,
concat(man1.first_name, ' ', man1.last_name) AS Manager_Name 
FROM employee emp1
INNER JOIN role ro1 ON ro1.id = emp1.role_id 
INNER JOIN department dep1 ON ro1.department_id = dep1.id 
LEFT JOIN employee man1 ON emp1.manager_id = man1.id
JOIN employee emp2 ON ro1.id = emp2.role_id ORDER BY id;


SELECT 
department.name AS Department, sum(salary) AS Payroll_Total
FROM employee_managerdb.employee 
INNER JOIN employee_managerdb.ROLE ON role.id = employee.role_id 
INNER JOIN employee_managerdb.department ON role.department_id = department.id 
GROUP BY department.name;

SELECT 
role.title AS Title, name AS Department, role.salary AS Salary
FROM employee_managerDB.department 
INNER JOIN employee_managerdb.role ON employee_managerdb.department.id = employee_managerDB.role.department_id