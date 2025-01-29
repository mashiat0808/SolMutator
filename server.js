const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use("/coverage", express.static(path.join(__dirname, "coverage")));


// Path to the operators configuration file
const operatorsConfigPath = path.join(__dirname, "src", "operators.config.json");

const resultsDir = path.join(__dirname, 'solmutator/results');

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

app.use('/results', express.static(resultsDir));

app.get('/reports', (req, res) => {
    const fs = require('fs');
    fs.readdir(resultsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Failed to load reports" });
        }
        res.json(files);
    });
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});