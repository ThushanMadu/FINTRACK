import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { useForm } from 'react-hook-form';
import { Save, User, Lock, Bell, Download, ArrowUpRight } from 'lucide-react';

interface ProfileFormData {
  name: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>();

  const onProfileSubmit = (data: ProfileFormData) => {
    // This would update the user's profile in a real app
    console.log('Profile update:', data);
    alert('Profile updated successfully!');
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    // This would update the user's password in a real app
    console.log('Password update:', data);
    alert('Password updated successfully!');
  };

  const exportData = () => {
    // This would export the user's data in a real app
    alert('This would export all your data as a CSV file.');
  };

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // This would delete the user's account in a real app
      alert('Account deleted successfully.');
      logout();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <nav className="flex flex-col">
              <button
                className={`px-4 py-3 text-left text-sm font-medium border-l-2 ${
                  activeTab === 'profile'
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  Profile
                </div>
              </button>
              <button
                className={`px-4 py-3 text-left text-sm font-medium border-l-2 ${
                  activeTab === 'security'
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <div className="flex items-center">
                  <Lock size={16} className="mr-2" />
                  Security
                </div>
              </button>
              <button
                className={`px-4 py-3 text-left text-sm font-medium border-l-2 ${
                  activeTab === 'notifications'
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <div className="flex items-center">
                  <Bell size={16} className="mr-2" />
                  Notifications
                </div>
              </button>
              <button
                className={`px-4 py-3 text-left text-sm font-medium border-l-2 ${
                  activeTab === 'data'
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('data')}
              >
                <div className="flex items-center">
                  <Download size={16} className="mr-2" />
                  Data
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card title="Profile Settings" subtitle="Update your personal information">
              <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      profileErrors.name ? 'border-error-300' : 'border-gray-300'
                    }`}
                    {...registerProfile('name', { required: 'Name is required' })}
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-error-600">{profileErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      profileErrors.email ? 'border-error-300' : 'border-gray-300'
                    }`}
                    {...registerProfile('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-error-600">{profileErrors.email.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" leftIcon={<Save size={16} />}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card title="Security Settings" subtitle="Update your password and security preferences">
              <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      passwordErrors.currentPassword ? 'border-error-300' : 'border-gray-300'
                    }`}
                    {...registerPassword('currentPassword', { required: 'Current password is required' })}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-error-600">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      passwordErrors.newPassword ? 'border-error-300' : 'border-gray-300'
                    }`}
                    {...registerPassword('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-error-600">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      passwordErrors.confirmPassword ? 'border-error-300' : 'border-gray-300'
                    }`}
                    {...registerPassword('confirmPassword', {
                      required: 'Please confirm your new password',
                      validate: (value) =>
                        value === watchPassword('newPassword') || 'Passwords do not match',
                    })}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-error-600">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" leftIcon={<Save size={16} />}>
                    Update Password
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Danger Zone</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <div className="mt-4">
                  <Button variant="danger" onClick={deleteAccount}>
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card title="Notification Preferences" subtitle="Manage how you receive notifications">
              <div className="space-y-4">
                <div className="rounded-md border border-gray-200 divide-y">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive email updates about your account</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Budget Alerts</h3>
                      <p className="text-sm text-gray-500">Receive alerts when you're approaching budget limits</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Weekly Reports</h3>
                      <p className="text-sm text-gray-500">Receive weekly summaries of your financial activity</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">New Features</h3>
                      <p className="text-sm text-gray-500">Learn about new features and improvements</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button leftIcon={<Save size={16} />}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'data' && (
            <Card title="Data Management" subtitle="Export or delete your financial data">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900">Export Your Data</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Download all your financial data in CSV format. This includes all transactions, budgets, and account information.
                  </p>
                  <div className="mt-4">
                    <Button variant="outline" leftIcon={<Download size={16} />} onClick={exportData}>
                      Export Data
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900">Connect External Accounts</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Link your bank accounts, credit cards, and investment accounts to automatically import transactions.
                  </p>
                  <div className="mt-4">
                    <Button variant="outline" leftIcon={<ArrowUpRight size={16} />}>
                      Connect Accounts
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900">Data Privacy</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We take your data privacy seriously. Your financial information is encrypted and never shared with third parties without your consent.
                  </p>
                  <div className="mt-4">
                    <a href="#" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                      View Privacy Policy
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;