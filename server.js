require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Check that the session secret exists
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    console.error("ERROR: SESSION_SECRET is missing from .env");
    process.exit(1);
}

// Session configuration
app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        }
    })
);

// API routes (after middleware)
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Start server
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Penny is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();