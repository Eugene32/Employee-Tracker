const fs = require('fs');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();
const mysql = require('mysql2');
const Employee = require('./class/Employee');
const questionnaire = require('./questions');  // Fetch inquirer prompt from questions.js

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

const queryDepartments = async () => {
    console.log('\r\n');  // Provides gap between displays
    const query = `SELECT department.id AS ID,
     department.name AS Department
     FROM department;`;
    connection.query(query, async (err, rows) => {
        if (err) throw err;
        console.log('\r\n');  // Provides gap between displays
        console.table(rows);
        console.log('Press UP or DOWN key to continue.....');
        main();
    });
};

const queryRoles = async () => {
    const query = `SELECT role.id AS ID,
    role.title AS Title
    FROM role;`;
    connection.query(query, async (err, roles) => {
        if (err) throw err;
        console.log('\r\n');  // Provides gap between displays
        console.table(roles);
        console.log('Press UP or DOWN key to continue.....');
        main();
    });
};

const queryEmployees = async () => {
    console.log('\r\n');  // Provides gap between displays
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
    connection.query(query, async (err, employees) => {
        if (err) throw err;
        console.log('\r\n');  // Provides gap between displays
        console.table(employees);
        console.log('Press UP or DOWN key to continue.....');
        main();

    });

};

async function getDepartment() {
    const newDept = await inquirer.prompt(questionnaire.addDepartment);
    const deptQuery = `INSERT INTO department (name) VALUES (?);`;
    connection.query(deptQuery, newDept.department, async (err, data) => {
        if (err) throw err;
        console.log(`New department created!`);
        main();
    });
};

async function getRole() {

    const newRole = await inquirer.prompt(questionnaire.addRole);
    let arg = [newRole.title, newRole.salary];
    const deptQuery = `SELECT id, name FROM department`;
    connection.query(deptQuery, async (err, data) => {
        if (err) throw err;       
        let department = data.map(function (element) { return `${element.id} ${element.name}`; })
        inquirer.prompt([
            {
                type: "list",
                name: "departmentid",
                message: "Select department: ",
                choices: department
            }])
            .then((data) => {

                const string = data.departmentid;
                
                const array = string.split(' ');
                let department_id = array[0];
                arg.push(department_id);
                
                const query = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;
                connection.query(query, arg, async (err, rows) => {
                    if (err) throw err;
                    console.log(`New role created!`);
                    main();
                    
                });
            });

    });

};

async function displayRoles() {
    const request = await queryRoles();
    console.log('Role list had been updated');
    const delay = setTimeout(main, 1000);  // This is not a very good solution.
};


async function getEmployee() {

    const employeeName = await inquirer.prompt(questionnaire.addEmployeeName);

    const arg = [employeeName.fname, employeeName.lname];

    const roleQuery = 'SELECT * FROM role';
    connection.query(roleQuery, async (err, data) => {
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
            arg.push(data.roleid);
            

            const managerSql = `SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) 
             AS manager 
             FROM employee e 
             LEFT JOIN role r
             ON e.role_id = r.id
             LEFT JOIN employee m
             ON m.id = e.manager_id GROUP BY e.manager_id`;

            connection.query(managerSql, async (err, data) => {
                if (err) throw err;
                const manager = data.map(({ manager, manager_id }) => ({
                    name: manager,
                    value: manager_id,
                }));

                inquirer.prompt([
                    {
                        type: "list",
                        name: "managerid",
                        message: "Who is the employee's manager?",
                        choices: manager
                    }
                ]).then((data) => {
                    const managerId = data.managerid
                    arg.push(managerId);
                   

                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                    connection.query(sql, arg, async (err, rows) => {
                        if (err) throw err;
                        console.log('\r\n');
                        console.log(`Employee created successfully!`);
                        
                        main();
                    });
                });

            });
        });
    });
};

const updateEmployee = () => {
    const queryEmployee = `SELECT * FROM employee`;

    connection.query(queryEmployee, async (err, data) => {
        if (err) throw err;
        const employees = data.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Choose emloyee to update: ",
                choices: employees
            }
        ]).then((data) => {
            const employee = data.name;
            const arg = [];
            arg.push(employee);
            const queryRole = `SELECT * FROM role`;

            connection.query(queryRole, async (err, data) => {
                if (err) throw err;
                const roles = data.map(({ title, id }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "New role?",
                        choices: roles
                    }
                ]).then((data) => {
                    const role = data.role;
                    // Adds role to start of params
                    arg.unshift(role);

                    const query = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    connection.query(query, arg, async (err, data) => {
                        if (err) throw err;
                        console.log("Employee list updated..... ");
                        main();
                    });
                });
            });
        });
    });
};


async function deleteEmployee() {

    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to delete?",
                choices: employees
            }
        ]).then(data => {
            const employee = data.name;
            const sql = `DELETE FROM employee WHERE id = ?`;

            connection.query(sql, employee, (err, data) => {
                if (err) throw err;
                console.log("Employee deleted successfully!");
                
                main();
            });
        });
    });
};


async function main() {

    console.log('\r\n');    
    let mainMenuChoice = await inquirer.prompt(questionnaire.mainMenu);

    switch (mainMenuChoice.mainMenu) {
        case 'View All Departments':

            queryDepartments();
            
            break;

        case 'View All Roles':

            queryRoles();
            
            break;

        case 'View All Employees':

            queryEmployees();
            
            break;

        case 'Add a Department':

            const add_Dept = await getDepartment();
            
            break;

        case 'Add a Role':

            const add_Role = await getRole();
            
            break;

        case 'Add an Employee':

            const add_Employee = await getEmployee();
            break;

        case 'Update an Employee Role':

            const update_Employee = await updateEmployee();
            break;

        case 'Delete an Employee':
            const delete_Employee = await deleteEmployee();
            break;
        default:
            console.log('\r\n');
            connection.end();
    }

}

main();