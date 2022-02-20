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

connection.connect(function(err) {
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
         console.table(rows);
        main();
     });
 };


async function main() {
    let mainMenuChoice = await inquirer.prompt(mainMenu);

    switch (mainMenuChoice.mainMenu) {
        case 'View All Departments':
             const sql = await queryDepartments();
            
            break;

        case 'View All Roles':
            // code block
            break;
        case 'View All Employees':
            // code blockg
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