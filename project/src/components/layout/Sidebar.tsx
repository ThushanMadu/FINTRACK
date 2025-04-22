import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  BarChart,
  Settings,
  X,
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/transactions', label: 'Transactions', icon: <Receipt size={20} /> },
    { to: '/budgets', label: 'Budgets', icon: <PiggyBank size={20} /> },
    { to: '/reports', label: 'Reports', icon: <BarChart size={20} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-500 text-white p-1.5 rounded">
                <DollarSign size={20} />
              </div>
              <span className="text-lg font-semibold text-gray-900">FinTrack</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `
                  flex items-center px-3 py-2.5 text-sm font-medium rounded-md
                  transition-colors duration-200
                  ${
                    isActive
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
            <p>© 2025 FinTrack. All rights reserved.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;