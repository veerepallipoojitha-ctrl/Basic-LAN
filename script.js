/*
============================================================
COMPUTER NETWORKS
BASIC LAN SIMULATION

Concepts:
- Ethernet
- MAC learning
- ARP
- ICMP
- Switch forwarding
============================================================
*/


// ============================================================
// NETWORK DEVICES
// ============================================================

const PC1 = {

    name: "PC1",

    ip: "192.168.1.10",

    mac: "00:11:22:33:44:10",

    port: "Fa0/1"

};


const PC2 = {

    name: "PC2",

    ip: "192.168.1.20",

    mac: "00:11:22:33:44:20",

    port: "Fa0/2"

};


// ============================================================
// SWITCH MAC TABLE
// ============================================================

let macTable = {};


// ============================================================
// ARP TABLE
// ============================================================

let arpTable = {};


// ============================================================
// SIMULATION VARIABLES
// ============================================================

let currentStep = 0;

let simulationStarted = false;


// ============================================================
// TOTAL SIMULATION STEPS
// ============================================================

const totalSteps = 8;


// ============================================================
// GET HTML ELEMENTS
// ============================================================

const consoleOutput =
    document.getElementById("console");

const stepText =
    document.getElementById("stepText");

const progress =
    document.getElementById("progress");


// ============================================================
// WRITE TO CONSOLE
// ============================================================

function log(message, type = "") {

    const line =
        document.createElement("div");

    line.textContent = message;

    if (type !== "") {

        line.classList.add(type);

    }

    consoleOutput.appendChild(line);

    consoleOutput.scrollTop =
        consoleOutput.scrollHeight;
}


// ============================================================
// UPDATE PROGRESS
// ============================================================

function updateProgress() {

    const percentage =
        (currentStep / totalSteps) * 100;

    progress.style.width =
        percentage + "%";

}


// ============================================================
// UPDATE STEP TEXT
// ============================================================

function updateStep(text) {

    stepText.textContent = text;

}


// ============================================================
// DISPLAY ETHERNET FRAME
// ============================================================

function showFrame(source, destination, payload) {

    document.getElementById("sourceMac")
        .textContent = source;

    document.getElementById("destinationMac")
        .textContent = destination;

    document.getElementById("payload")
        .textContent = payload;

}


// ============================================================
// UPDATE ARP TABLE
// ============================================================

function updateARPTable() {

    const table =
        document.getElementById("arpTable");

    table.innerHTML = "";

    for (const ip in arpTable) {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${ip}</td>

            <td>${arpTable[ip]}</td>

        `;

        table.appendChild(row);

    }

}


// ============================================================
// UPDATE SWITCH MAC TABLE
// ============================================================

function updateMACTable() {

    const table =
        document.getElementById("macTable");

    table.innerHTML = "";

    for (const mac in macTable) {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${mac}</td>

            <td>${macTable[mac]}</td>

        `;

        table.appendChild(row);

    }

}


// ============================================================
// MAC ADDRESS LEARNING
// ============================================================

function learnMAC(mac, port) {

    macTable[mac] = port;

    log(
        `[SWITCH] Learned MAC ${mac} on ${port}`,
        "success"
    );

    updateMACTable();

}


// ============================================================
// ACTIVATE CONNECTION
// ============================================================

function activateLine(number) {

    const line =
        document.getElementById("line" + number);

    line.classList.add("active");

}


// ============================================================
// STEP 1
// ============================================================

function stepOne() {

    log(
        "--------------------------------------------------",
        "info"
    );

    log(
        "STEP 1: PC1 starts communication with PC2",
        "info"
    );

    log(
        `PC1 IP  : ${PC1.ip}`
    );

    log(
        `PC2 IP  : ${PC2.ip}`
    );

    log(
        "PC1 does not know PC2's MAC address."
    );

    updateStep(
        "Step 1: PC1 starts communication."
    );

}


// ============================================================
// STEP 2
// ============================================================

function stepTwo() {

    log(
        "STEP 2: PC1 sends ARP Request",
        "info"
    );

    log(
        `ARP Request: Who has ${PC2.ip}?`
    );

    showFrame(

        PC1.mac,

        "FF:FF:FF:FF:FF:FF",

        `ARP Request: Who has ${PC2.ip}?`

    );

    activateLine(1);

    log(
        "[Ethernet] Destination MAC is broadcast."
    );

    log(
        "[SWITCH] Frame received on Fa0/1."
    );

    learnMAC(
        PC1.mac,
        PC1.port
    );

    updateStep(
        "Step 2: ARP Request is broadcast."
    );

}


// ============================================================
// STEP 3
// ============================================================

function stepThree() {

    log(
        "STEP 3: Switch floods ARP Request",
        "info"
    );

    log(
        "[SWITCH] Destination MAC is FF:FF:FF:FF:FF:FF."
    );

    log(
        "[SWITCH] Flooding frame to other ports."
    );

    activateLine(2);

    log(
        "[PC2] ARP Request received."
    );

    updateStep(
        "Step 3: Switch floods the ARP request."
    );

}


// ============================================================
// STEP 4
// ============================================================

function stepFour() {

    log(
        "STEP 4: PC2 sends ARP Reply",
        "info"
    );

    arpTable[PC2.ip] =
        PC2.mac;

    updateARPTable();

    showFrame(

        PC2.mac,

        PC1.mac,

        "ARP Reply"

    );

    log(
        `[ARP] ${PC2.ip} is at ${PC2.mac}`,
        "success"
    );

    log(
        "[PC1] Stores PC2 MAC address in ARP table."
    );

    updateStep(
        "Step 4: ARP Reply received."
    );

}


