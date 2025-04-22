import { useEffect, useState } from 'react';
import { useTransactionStore } from '../stores/transactionStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { Download, Calendar } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f97066', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#d946ef'];

const Reports = () => {
  const { transactions, getTransactions } = useTransactionStore();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [categoryData, setCategoryData] = useState<Array<{ name: string; value: number }>>([]);
  const [monthlyData, setMonthlyData] = useState<Array<{ name: string; income: number; expenses: number }>>([]);
  const [savingsData, setSavingsData] = useState<Array<{ name: string; value: number }>>([]);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  useEffect(() => {
    if (transactions.length > 0) {
      // Process expense category data for pie chart
      const categories = transactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, transaction) => {
          const { category, amount } = transaction;
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += amount;
          return acc;
        }, {} as Record<string, number>);

      const categoryChartData = Object.entries(categories).map(([name, value]) => ({
        name,
        value,
      }));
      setCategoryData(categoryChartData);

      // Process monthly income/expense data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyChartData = months.map((month) => {
        // This would normally use actual data based on transactions
        // For demo purposes, we're generating random data
        return {
          name: month,
          income: Math.floor(Math.random() * 3000) + 2000,
          expenses: Math.floor(Math.random() * 2000) + 1000,
        };
      });
      setMonthlyData(monthlyChartData);

      // Process savings data
      const savingsChartData = months.map((month, index) => {
        // Calculate cumulative savings (income - expenses) over time
        // This would normally use actual data
        const prevSavings = index > 0 ? savingsData[index - 1]?.value || 0 : 0;
        const monthlySavings = monthlyChartData[index].income - monthlyChartData[index].expenses;
        return {
          name: month,
          value: prevSavings + monthlySavings,
        };
      });
      setSavingsData(savingsChartData);
    }
  }, [transactions]);

  const exportData = () => {
    // Demo functionality - would normally export to CSV or PDF
    alert('This would export your financial data in a CSV or PDF format.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        
        <div className="flex space-x-2">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border rounded-l-md ${
                period === 'week'
                  ? 'bg-primary-500 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setPeriod('week')}
            >
              Week
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                period === 'month'
                  ? 'bg-primary-500 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setPeriod('month')}
            >
              Month
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border rounded-r-md ${
                period === 'year'
                  ? 'bg-primary-500 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setPeriod('year')}
            >
              Year
            </button>
          </div>
          
          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
            onClick={exportData}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Distribution */}
        <Card 
          title="Expense Distribution" 
          subtitle="Breakdown of your expenses by category"
          className="animate-slide-up"
        >
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
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Income vs Expenses */}
        <Card 
          title="Income vs Expenses" 
          subtitle="Monthly comparison of your income and expenses"
          className="animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, '']} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10b981" />
                <Bar dataKey="expenses" name="Expenses" fill="#f97066" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Savings Trend */}
        <Card 
          title="Savings Trend" 
          subtitle="Growth of your savings over time"
          className="animate-slide-up lg:col-span-2"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={savingsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Savings']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Financial Summary */}
        <Card 
          title="Financial Summary" 
          subtitle="Overview of your key financial metrics"
          className="animate-slide-up lg:col-span-2"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-success-600">$12,540</p>
              <p className="text-xs text-gray-500 mt-1">+12% from last period</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-error-600">$8,230</p>
              <p className="text-xs text-gray-500 mt-1">-5% from last period</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Net Savings</p>
              <p className="text-2xl font-bold text-primary-600">$4,310</p>
              <p className="text-xs text-gray-500 mt-1">+32% from last period</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Insights</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-success-500 mt-2"></div>
                <p className="ml-2 text-sm text-gray-600">
                  Your savings rate is <span className="font-medium">34.4%</span>, which is excellent compared to the average of 20%.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-warning-500 mt-2"></div>
                <p className="ml-2 text-sm text-gray-600">
                  Your largest expense category is <span className="font-medium">Housing</span> at 35% of total expenses.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500 mt-2"></div>
                <p className="ml-2 text-sm text-gray-600">
                  You've consistently increased your savings each month for the past 6 months.
                </p>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;