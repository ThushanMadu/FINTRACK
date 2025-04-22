import { BellIcon, MenuIcon, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface HeaderProps {
  toggleSidebar: () => void;
  user: { name: string; email: string } | null;
}

const Header = ({ toggleSidebar, user }: HeaderProps) => {
  const { logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left: Hamburger menu */}
        <button
          className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
          onClick={toggleSidebar}
        >
          <MenuIcon size={24} />
        </button>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Notification bell */}
          <button className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
            <BellIcon size={20} />
          </button>

          {/* User dropdown */}
          <div className="relative inline-block text-left">
            <div className="flex items-center cursor-pointer">
              <div className="bg-gray-200 rounded-full p-2">
                <User size={20} className="text-gray-600" />
              </div>
              <div className="ml-2 hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={() => logout()}
            className="text-sm text-gray-600 hover:text-primary-600 focus:outline-none hidden sm:block"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;