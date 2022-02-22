const inquirer = require('inquirer');

mainMenu = [

    {
        type: 'list',
        name: 'mainMenu',
        message: "Selection Menu ",
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Delete an Employee', 'EXIT']
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

module.exports = {mainMenu, addDepartment, addRole, addEmployeeName};