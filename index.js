const fs = require('fs');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();
const mysql = require('mysql2');


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
    }
]

addRole = [
    {
        type: 'input',
        name: 'name',
        message: 'Enter name: ',
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Enter salary: ',
    },
    {
        type: 'input',
        name: 'role',
        message: "Enter new role: ",

    }

]

addEmployee = [
    {
        type: 'input',
        name: 'fname',
        message: 'Enter first name: ',
    },
    {
        type: 'input',
        name: 'lname',
        message: 'Enter last name: ',
    },
    {
        type: 'input',
        name: 'role',
        message: "Enter new role: ",
    },
    {
        type: 'input',
        name: 'manager',
        message: "Enter manager's name: ",
    }

]

const queryDepartments = () => {
    const sql = `SELECT department.id AS ID,
     department.name AS Department
     FROM department;`;
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.log('\r\n');
        console.table(rows);
        console.log('Press UP or DOWM key to continue.....');
    });
};

const queryRoles = () => {
    const sql = `SELECT role.id AS ID,
    role.title AS Title
    FROM role;`;
    connection.query(sql, (err, roles) => {
        if (err) throw err;
        console.log('\r\n');
        console.table(roles);
        console.log('Press UP or DOWM key to continue.....');

    });
};



const queryEmployees = () => {
    const sql = `SELECT employee.id AS ID, 
    CONCAT (employee.first_name, " ", employee.last_name) AS Name,
    role.title AS Title, 
    department.name AS Department,
    role.salary AS Salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS Manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;`;
    connection.query(sql, (err, employees) => {
        if (err) throw err;
        console.log('\r\n');
        console.table(employees);
        console.log('Press UP or DOWM key to continue.....');
    });
};

async function main() {
    let mainMenuChoice = await inquirer.prompt(mainMenu);

    switch (mainMenuChoice.mainMenu) {
        case 'View All Departments':
            const sqlDept = await queryDepartments();
            process.stdout.write("\u001b[2J\u001b[0;0H");
            main();
            break;

        case 'View All Roles':
            const sqlRoles = await queryRoles();
            process.stdout.write("\u001b[2J\u001b[0;0H");
            main();
            break;
        case 'View All Employees':
            const sqlEmployees = await queryEmployees();
            process.stdout.write("\u001b[2J\u001b[0;0H");
            main();
            break;
        case 'Add a Department':
            // code block
            const newDept = await inquirer.prompt(addDepartment);
            console.log(newDept);
            break;
        case 'Add a Role':
            // code block
            const newRole = await inquirer.prompt(addRole);
            console.log(newRole);
            break;
        case 'Add an Employee':
            // code block
            const newEmployee = await inquirer.prompt(addEmployee);
            console.log(newEmployee);
            break;
        case 'Update an Employee Role':
            // code block
            break;
        default:
            connection.end();
    }

}

main();