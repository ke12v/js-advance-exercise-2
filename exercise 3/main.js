const loadButton = document.getElementById("loadDataButton");
const clearButton = document.getElementById("clearTableButton");
const dataTable = document.getElementById("dataTable");
const apiUrl = "https://jsonplaceholder.typicode.com/todos/";

loadButton.addEventListener("click", loadData);
clearButton.addEventListener("click", clearTable);

async function loadData() {
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error("Error:", error);
    }
}

function clearTable() {
    dataTable.innerHTML = "";
}

function displayData(data) {
    clearTable(); 

    const table = document.createElement("table");
    const thead = createTableHeader(["User ID", "Task ID", "Title", "Status"]);
    const tbody = document.createElement("tbody");

    data.forEach(item => {
        const row = document.createElement("tr");

        row.appendChild(createCell(item.userId));
        row.appendChild(createCell(item.id));
        row.appendChild(createCell(item.title));

        const statusCell = createCell(item.completed ? "Completed" : "Not Yet Completed");
        statusCell.classList.add(item.completed ? "completed" : "not-completed");

        row.appendChild(statusCell);
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    dataTable.appendChild(table);
}

function createTableHeader(headers) {
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    return thead;
}

function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    return cell;
}
