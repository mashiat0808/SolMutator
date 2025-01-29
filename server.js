const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const csvParser = require("csv-parser");
const XLSX = require("xlsx");

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use("/coverage", express.static(path.join(__dirname, "coverage")));

// Path to the operators configuration file
const operatorsConfigPath = path.join(__dirname, "src", "operators.config.json");

const resultsDir = path.join(__dirname, "solmutator/results");

// Serve the static HTML file for the root route
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SolMutator</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 2rem;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                h1 {
                    color: #333;
                    margin-bottom: 1rem;
                }
                .button {
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                    margin: 0.5rem;
                    transition: background 0.2s;
                    text-decoration: none; /* Remove underline */
                    display: inline-block; /* Make it look like a button */
                }
                .button:hover {
                    background: #1d4ed8;
                }
                .output {
                    margin-top: 1rem;
                    padding: 1rem;
                    background: #f3f4f6;
                    border-radius: 6px;
                    font-family: monospace;
                    text-align: left;
                    white-space: pre-wrap;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>SolMutator</h1>
                <button class="button" onclick="runCommand('mutate')">Mutate</button>
                <button class="button" onclick="runCommand('pretest')">Pretest</button>
                <button class="button" onclick="runCommand('test')">Test</button>
                <a href="/operators" class="button">Manage Operators</a>
                <a href="/coverage/index.html" class="button">Coverage</a>
                <a href="/reports" class="button">Reports</a>

                <div id="output" class="output"></div>
            </div>
            <script>

                async function runCommand(command) {
                    const outputDiv = document.getElementById("output");
                    outputDiv.textContent = "Running " + command + "...";

                    try {
                        const response = await fetch("/run-command", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ command }),
                        });

                        if (response.ok) {
                            const result = await response.text();
                            outputDiv.textContent = result;
                        } else {
                            const error = await response.text();
                            outputDiv.textContent = "Error: " + error;
                        }
                    } catch (err) {
                        outputDiv.textContent = "Error: " + err.message;
                    }
                }
            </script>
        </body>
        </html>
    `);
});
// Serve the operators management page
app.get("/operators", (req, res) => {
    try {
        const operatorsConfig = JSON.parse(fs.readFileSync(operatorsConfigPath, "utf-8"));

        // Generate the HTML for the operators page
        const operatorsHTML = Object.entries(operatorsConfig)
            .map(
                ([operator, enabled]) => `
                <div class="operator-item">
                    <input type="checkbox" id="${operator}" ${enabled ? "checked" : ""} onchange="toggleOperator('${operator}', this.checked)">
                    <label for="${operator}">${operator}</label>
                </div>
            `
            )
            .join("");

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Manage Operators</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 2rem;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: white;
                        padding: 2rem;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    h1 {
                        color: #333;
                        margin-bottom: 1rem;
                    }
                    .operator-list {
                        text-align: left;
                        margin-top: 1rem;
                    }
                    .operator-item {
                        display: flex;
                        align-items: center;
                        margin-bottom: 0.5rem;
                    }
                    .operator-item input[type="checkbox"] {
                        margin-right: 0.5rem;
                    }
                    .button {
                        background: #2563eb;
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 1rem;
                        margin: 0.5rem;
                        transition: background 0.2s;
                        text-decoration: none; /* Remove underline */
                        display: inline-block; /* Make it look like a button */
                    }
                    .button:hover {
                        background: #1d4ed8;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Manage Operators</h1>
                    <button class="button" onclick="enableAll()">Enable All</button>
                    <button class="button" onclick="disableAll()">Disable All</button>
                    <a href="/" class="button">Back to Home</a>

                    <div id="operator-list" class="operator-list">
                        ${operatorsHTML}
                    </div>

                </div>
                <script>
                    async function toggleOperator(operator, enabled) {
                        try {
                            const response = await fetch("/toggle-operator", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ operator, enabled }),
                            });

                            if (response.ok) {
                                alert(\`Operator \${operator} \${enabled ? "enabled" : "disabled"} successfully.\`);
                            } else {
                                const error = await response.text();
                                alert("Error: " + error);
                            }
                        } catch (err) {
                            alert("Error: " + err.message);
                        }
                    }

                    async function enableAll() {
                        const checkboxes = document.querySelectorAll(".operator-item input[type='checkbox']");
                        checkboxes.forEach(cb => cb.checked = true);
                        await updateAllOperators(true);
                    }

                    async function disableAll() {
                        const checkboxes = document.querySelectorAll(".operator-item input[type='checkbox']");
                        checkboxes.forEach(cb => cb.checked = false);
                        await updateAllOperators(false);
                    }

                    async function updateAllOperators(enabled) {
                        try {
                            const response = await fetch("/toggle-all-operators", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ enabled }),
                            });

                            if (response.ok) {
                                alert(\`All operators \${enabled ? "enabled" : "disabled"} successfully.\`);
                            } else {
                                const error = await response.text();
                                alert("Error: " + error);
                            }
                        } catch (err) {
                            alert("Error: " + err.message);
                        }
                    }
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error reading operators configuration file:", error);
        res.status(500).send("Error reading operators configuration file");
    }
});

// Endpoint to toggle an operator (enable/disable)
app.post("/toggle-operator", (req, res) => {
    const { operator, enabled } = req.body;

    try {
        const operatorsConfig = JSON.parse(fs.readFileSync(operatorsConfigPath, "utf-8"));
        operatorsConfig[operator] = enabled;
        fs.writeFileSync(operatorsConfigPath, JSON.stringify(operatorsConfig, null, 2), "utf-8");
        res.send(`Operator ${operator} ${enabled ? "enabled" : "disabled"} successfully.`);
    } catch (error) {
        console.error("Error updating operator:", error);
        res.status(500).send("Error updating operator");
    }
});

// Endpoint to enable/disable all operators
app.post("/toggle-all-operators", (req, res) => {
    const { enabled } = req.body;

    try {
        const operatorsConfig = JSON.parse(fs.readFileSync(operatorsConfigPath, "utf-8"));
        for (const operator in operatorsConfig) {
            operatorsConfig[operator] = enabled;
        }
        fs.writeFileSync(operatorsConfigPath, JSON.stringify(operatorsConfig, null, 2), "utf-8");
        res.send(`All operators ${enabled ? "enabled" : "disabled"} successfully.`);
    } catch (error) {
        console.error("Error updating all operators:", error);
        res.status(500).send("Error updating all operators");
    }
});

// Endpoint to run SolMutator commands
app.post("/run-command", (req, res) => {
    const { command } = req.body;

    // Map UI commands to SolMutator commands
    const solmutatorCommands = {
        lookup: "node index.js lookup",
        mutate: "node index.js mutate",
        pretest: "node index.js pretest",
        test: "node index.js test",
        list: "node index.js list", // Added the list command
    };

    if (!solmutatorCommands[command]) {
        return res.status(400).send("Invalid command");
    }

    // Execute the SolMutator command
    exec(solmutatorCommands[command], (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running ${command}:`, stderr);
            return res.status(500).send(`Error: ${stderr}`);
        }
        res.send(stdout); // Send the CLI output back to the frontend
    });
});

