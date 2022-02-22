const fs = require('fs');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();
const mysql = require('mysql2');
const Employee = require('./class/Employee');

var connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});



mainMenu = [

    {
        type: 'list',
        name: 'mainMenu',
        message: "Selection Menu ",
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'EXIT']
    }

]

addDepartment = [
    {
        type: 'input',
        name: 'department',
        message: 'Enter NEW deparment name: ',
        validate: input => {
            if (input) {
                return true;
            } else {
                console.log("Please enter department name.");
                return false;
            }
        }
    }

]

addRole = [
    {
        type: 'input',
        name: 'title',
        message: 'Enter new title: ',
        validate: input => {
            if (input) {
                return true;
            } else {
                console.log("Please enter title!");
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Enter salary: ',
        validate: input => {
            if (input) {
                return true;
            } else {
                console.log("Please enter salary!");
                return false;
            }
        }
    }
]


addEmployeeName = [
    {
        type: 'input',
        name: 'fname',
        message: 'Enter first name: ',
        validate: input => {
            if (input) {
                return true;
            } else {
                console.log("Please enter first name!");
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'lname',
        message: 'Enter last name: ',
        validate: input => {
            if (input) {
                return true;
            } else {
                console.log("Please enter last name!");
                return false;
            }
        }
    }
]

addEmployeeRole = [
    {
        type: 'list',
        name: 'role',
        message: "Enter new role: ",
        // choices: roles
    }
]

addEmployeeManager = [
    {
        type: 'list',
        name: 'manager',
        message: "Enter manager's name: ",
        //choices: managers
    }

]

const queryDepartments = () => {
    console.log('\r\n\r\n\r\n\r\n');  // Provides gap between displays
    const query = `SELECT department.id AS ID,
     department.name AS Department
     FROM department;`;
    connection.query(query, (err, rows) => {
        if (err) throw err;
        console.log('\r\n\r\n\r\n\r\n\n\n\n\n\n\n');  // Provides gap between displays
        console.table(rows);
        console.log('Press UP or DOWM key to continue.....');
    });
};

const queryRoles = () => {
    const query = `SELECT role.id AS ID,
    role.title AS Title
    FROM role;`;
    connection.query(query, (err, roles) => {
        if (err) throw err;
        console.log('\r\n\r\n\r\n\r\n');  // Provides gap between displays
        console.table(roles);
        console.log('Press UP or DOWM key to continue.....');

    });
};

const queryEmployees = () => {
    console.log('\r\n\r\n\r\n\r\n');  // Provides gap between displays
    const query = `SELECT employee.id AS ID, 
    CONCAT (employee.first_name, " ", employee.last_name) AS Name,
    role.title AS Title, 
    department.name AS Department,
    role.salary AS Salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS Manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;`;
    connection.query(query, (err, employees) => {
        if (err) throw err;
        console.log('\r\n\r\n\r\n\r\n');  // Provides gap between displays
        console.table(employees);
        console.log('Press UP or DOWM key to continue.....');
    });
};


async function getRole() {

    const newRole = await inquirer.prompt(addRole);
    let arg = [newRole.title, newRole.salary];
    const deptQuery = `SELECT id, name FROM department`;
    connection.query(deptQuery, async (err, data) => {
        if (err) throw err;
        console.log('The data is ', data);
        let department = data.map(function (element) { return `${element.id} ${element.name}`; })
        console.log('The department is ', department);
        inquirer.prompt([
            {
                type: "list",
                name: "departmentid",
                message: "Select department: ",
                choices: department
            }])
            .then((data) => {

                const string = data.departmentid;
                console.log(string);
                const array = string.split(' ');
                let department_id = array[0];
                arg.push(department_id);
                console.log(arg);


                const query = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;
                connection.query(query, arg, (err, rows) => {
                    if (err) throw err;
                    console.log(`New role created!`);
                    queryRoles();
                });
            });

    });

}

async function main() {
    let mainMenuChoice = await inquirer.prompt(mainMenu);

    switch (mainMenuChoice.mainMenu) {
        case 'View All Departments':

            queryDepartments();
            main();
            break;

        case 'View All Roles':

            queryRoles();
            main();
            break;

        case 'View All Employees':

            queryEmployees();
            main();
            break;

        case 'Add a Department':

            const newDept = await inquirer.prompt(addDepartment);
            const deptQuery = `INSERT INTO department (name) VALUES (?);`;
            connection.query(deptQuery, newDept.department, (err, data) => {
                if (err) throw err;
                console.log(`New department created!`);
                queryDepartments();
            });

            main();
            break;

        case 'Add a Role':

            const add_Role = await getRole();
            main();
            break;

        case 'Add an Employee':

            const employeeName = await inquirer.prompt(addEmployeeName);
            let params = [employeeName.fname, employeeName.lname];

            console.log(params);

            const roleQuery = 'SELECT * FROM role';
            connection.query(roleQuery, (err, data) => {
                if (err) throw err;
                const roles = data.map(({ title, id }) => ({ name: title, value: id }));
                // roles as a list will be used as a selection for the roleid in then inquirer
                inquirer.prompt([
                    {
                        type: "list",
                        name: "roleid",
                        message: "Select corresponding role:  ",
                        choices: roles
                    }
                ]).then((data) => {
                    params.push(data.roleid);
                    console.log(params);
                });





            });




            //const newEmployee = new Employee(employeeName.fname, employeeName.lname, employee.role, employee.manager);
            //console.log(newEmployee);
            main();
            break;

        case 'Update an Employee Role':
            main();
            break;
        default:
            console.log('\r\n\r\n\r\n\r\n\n\n\n\n\n\n')
            connection.end();
    }

}

main();