import { useEffect, useState } from 'react';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  DollarSign, 
  PiggyBank, 
  Receipt, 
  TrendingUp 
} from 'lucide-react';
import { useTransactionStore } from '../stores/transactionStore';
import { useBudgetStore } from '../stores/budgetStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Dashboard = () => {
  const { transactions, getTransactions } = useTransactionStore();
  const { budgets, getBudgets } = useBudgetStore();
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    savingsRate: 0,
  });
  
  // Sample data for visualizations
  const [monthlyData, setMonthlyData] = useState<Array<{name: string, income: number, expenses: number}>>([]);
  const [categoryData, setCategoryData] = useState<Array<{name: string, value: number}>>([]);

  useEffect(() => {
    getTransactions();
    getBudgets();
  }, [getTransactions, getBudgets]);

  useEffect(() => {
    if (transactions.length) {
      // Calculate financial stats
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const balance = income - expenses;
      const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

      setStats({ income, expenses, balance, savingsRate });

      // Generate monthly data for the chart
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const monthlyData = months.map(month => ({
        name: month,
        income: Math.floor(Math.random() * 5000) + 2000,
        expenses: Math.floor(Math.random() * 3000) + 1000,
      }));
      setMonthlyData(monthlyData);

      // Generate category data
      const categories = [
        { name: 'Housing', value: 35 },
        { name: 'Food', value: 25 },
        { name: 'Transport', value: 15 },
        { name: 'Entertainment', value: 15 },
        { name: 'Other', value: 10 }
      ];
      setCategoryData(categories);
    }
  }, [transactions]);

  const COLORS = ['#10b981', '#3b82f6', '#f97066', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-2">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/transactions">
          <Button variant="primary" leftIcon={<Receipt size={16} />}>
            Add Transaction
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-success-100 rounded-full p-3">
              <ArrowDownIcon className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Income</p>
              <h3 className="text-xl font-semibold text-gray-900">
                ${stats.income.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>

        {/* Expenses */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-error-100 rounded-full p-3">
              <ArrowUpIcon className="h-6 w-6 text-error-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <h3 className="text-xl font-semibold text-gray-900">
                ${stats.expenses.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>

        {/* Balance */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Current Balance</p>
              <h3 className="text-xl font-semibold text-gray-900">
                ${stats.balance.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>

        {/* Savings Rate */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-secondary-100 rounded-full p-3">
              <PiggyBank className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Savings Rate</p>
              <h3 className="text-xl font-semibold text-gray-900">
                {stats.savingsRate.toFixed(1)}%
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Income/Expense Chart */}
        <Card className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.5s' }} title="Income vs. Expenses">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, '']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10b981" />
                <Bar dataKey="expenses" name="Expenses" fill="#f97066" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense Breakdown */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }} title="Expense Breakdown">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }} title="Recent Transactions">
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.slice(0, 5).map((transaction) => (
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
                    transaction.type === 'income' ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found. Add your first transaction to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {transactions.length > 5 && (
          <div className="mt-4 text-center">
            <Link to="/transactions">
              <Button variant="outline">View All Transactions</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;