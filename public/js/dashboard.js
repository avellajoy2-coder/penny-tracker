
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const message = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

// LOAD EXPENSES
async function loadExpenses() {
    try {
        const response = await fetch("/api/expenses");

        if (response.status === 401) {
            window.location.href = "/";
            return;
        }

        const expenses = await response.json();

        expenseList.innerHTML = "";

        if (expenses.length === 0) {
            expenseList.textContent = "No expenses added yet.";
            return;
        }

        expenses.forEach(expense => {
            const item = document.createElement("div");

            const title = document.createElement("h4");
            title.textContent = expense.title;

            const details = document.createElement("p");
            details.textContent =
                `${expense.category} | ₹${expense.amount} | ${new Date(expense.date).toLocaleDateString()}`;

            const description = document.createElement("p");
            description.textContent = expense.description || "";

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";

            deleteBtn.addEventListener("click", () => {
                deleteExpense(expense._id);
            });

            item.append(title, details, description, deleteBtn);
            expenseList.appendChild(item);
        });
    } catch (error) {
        message.textContent = "Could not load expenses.";
    }
}

// ADD EXPENSE
expenseForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const expenseData = {
        title: document.getElementById("title").value,
        amount: document.getElementById("amount").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value
    };

    try {
        const response = await fetch("/api/expenses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expenseData)
        });

        const data = await response.json();
        message.textContent = data.message;

        if (response.ok) {
            expenseForm.reset();
            loadExpenses();
        }
    } catch (error) {
        message.textContent = "Could not add expense.";
    }
});

// DELETE EXPENSE
async function deleteExpense(id) {
    try {
        const response = await fetch(`/api/expenses/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();
        message.textContent = data.message;

        if (response.ok) {
            loadExpenses();
        }
    } catch (error) {
        message.textContent = "Could not delete expense.";
    }
}

// LOGOUT
logoutBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/auth/logout", {
            method: "POST"
        });

        if (response.ok) {
            window.location.href = "/";
        }
    } catch (error) {
        message.textContent = "Logout failed.";
    }
});

// RUN WHEN PAGE OPENS
loadExpenses();
