import express from 'express';
import { check, validationResult } from 'express-validator';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/budgets
// @desc    Get all user budgets
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });
    
    // For each budget, calculate how much has been spent
    for (let budget of budgets) {
      const startDate = new Date();
      let endDate = new Date();
      
      // Set the date range based on budget period
      if (budget.period === 'monthly') {
        startDate.setDate(1); // First day of current month
      } else {
        // Yearly - start from January 1st of current year
        startDate.setMonth(0, 1);
      }
      
      // Get all expenses in the category for the period
      const expenses = await Transaction.find({
        userId: req.user._id,
        type: 'expense',
        category: budget.category,
        date: { $gte: startDate, $lte: endDate },
      });
      
      // Calculate total spent
      const spent = expenses.reduce((total, expense) => total + expense.amount, 0);
      
      // Update the budget with spent amount
      budget.spent = spent;
      await budget.save();
    }
    
    res.json(budgets);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/budgets
// @desc    Create budget
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('amount', 'Amount is required').not().isEmpty(),
      check('amount', 'Amount must be a positive number').isFloat({ min: 0 }),
      check('category', 'Category is required').not().isEmpty(),
      check('period', 'Period must be monthly or yearly').isIn(['monthly', 'yearly']),
    ],
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { name, amount, category, period } = req.body;
      
      // Check if budget already exists for this category and period
      const existingBudget = await Budget.findOne({
        userId: req.user._id,
        category,
        period,
      });
      
      if (existingBudget) {
        return res.status(400).json({
          message: `A budget already exists for ${category} (${period})`,
        });
      }
      
      const budget = new Budget({
        name,
        amount,
        category,
        period,
        userId: req.user._id,
      });
      
      await budget.save();
      
      res.status(201).json(budget);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/budgets/:id
// @desc    Update budget
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, amount, category, period } = req.body;
    
    // Check if budget exists
    let budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    // Check user owns budget
    if (budget.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // If changing category or period, check if a budget already exists
    if (
      (category && category !== budget.category) ||
      (period && period !== budget.period)
    ) {
      const existingBudget = await Budget.findOne({
        userId: req.user._id,
        category: category || budget.category,
        period: period || budget.period,
        _id: { $ne: req.params.id },
      });
      
      if (existingBudget) {
        return res.status(400).json({
          message: `A budget already exists for ${category || budget.category} (${
            period || budget.period
          })`,
        });
      }
    }
    
    // Update budget
    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { $set: { name, amount, category, period } },
      { new: true }
    );
    
    res.json(budget);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/budgets/:id
// @desc    Delete budget
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if budget exists
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    // Check user owns budget
    if (budget.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await Budget.findByIdAndRemove(req.params.id);
    
    res.json({ message: 'Budget removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;