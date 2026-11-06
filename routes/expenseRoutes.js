
const express = require("express");
const Expense = require("../models/Expense");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL EXPENSES
router.get("/", requireAuth, async (req, res) => {
    try {
        const expenses = await Expense.find({
            user: req.session.userId
        }).sort({ date: -1 });

        res.json(expenses);
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch expenses"
        });
    }
});

// ADD EXPENSE
router.post("/", requireAuth, async (req, res) => {
    try {
        const { title, amount, category, date, description } = req.body;

        if (!title || !amount || !category) {
            return res.status(400).json({
                message: "Please fill in all required fields"
            });
        }

        const expense = await Expense.create({
            user: req.session.userId,
            title,
            amount,
            category,
            date: date || Date.now(),
            description
        });

        res.status(201).json({
            message: "Expense added successfully",
            expense
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not add expense"
        });
    }
});

// UPDATE EXPENSE
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const { title, amount, category, date, description } = req.body;

        const expense = await Expense.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.session.userId
            },
            {
                title,
                amount,
                category,
                date,
                description
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Expense updated successfully",
            expense
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not update expense"
        });
    }
});

// DELETE EXPENSE
router.delete("/:id", requireAuth, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.session.userId
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json({
            message: "Expense deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not delete expense"
        });
    }
});

module.exports = router;
