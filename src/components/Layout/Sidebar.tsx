import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  CreditCard, 
  Users, 
  Trophy, 
  Settings,
  School,
  UserCheck,
  DollarSign,
  BarChart3,
  Bell,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const schoolAdminItems = [
    { id: '/dashboard', label: 'Dashboard', icon: Home },
    { id: '/events', label: 'Compitions', icon: Calendar },
    { id: '/draws', label: 'Competition Draws', icon: Trophy },
    { id: '/participants', label: 'Participants', icon: Users },
    { id: '/payments', label: 'Payments', icon: CreditCard },
    { id: '/results', label: 'Results', icon: Trophy },
    { id: '/profile', label: 'Profile', icon: Settings },
  ];

  const superAdminItems = [
    { id: '/dashboard', label: 'Dashboard', icon: Home },
    { id: '/entities', label: 'Entities', icon: School },
    { id: '/events', label: 'Compitions', icon: Calendar },
    { id: '/draws', label: 'Competition Draws', icon: Trophy },
    { id: '/participants', label: 'All Participants', icon: UserCheck },
    { id: '/payments', label: 'Payments', icon: DollarSign },
    { id: '/results', label: 'Results', icon: Trophy },
    { id: '/schedule', label: 'Schedule', icon: BarChart3 },
    { id: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const menuItems = user?.role === 'super_admin' ? superAdminItems : schoolAdminItems;

  return (
    <div className="bg-white h-screen w-64 shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Saudi Arabia Olympics</h1>
            <p className="text-sm text-gray-500">{user?.role === 'super_admin' ? 'Admin Panel' : 'Entity Panel'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={user?.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.schoolName || 'System Admin'}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};