// ============================================================
// STEP 5
// ============================================================

function stepFive() {

    log(
        "STEP 5: PC1 sends ICMP Echo Request",
        "info"
    );

    showFrame(

        PC1.mac,

        PC2.mac,

        "ICMP Echo Request"

    );

    log(
        "[ICMP] Echo Request created."
    );

    log(
        `[ICMP] Destination IP: ${PC2.ip}`
    );

    updateStep(
        "Step 5: ICMP Echo Request created."
    );

}


// ============================================================
// STEP 6
// ============================================================

function stepSix() {

    log(
        "STEP 6: Switch forwards ICMP frame",
        "info"
    );

    log(
        `[SWITCH] Destination MAC ${PC2.mac} found.`
    );

    log(
        `[SWITCH] Forwarding frame to ${PC2.port}.`,
        "success"
    );

    activateLine(2);

    updateStep(
        "Step 6: Switch forwards frame to PC2."
    );

}


// ============================================================
// STEP 7
// ============================================================

function stepSeven() {

    log(
        "STEP 7: PC2 sends ICMP Echo Reply",
        "info"
    );

    showFrame(

        PC2.mac,

        PC1.mac,

        "ICMP Echo Reply"

    );

    log(
        "[ICMP] Echo Reply received by PC1.",
        "success"
    );

    updateStep(
        "Step 7: ICMP Echo Reply received."
    );

}


// ============================================================
// STEP 8
// ============================================================

function stepEight() {

    log(
        "STEP 8: Ping completed successfully",
        "success"
    );

    const ping =
        document.getElementById("pingResult");

    ping.classList.add("success");

    ping.innerHTML = `

        Reply from 192.168.1.20:
        bytes=32 time<1ms TTL=64
        <br><br>

        Ping statistics:
        <br>

        Packets: Sent = 1,
        Received = 1,
        Lost = 0
        <br><br>

        <strong>
        Result: SUCCESS
        </strong>

    `;


    document.getElementById("test1")
        .textContent = "PASS";

    document.getElementById("test1")
        .classList.add("pass");


    document.getElementById("test2")
        .textContent = "PASS";

    document.getElementById("test2")
        .classList.add("pass");


    document.getElementById("test3")
        .textContent = "PASS";

    document.getElementById("test3")
        .classList.add("pass");


    document.getElementById("test4")
        .textContent = "PASS";

    document.getElementById("test4")
        .classList.add("pass");


    document.getElementById("test5")
        .textContent = "PASS";

    document.getElementById("test5")
        .classList.add("pass");


    updateStep(
        "Simulation completed successfully."
    );


    log(
        "==================================================",
        "success"
    );

    log(
        "BASIC LAN SIMULATION COMPLETED SUCCESSFULLY",
        "success"
    );

}


// ============================================================
// EXECUTE CURRENT STEP
// ============================================================

function executeStep() {

    currentStep++;

    updateProgress();


    switch (currentStep) {

        case 1:
            stepOne();
            break;

        case 2:
            stepTwo();
            break;

        case 3:
            stepThree();
            break;

        case 4:
            stepFour();
            break;

        case 5:
            stepFive();
            break;

        case 6:
            stepSix();
            break;

        case 7:
            stepSeven();
            break;

        case 8:
            stepEight();
            break;

        default:
            break;

    }

}


// ============================================================
// START SIMULATION
// ============================================================

function startSimulation() {

    if (simulationStarted) {

        return;

    }

    simulationStarted = true;

    consoleOutput.innerHTML = "";

    log(
        "Starting Basic LAN simulation...",
        "info"
    );

    log(
        "PC1 -> SW1 -> PC2",
        "info"
    );

    executeStep();

}


// ============================================================
// NEXT STEP
// ============================================================

function nextStep() {

    if (!simulationStarted) {

        startSimulation();

        return;

    }


    if (currentStep < totalSteps) {

        executeStep();

    }

}


// ============================================================
// RESET SIMULATION
// ============================================================

function resetSimulation() {

    currentStep = 0;

    simulationStarted = false;

    macTable = {};

    arpTable = {};


    consoleOutput.innerHTML = `

        <div>
            System ready...
        </div>

        <div>
            Click "Start Simulation" to begin.
        </div>

    `;


    document.getElementById("sourceMac")
        .textContent = "--";

    document.getElementById("destinationMac")
        .textContent = "--";

    document.getElementById("payload")
        .textContent = "--";


    document.getElementById("arpTable")
        .innerHTML = `

        <tr>
            <td colspan="2">
                No ARP entries
            </td>
        </tr>

    `;


    document.getElementById("macTable")
        .innerHTML = `

        <tr>
            <td colspan="2">
                MAC table is empty
            </td>
        </tr>

    `;


    document.getElementById("pingResult")
        .classList.remove("success");


    document.getElementById("pingResult")
        .textContent =
        "Waiting for simulation...";


    document.getElementById("progress")
        .style.width = "0%";


    document.getElementById("stepText")
        .textContent =
        "Ready to start simulation.";


    document.getElementById("line1")
        .classList.remove("active");

    document.getElementById("line2")
        .classList.remove("active");


    for (let i = 1; i <= 5; i++) {

        const test =
            document.getElementById("test" + i);

        test.textContent = "WAITING";

        test.classList.remove("pass");

    }

}