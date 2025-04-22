import { useEffect, useState } from 'react';
import { Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTransactionStore, Transaction, TransactionType } from '../stores/transactionStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useForm } from 'react-hook-form';

interface TransactionFormData {
  description: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
}

const Transactions = () => {
  const {
    transactions,
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
  } = useTransactionStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>();

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  useEffect(() => {
    if (editingTransaction) {
      setValue('description', editingTransaction.description);
      setValue('amount', editingTransaction.amount);
      setValue('category', editingTransaction.category);
      setValue('date', editingTransaction.date.split('T')[0]);
      setValue('type', editingTransaction.type);
      setIsFormOpen(true);
    }
  }, [editingTransaction, setValue]);

  const onSubmit = async (data: TransactionFormData) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction._id, data);
    } else {
      await addTransaction(data);
    }
    
    reset();
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
    reset();
  };

  // Filtering
  const filteredTransactions = transactions.filter((transaction) => {
    return filterType === 'all' || transaction.type === filterType;
  });

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setEditingTransaction(null);
            reset();
          }}
          leftIcon={<Plus size={16} />}
        >
          {isFormOpen ? "Cancel" : "Add Transaction"}
        </Button>
      </div>

      {/* Transaction Form */}
      {isFormOpen && (
        <Card className="mb-6 animate-slide-down" title={editingTransaction ? "Edit Transaction" : "Add Transaction"}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    errors.description ? 'border-error-300' : 'border-gray-300'
                  }`}
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
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
                  <option value="Income">Income</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-error-600">{errors.category.message}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                    errors.date ? 'border-error-300' : 'border-gray-300'
                  }`}
                  {...register('date', { required: 'Date is required' })}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-error-600">{errors.date.message}</p>
                )}
              </div>

              {/* Type */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <div className="mt-2 space-x-4 flex">
                  <div className="flex items-center">
                    <input
                      id="income"
                      type="radio"
                      value="income"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                      {...register('type', { required: 'Transaction type is required' })}
                    />
                    <label htmlFor="income" className="ml-2 block text-sm text-gray-700">
                      Income
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="expense"
                      type="radio"
                      value="expense"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                      {...register('type', { required: 'Transaction type is required' })}
                    />
                    <label htmlFor="expense" className="ml-2 block text-sm text-gray-700">
                      Expense
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="transfer"
                      type="radio"
                      value="transfer"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                      {...register('type', { required: 'Transaction type is required' })}
                    />
                    <label htmlFor="transfer" className="ml-2 block text-sm text-gray-700">
                      Transfer
                    </label>
                  </div>
                </div>
                {errors.type && (
                  <p className="mt-1 text-sm text-error-600">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" isLoading={loading}>
                {editingTransaction ? 'Update' : 'Save'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Filter size={18} className="text-gray-400" />
        <div className="flex space-x-2">
          <Button
            size="small"
            variant={filterType === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilterType('all')}
          >
            All
          </Button>
          <Button
            size="small"
            variant={filterType === 'income' ? 'primary' : 'outline'}
            onClick={() => setFilterType('income')}
          >
            Income
          </Button>
          <Button
            size="small"
            variant={filterType === 'expense' ? 'primary' : 'outline'}
            onClick={() => setFilterType('expense')}
          >
            Expenses
          </Button>
          <Button
            size="small"
            variant={filterType === 'transfer' ? 'primary' : 'outline'}
            onClick={() => setFilterType('transfer')}
          >
            Transfers
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'income' 
                      ? 'text-success-600' 
                      : transaction.type === 'expense'
                        ? 'text-error-600'
                        : 'text-gray-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                    ${transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-error-600 hover:text-error-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {currentTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstTransaction + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastTransaction, filteredTransactions.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredTransactions.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
                      currentPage === 1 
                        ? 'cursor-not-allowed'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === i + 1
                          ? 'z-10 bg-primary-500 text-white'
                          : 'text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
                      currentPage === totalPages 
                        ? 'cursor-not-allowed'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;