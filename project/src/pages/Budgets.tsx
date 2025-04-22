import { useEffect, useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { useBudgetStore, Budget } from '../stores/budgetStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useForm } from 'react-hook-form';

interface BudgetFormData {
  name: string;
  amount: number;
  category: string;
  period: 'monthly' | 'yearly';
}

const Budgets = () => {
  const {
    budgets,
    getBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    loading,
  } = useBudgetStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BudgetFormData>();

  useEffect(() => {
    getBudgets();
  }, [getBudgets]);

  useEffect(() => {
    if (editingBudget) {
      setValue('name', editingBudget.name);
      setValue('amount', editingBudget.amount);
      setValue('category', editingBudget.category);
      setValue('period', editingBudget.period);
      setIsFormOpen(true);
    }
  }, [editingBudget, setValue]);

  const onSubmit = async (data: BudgetFormData) => {
    if (editingBudget) {
      await updateBudget(editingBudget._id, data);
    } else {
      await addBudget(data);
    }
    
    reset();
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
    reset();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <Button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setEditingBudget(null);
            reset();
          }}
          leftIcon={<Plus size={16} />}
        >
          {isFormOpen ? "Cancel" : "Add Budget"}
        </Button>
      </div>

      {/* Budget Form */}
      {isFormOpen && (
        <Card className="mb-6 animate-slide-down" title={editingBudget ? "Edit Budget" : "Add Budget"}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Budget Name
                </label>
                <input
                  type="text"
                  id="name"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    errors.name ? 'border-error-300' : 'border-gray-300'
                  }`}
                  {...register('name', { required: 'Budget name is required' })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="amount"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    errors.amount ? 'border-error-300' : 'border-gray-300'
                  }`}
                  {...register('amount', {
                    required: 'Amount is required',
                    min: {
                      value: 0.01,
                      message: 'Amount must be greater than 0',
                    },
                  })}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-error-600">{errors.amount.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    errors.category ? 'border-error-300' : 'border-gray-300'
                  }`}
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value="">Select category</option>
                  <option value="Housing">Housing</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Food">Food</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Personal">Personal</option>
                  <option value="Education">Education</option>
                  <option value="Savings">Savings</option>
                  <option value="Debt">Debt</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-error-600">{errors.category.message}</p>
                )}
              </div>

              {/* Period */}
              <div>
                <label htmlFor="period" className="block text-sm font-medium text-gray-700">
                  Period
                </label>
                <select
                  id="period"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    errors.period ? 'border-error-300' : 'border-gray-300'
                  }`}
                  {...register('period', { required: 'Period is required' })}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                {errors.period && (
                  <p className="mt-1 text-sm text-error-600">{errors.period.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" isLoading={loading}>
                {editingBudget ? 'Update' : 'Save'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.amount) * 100;
          const isOverBudget = percentage > 100;
          
          return (
            <Card 
              key={budget._id} 
              className="animate-slide-up"
              title={budget.name}
              subtitle={`${budget.category} • ${budget.period === 'monthly' ? 'Monthly' : 'Yearly'}`}
            >
              <div className="space-y-4">
                {/* Budget Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{isOverBudget ? 'Over budget by:' : 'Remaining:'}</span>
                    <span className={isOverBudget ? 'text-error-600 font-medium' : 'text-success-600 font-medium'}>
                      {isOverBudget 
                        ? `$${(budget.spent - budget.amount).toFixed(2)}` 
                        : `$${(budget.amount - budget.spent).toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Spent:</span>
                    <span className="font-medium">${budget.spent.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Total Budget:</span>
                    <span className="font-medium">${budget.amount.toFixed(2)}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className={`h-2.5 rounded-full ${
                        percentage >= 100
                          ? 'bg-error-500'
                          : percentage >= 80
                            ? 'bg-warning-500'
                            : 'bg-success-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-right text-sm font-medium">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex justify-between pt-2">
                  <Button
                    size="small"
                    variant="outline"
                    onClick={() => handleEdit(budget)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="danger"
                    leftIcon={<Trash size={14} />}
                    onClick={() => handleDelete(budget._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
        
        {budgets.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first budget to start tracking your spending against your financial goals.
              </p>
              <Button
                onClick={() => {
                  setIsFormOpen(true);
                  setEditingBudget(null);
                  reset();
                }}
                leftIcon={<Plus size={16} />}
              >
                Add Budget
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Budgets;