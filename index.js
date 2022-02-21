const fs = require('fs');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();
const mysql = require('mysql2');
const Employee = require('./class/Employee');



// const connection = mysql.createConnection(
//     {
//         host: 'localhost',
//         user: process.env.USER_DB,
//         password: process.env.PASSWORD_DB,
//         database: process.env.NAME_DB
//     },
//     console.log(`Connected to the company_db database.`)
// );


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
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Enter salary: ',
    }
]

addEmployeeName = [
    {
        type: 'input',
        name: 'fname',
        message: 'Enter first name: ',
    },
    {
        type: 'input',
        name: 'lname',
        message: 'Enter last name: ',
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
            const sql = `INSERT INTO department (name) VALUES (?);`;
            connection.query(sql, newDept.department, (err, data) => {
                if (err) throw err;
                console.log(`New department created!`);
                queryDepartments();
            });

            console.log(newDept);
            main();
            break;

        case 'Add a Role':

            const newRole = await inquirer.prompt(addRole);

            console.log(newRole);
            main();
            break;

        case 'Add an Employee':

            //const employeeName = await inquirer.prompt(addEmployeeName);

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