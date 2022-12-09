const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");



const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Wc236744#',
    database: "employee_managerDB"
});

connection.connect(function(err) {
    if (err) throw err;
    runQuestions();
});

function runQuestions() {
    inquirer
      .prompt({
          name: "action",
          type: "rawlist",
          message: "What would you like to do?",
          choices: [
              "View employees",
              "View departments",
              "View roles",
              "Add employee",
              "Add department",
              "Add role",
              "Update employee role",
              "Exit"
            ],
      })
      .then(function(answer) {
          switch (answer.action) {
              case "View employees":
                  viewEmployee();
                  break;

              case "View departments":
                  viewDepartments();
                  break;

              case "View roles":
                  viewRoles();
                  break;

              case "Add employee":
                  addEmployee();
                  break;

              case "Add department":
                  addDepartment();
                  break;

              case "Add role":
                  addRole();
                  break;

              case "Update employee role":
                  updateRole();
                  break;

              case "Exit":
                  connection.end();
                  break;
          }
      });
}

function addEmployee() {
    connection.query("SELECT title FROM employee_managerDB.role;", function(err, res) {
        if (err) throw err;
        let roleArr = [];
        inquirer
          .prompt([
              {
                  name: "role",
                  type: "rawlist",
                  choices: function() {
                      for (let i = 0; i < res.length; i++) {
                          roleArr.push(res[i].title);
                      }
                      return roleArr;
                  },
                  message: "What is the employee's role?"
              },
              {
                  name: "firstname",
                  type: "input",
                  message: "What is the employee's first name?",
              },
              {
                  name: "lastname",
                  type: "input",
                  message: "What is the employee's last name?"
              },
              {
                  name: "manager",
                  type: "number",
                  message: "What is the employee's manager's ID#?"
              }
          ])
          .then(function(answer) {
              connection.query("INSERT INTO employee SET ?",
              {
                  first_name: answer.firstname,
                  last_name: answer.lastname,
                  role_id: roleArr.indexOf(answer.role)+1,
                  manager_id: answer.manager
              });
              runQuestions();
          });
    });
}

function viewEmployee() {
    let query = "SELECT DISTINCT emp1.id, concat(emp1.first_name, ' ', emp1.last_name) AS Employee, ro1.title AS Job_Title, ";
    query += "dep1.name AS Department, ro1.salary, concat(man1.first_name, ' ', man1.last_name) AS Manager_Name FROM employee emp1 ";
    query += "INNER JOIN role ro1 ON ro1.id = emp1.role_id INNER JOIN department dep1 ON ro1.department_id = dep1.id LEFT JOIN employee man1 ";
    query += "ON emp1.manager_id = man1.id INNER JOIN employee emp2 ON ro1.id = emp2.role_id ORDER BY id";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runQuestions();
    });
}

function addDepartment() {
inquirer
    .prompt(
        {
            name: "dept",
            type: "input",
            message: "What is the name of the new department you'd like to add?"
        }
    ).then(function(answer) {
        let query = "INSERT INTO department SET ?"
        connection.query(query, { name: answer.dept }, function(err) {
            if (err) throw err;
            runQuestions();
        });
    });
}

function viewDepartments() {
    let query = "SELECT name AS Department, sum(salary) AS Payroll_Total FROM employee_managerdb.employee "
    query += "INNER JOIN employee_managerdb.ROLE ON role.id = employee.role_id "
    query += "INNER JOIN employee_managerdb.department ON role.department_id = department.id GROUP BY department.name;";

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        runQuestions();
    });
}

function addRole() {
    let query = "SELECT name FROM employee_managerDB.department";

    connection.query(query, function(err, res) {
        if (err) throw err;
        let deptARR = [];

        inquirer
            .prompt([
                {
                    name: "dept",
                    type: "rawlist",
                    choices: function() {
                        for(let i = 0; i < res.length; i++) {
                            deptARR.push(res[i].name);
                        }
                    return deptARR;
                    },
                    message: "What department would you like to add the new role to?"
                },
                {
                    name: "role",
                    type: "input",
                    message: "What is the name of the new role?"
                },
                {
                    name: "salary",
                    type: "number",
                    message: "What is the base salary for the new role?"
                }
            ]).then(function(answer) {
                let query = "INSERT INTO role SET ?";
                connection.query(query, {
                    title: answer.role,
                    salary: answer.salary,
                    department_id: deptARR.indexOf(answer.dept)+1
                }, function(err) {
                    if (err) throw err;
                    runQuestions();
                });
            });
    });
}

function viewRoles() {
let query = "SELECT role.title AS Title, name AS Department, role.salary AS Salary FROM employee_managerDB.department ";
query += "INNER JOIN employee_managerdb.role ON employee_managerdb.department.id = employee_managerDB.role.department_id;";

connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    runQuestions();
})
}

function updateRole() {
    let query = "SELECT DISTINCT emp1.id, concat(emp1.first_name, ' ', emp1.last_name) AS Employee, ro1.title AS Job_Title, ";
    query += "dep1.name AS Department, ro1.salary, concat(man1.first_name, ' ', man1.last_name) AS Manager_Name FROM employee emp1 ";
    query += "INNER JOIN role ro1 ON ro1.id = emp1.role_id INNER JOIN department dep1 ON ro1.department_id = dep1.id LEFT JOIN employee man1 ";
    query += "ON emp1.manager_id = man1.id INNER JOIN employee emp2 ON ro1.id = emp2.role_id ORDER BY id";

    connection.query(query, function(err, res) {
        if (err) throw err;
        let empArr = [];
        let roleArr = [];
        inquirer
            .prompt([
                {
                    name: "updatedEmp",
                    type: "list",
                    choices: function() {
                        for (let i = 0; i < res.length; i++) {
                            empArr.push(res[i].Employee)
                        }
                        return empArr;
                    },
                    message: "Which employee would you like to update role for?"
                },
                {
                    name: "updatedRole",
                    type: "list",
                    choices: function() {
                        for (let i = 0; i < res.length; i++) {
                            roleArr.push(res[i].Job_Title)
                        }
                        return roleArr;
                    },
                    message: "Choose new role"
                }
            ])
            .then(function(answer) {
                connection.query("UPDATE role SET title = ? WHERE id = ?", [answer.updatedRole, empArr.indexOf(answer.updatedEmp)+1]);
                runQuestions();
            })
    })

}