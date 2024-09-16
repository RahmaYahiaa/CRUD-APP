const formEmp = document.getElementById("formEmp");
const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputMobile = document.getElementById("mobile");
const tableBody = document.querySelector("#example tbody");

const submit = document.getElementById("submit");
const contIdEdit = document.getElementById("contIdEdit");

class Employee {
    // Constructor initializes employee object with id, name, email, and mobile
    constructor(id, name, email, mobile) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
    }

    // Displays the employee data in a table row with Edit and Delete buttons
    showData() {
        const trEl = document.createElement("tr");
        trEl.innerHTML = `
            <td>${this.name}</td>
            <td>${this.email}</td>
            <td>${this.mobile}</td>
            <td>
                <button class="btn btn-success btn-sm edit" data-id="${this.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete" data-id="${this.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(trEl);
        return this;
    }

    // Stores the employee data in localStorage
    storeEmployee() {
        const allData = JSON.parse(localStorage.getItem("employees")) ?? [];
        allData.push({
            id: this.id,
            name: this.name,
            email: this.email,
            mobile: this.mobile
        });
        localStorage.setItem("employees", JSON.stringify(allData));
    }

    // Static method that retrieves all employees from localStorage and displays them in the table
    static getAllEmployees() {
        const allData = JSON.parse(localStorage.getItem("employees")) ?? [];
        allData.forEach(data => {
            const employee = new Employee(data.id, data.name, data.email, data.mobile);
            employee.showData();
        });
    }

    // Updates an existing employee's data in localStorage
    updateEmployee(id) {
        const newItem = { id: id, name: this.name, email: this.email, mobile: this.mobile };
        const employeesData = JSON.parse(localStorage.getItem("employees")) || [];

        const updateData = employeesData.map(item => {
            if (item.id === id) {
                return newItem;
            }
            return item;
        });

        localStorage.setItem("employees", JSON.stringify(updateData));
    }
}

// Retrieves and displays all employees from localStorage on page load
Employee.getAllEmployees();

formEmp.addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    let id;

    // Check if we are editing an existing employee
    if (!contIdEdit.value) { // Adding a new employee
        const employees = JSON.parse(localStorage.getItem("employees")) || [];
        id = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1; // Generate unique ID
    } else { // Updating an existing employee
        id = +(contIdEdit.value);
    }

    // Create or update the employee
    const employee = new Employee(id, inputName.value, inputEmail.value, inputMobile.value);

    if (!contIdEdit.value) {
        employee.showData().storeEmployee();
    } else {
        employee.updateEmployee(id);
        submit.value = "Store This Item"; // Reset button text after update
        contIdEdit.value = ""; // Clear hidden edit field
        tableBody.innerHTML = ''; // Clear the table body
        Employee.getAllEmployees(); // Refresh employee list
    }

    formEmp.reset(); // Reset form fields after submission
});

// Event listener for handling Edit and Delete buttons inside the table
tableBody.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete")) {
        // Handles deleting an employee
        const id = e.target.getAttribute("data-id");
        let employees = JSON.parse(localStorage.getItem("employees"));
        employees = employees.filter(emp => emp.id != id); // Remove the employee by ID
        localStorage.setItem("employees", JSON.stringify(employees));

        e.target.parentElement.parentElement.remove(); // Remove the row from the table
    }

    if (e.target.classList.contains("edit")) {
        // Handles editing an employee by loading the data into the form
        const id = +e.target.getAttribute("data-id");
        let item = JSON.parse(localStorage.getItem("employees")).find(item => item.id === id);
        inputName.value = item.name;
        inputEmail.value = item.email;
        inputMobile.value = item.mobile;
        contIdEdit.value = id; // Set the hidden field for editing
        submit.value = "Edit This Item"; // Change button text to reflect edit mode
    }
});