// Serve the reports page
app.get("/reports", async (req, res) => {
    const mutationsPath = path.join(resultsDir, "mutations.json");
    const operatorsPath = path.join(resultsDir, "operators.xlsx");
    const resultsCsvPath = path.join(resultsDir, "results.csv");
    const logPath = path.join(resultsDir, "solmutator-log.txt");

    let mutationsContent = "";
    let logContent = "";
    let csvContent = [];
    let xlsxContent = [];

    // Read mutations.json
    if (fs.existsSync(mutationsPath)) {
        mutationsContent = JSON.parse(fs.readFileSync(mutationsPath, "utf-8"));
    }

    // Read solmutator-log.txt
    if (fs.existsSync(logPath)) {
        logContent = fs.readFileSync(logPath, "utf-8");
    }

    // Read results.csv
    if (fs.existsSync(resultsCsvPath)) {
        csvContent = await new Promise((resolve, reject) => {
            const csvData = [];
            fs.createReadStream(resultsCsvPath)
                .pipe(csvParser())
                .on("data", (row) => csvData.push(row))
                .on("end", () => resolve(csvData))
                .on("error", (err) => reject(err));
        });
    }

    // Read operators.xlsx
    if (fs.existsSync(operatorsPath)) {
        const workbook = XLSX.readFile(operatorsPath);
        const sheetName = workbook.SheetNames[0];
        xlsxContent = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    }

    // Generate HTML for the reports page with collapsible tabs
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reports</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 2rem;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                    margin-bottom: 1rem;
                }
                .tabs {
                    display: flex;
                    flex-direction: column;
                }
                .tab {
                    margin-bottom: 1rem;
                }
                .tab button {
                    width: 100%;
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 0.75rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                    text-align: left;
                    transition: background 0.2s;
                }
                .tab button:hover {
                    background: #1d4ed8;
                }
                .tab-content {
                    display: none;
                    padding: 1rem;
                    background: #f3f4f6;
                    border-radius: 6px;
                    margin-top: 0.5rem;
                    overflow-x: auto;
                }
                .tab-content.active {
                    display: block;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 1rem;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f4f4f4;
                }
                .button {
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                    margin: 0.5rem;
                    transition: background 0.2s;
                    text-decoration: none; /* Remove underline */
                    display: inline-block; /* Make it look like a button */
                }
                .button:hover {
                    background: #1d4ed8;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Reports</h1>
                <div class="tabs">
                    <div class="tab">
                        <button onclick="toggleTab('mutations')">Mutations (mutations.json)</button>
                        <div id="mutations" class="tab-content">
                            <pre>${JSON.stringify(mutationsContent, null, 2)}</pre>
                        </div>
                    </div>
                    <div class="tab">
                        <button onclick="toggleTab('log')">Log (solmutator-log.txt)</button>
                        <div id="log" class="tab-content">
                            <pre>${logContent}</pre>
                        </div>
                    </div>
                    <div class="tab">
                        <button onclick="toggleTab('results')">Results (results.csv)</button>
                        <div id="results" class="tab-content">
                            <table>
                                <thead>
                                    <tr>
                                        ${csvContent.length > 0 ? Object.keys(csvContent[0]).map((key) => `<th>${key}</th>`).join("") : ""}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${csvContent.map((row) => `<tr>${Object.values(row).map((value) => `<td>${value}</td>`).join("")}</tr>`).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab">
                        <button onclick="toggleTab('operators')">Operators (operators.xlsx)</button>
                        <div id="operators" class="tab-content">
                            <table>
                                <thead>
                                    <tr>
                                        ${xlsxContent.length > 0 ? Object.keys(xlsxContent[0]).map((key) => `<th>${key}</th>`).join("") : ""}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${xlsxContent.map((row) => `<tr>${Object.values(row).map((value) => `<td>${value}</td>`).join("")}</tr>`).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <a href="/" class="button">Back to Home</a>
            </div>
            <script>
                function toggleTab(tabId) {
                    const content = document.getElementById(tabId);
                    const isActive = content.classList.contains("active");
                    const allContents = document.querySelectorAll(".tab-content");
                    allContents.forEach((c) => c.classList.remove("active"));
                    if (!isActive) {
                        content.classList.add("active");
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// Serve static files from the results directory
app.use("/results", express.static(resultsDir));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});