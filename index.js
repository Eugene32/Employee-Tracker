const fs = require('fs');
const inquirer = require('inquirer');
const cTable = require('console.table');

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


async function main() {
    const mainMenuChoice = await inquirer.prompt(mainMenu);

    switch (mainMenuChoice.mainMenu) {
        case 'View All Departments':
            //code block

            break;

        case 'View All Roles':
            // code block
            break;
        case 'View All Employees':
            // code block
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
        // code block
        // let str = 'STRING';

        // console.table([
        //     {
        //       name: str,
        //       age: 10
        //     }, {
        //       name: 'bar',
        //       age: 20
        //     }
        //   ]);
    }

}

main();