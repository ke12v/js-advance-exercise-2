// DOM Elements
const insertUpdateBtn = document.getElementById("btnInsertUpdate");
const clearFieldsBtn = document.getElementById("btnClearFields");
const clearRecordsBtn = document.getElementById("btnClearRecords");
const saveBtn = document.getElementById("btnSaveData");
const tableRecords = document.getElementById("tableRecords");
const sortCriteriaDropdown = document.getElementById("sortCriteriaDropdown");
const sortOrderDropdown = document.getElementById("sortOrderDropdown");

let recordsArray = [];
let editIndex = -1;

const tableHeaderLabels = ["First Name", "Middle Name", "Last Name", "Age", "Action"];

// Load saved data from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedData = localStorage.getItem("records");
    if (savedData) {
        recordsArray = JSON.parse(savedData);
        updateTable();
    }
});

// Event Listeners
insertUpdateBtn.addEventListener("click", () => handleInsertUpdate());
clearFieldsBtn.addEventListener("click", clearFields);
clearRecordsBtn.addEventListener("click", clearRecords);
saveBtn.addEventListener("click", saveToLocalStorage);
sortCriteriaDropdown.addEventListener("change", sortAndDisplayRecords);
sortOrderDropdown.addEventListener("change", sortAndDisplayRecords);

function handleInsertUpdate() {
    const inputs = getInputValues();

    if (!inputs || inputs.age < 1) {
        alert("Please complete all fields with valid data!");
        return;
    }

    const record = { ...inputs };

    if (editIndex >= 0) {
        recordsArray[editIndex] = record;
        insertUpdateBtn.textContent = "Insert";
        editIndex = -1;
    } else {
        recordsArray.push(record);
    }

    clearFields();
    updateTable();
}

function getInputValues() {
    const firstName = document.getElementById("txtFirstName").value.trim();
    const middleName = document.getElementById("txtMiddleName").value.trim();
    const lastName = document.getElementById("txtLastName").value.trim();
    const age = parseInt(document.getElementById("txtAge").value.trim());

    if (!firstName || !middleName || !lastName || isNaN(age)) {
        return null;
    }

    return { firstName, middleName, lastName, age };
}

function clearFields() {
    document.getElementById("txtFirstName").value = "";
    document.getElementById("txtMiddleName").value = "";
    document.getElementById("txtLastName").value = "";
    document.getElementById("txtAge").value = "";
    insertUpdateBtn.textContent = "Insert";
    editIndex = -1;
}

function clearRecords() {
    recordsArray = [];
    localStorage.clear();
    updateTable();
    document.getElementById("status").style.display = "inline";
    document.getElementById("status").textContent = "No Records...";
}

function saveToLocalStorage() {
    localStorage.setItem("records", JSON.stringify(recordsArray));
    alert("Data saved to local storage!");
}

function sortAndDisplayRecords() {
    const criteria = sortCriteriaDropdown.value;
    const order = sortOrderDropdown.value;

    if (criteria && order) {
        sortRecords(criteria, order);
        updateTable();
    }
}

function sortRecords(criteria, order) {
    recordsArray.sort((a, b) => {
        const valueA = a[criteria].toLowerCase();
        const valueB = b[criteria].toLowerCase();
        return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
}

function updateTable() {
    tableRecords.innerHTML = "";

    if (recordsArray.length === 0) {
        document.getElementById("status").style.display = "inline";
        document.getElementById("status").textContent = "No Records...";
        return;
    }

    document.getElementById("status").style.display = "none";

    // Create table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    tableHeaderLabels.forEach(label => {
        const th = document.createElement("th");
        th.textContent = label;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    tableRecords.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");

    recordsArray.forEach((rec, index) => {
        const row = tbody.insertRow();

        ["firstName", "middleName", "lastName", "age"].forEach(key => {
            const cell = row.insertCell();
            cell.textContent = rec[key];
        });

        // Action buttons
        const actionCell = row.insertCell();
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteRecord(index);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editRecord(index);

        actionCell.appendChild(deleteBtn);
        actionCell.appendChild(editBtn);
    });

    tableRecords.appendChild(tbody);
}

function deleteRecord(index) {
    recordsArray.splice(index, 1);
    updateTable();
}

function editRecord(index) {
    const record = recordsArray[index];
    document.getElementById("txtFirstName").value = record.firstName;
    document.getElementById("txtMiddleName").value = record.middleName;
    document.getElementById("txtLastName").value = record.lastName;
    document.getElementById("txtAge").value = record.age;

    insertUpdateBtn.textContent = "Update";
    editIndex = index;
}
