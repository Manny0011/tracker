const ctx = document.getElementById("cashflowCanvas");

const overlay = document.querySelector("#transactionLayer");
const addBtn = document.querySelector("#openTransactionPanel");
const closeBtn = document.querySelector("#closeTransactionPanel");

const form = document.querySelector("#transactionForm");

const type = document.querySelector("#entryType");
const description = document.querySelector("#entryNote");
const amount = document.querySelector("#entryAmount");
const category = document.querySelector("#entryCategory");
const date = document.querySelector("#entryDate");

const transactionBody = document.querySelector("#ledgerBody");

const balance = document.querySelector("#netBalance");
const incomeTotal = document.querySelector("#grossIncome");
const expenseTotal = document.querySelector("#grossExpense");
const transactionTotal = document.querySelector("#ledgerCount");

const submitBtn = document.querySelector("#saveTransaction");
const logoutBtn = document.querySelector("#logoutAction");
const themeSwitch = document.querySelector("#colorModeSwitch");

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "index.html";
}

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const storageKey = `transactions-${currentUser.email}`;
let transactions = JSON.parse(localStorage.getItem(storageKey)) || [];

let editIndex = -1;
const search = document.querySelector("#ledgerSearch");

const userName = document.querySelector("#accountName");

userName.textContent = currentUser.name;

addBtn.addEventListener("click", () => {

    overlay.style.display = "flex";

    form.reset();

    editIndex = -1;

    submitBtn.value = "Add Transaction";

});

closeBtn.addEventListener("click", () => {

    overlay.style.display = "none";

});

const chart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: [],
        datasets: [
            {
                label: "Income",
                data: [],
                backgroundColor: "#22c55e",
                borderRadius: 10
            },
            {
                label: "Expense",
                data: [],
                backgroundColor: "#ef4444",
                borderRadius: 10
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#f8fafc",
                    boxWidth: 14,
                    boxHeight: 14,
                    font: {
                        size: 13,
                        weight: "600"
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "#f8fafc"
                },
                grid: {
                    color: "rgba(255,255,255,0.08)"
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#f8fafc"
                },
                grid: {
                    color: "rgba(255,255,255,0.08)"
                }
            }
        }
    }
});

function updateChartTheme() {

    const isDark = document.body.classList.contains("dark-theme");

    chart.options.plugins.legend.labels.color = isDark ? "#f8fafc" : "#222";

    chart.options.scales.x.ticks.color = isDark ? "#f8fafc" : "#222";
    chart.options.scales.y.ticks.color = isDark ? "#f8fafc" : "#222";

    chart.options.scales.x.grid.color = isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.1)";

    chart.options.scales.y.grid.color = isDark
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.1)";

    chart.update();

}

form.addEventListener("submit", (event) => {

    event.preventDefault();

    const transaction = {

        type: type.value,
        description: description.value,
        amount: Number(amount.value),
        date: date.value,
        category: category.value

    };

    if (editIndex === -1) {

        transactions.push(transaction);

    } else {

        transactions[editIndex] = transaction;

        editIndex = -1;

        submitBtn.value = "Add Transaction";

    }

    localStorage.setItem(
        storageKey,
        JSON.stringify(transactions)
    );
    renderTable();
    updateChart();
    updateCards();

    form.reset();

    overlay.style.display = "none";

});

function renderTable(data = transactions) {

    transactionBody.innerHTML = "";

    data.forEach((transaction, index) => {

        transactionBody.innerHTML += `
            <tr>
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category}</td>
                <td class="${transaction.type}">${transaction.type}</td>
                <td class="${transaction.type}">₹${transaction.amount}</td>
                <td>
                    <button class="row-action edit-action" onclick="editTransaction(${transactions.indexOf(transaction)})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="row-action delete-action" onclick="deleteTransaction(${transactions.indexOf(transaction)})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

}

function editTransaction(index) {

    const transaction = transactions[index];

    type.value = transaction.type;
    description.value = transaction.description;
    amount.value = transaction.amount;
    date.value = transaction.date;
    category.value = transaction.category;

    editIndex = index;

    submitBtn.value = "Update Transaction";

    overlay.style.display = "flex";

}

function deleteTransaction(index) {

    transactions.splice(index, 1);

    localStorage.setItem(
        storageKey,
        JSON.stringify(transactions)
    );
    renderTable();
    updateChart();
    updateCards();

}

function updateChart() {

    let chartData = {};

    transactions.forEach((transaction) => {

        if (!chartData[transaction.date]) {

            chartData[transaction.date] = {

                income: 0,
                expense: 0

            };

        }

        if (transaction.type === "income") {

            chartData[transaction.date].income += transaction.amount;

        } else {

            chartData[transaction.date].expense += transaction.amount;

        }

    });

    const labels = Object.keys(chartData).sort();

    const incomeData = labels.map(date => chartData[date].income);

    const expenseData = labels.map(date => chartData[date].expense);

    chart.data.labels = labels;
    chart.data.datasets[0].data = incomeData;
    chart.data.datasets[1].data = expenseData;

    chart.update();

}

function updateCards() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {

        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        } else {

            totalExpense += transaction.amount;

        }

    });

    const currentBalance = totalIncome - totalExpense;

    incomeTotal.textContent = `₹${totalIncome}`;
    expenseTotal.textContent = `₹${totalExpense}`;
    balance.textContent = `₹${currentBalance}`;
    transactionTotal.textContent = transactions.length;

}

search.addEventListener("input", () => {

    const keyword = search.value.toLowerCase();

    const filteredTransactions = transactions.filter((transaction) => {

        return (
            transaction.description.toLowerCase().includes(keyword) ||
            transaction.category.toLowerCase().includes(keyword) ||
            transaction.type.toLowerCase().includes(keyword) ||
            transaction.date.includes(keyword)
        );

    });

    renderTable(filteredTransactions);

});

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");

    window.location.href = "index.html";

});

themeSwitch.addEventListener("click", () => {

    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {

        localStorage.setItem("theme", "dark");

        themeSwitch.setAttribute("aria-label", "Switch to light mode");

    } else {

        localStorage.setItem("theme", "light");

        themeSwitch.setAttribute("aria-label", "Switch to dark mode");

    }
    updateChartTheme();

});

renderTable();
updateChart();
updateCards();
updateChartTheme();
