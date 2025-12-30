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
import { useLanguage } from '../../context/LanguageContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const schoolAdminItems = [
    { id: '/dashboard', label: t('Dashboard'), icon: Home },
    { id: '/events', label: t('Competitions'), icon: Calendar },
    { id: '/draws', label: t('Competition Draws'), icon: Trophy },
    { id: '/participants', label: t('Participants'), icon: Users },
    { id: '/payments', label: t('Payments'), icon: CreditCard },
    { id: '/results', label: t('Results'), icon: Trophy },
    { id: '/profile', label: t('Profile'), icon: Settings },
  ];

  const superAdminItems = [
    { id: '/dashboard', label: t('Dashboard'), icon: Home },
    { id: '/entities', label: t('Entities'), icon: School },
    { id: '/events', label: t('Competitions'), icon: Calendar },
    { id: '/draws', label: t('Competition Draws'), icon: Trophy },
    { id: '/participants', label: t('All Participants'), icon: UserCheck },
    { id: '/payments', label: t('Payments'), icon: DollarSign },
    { id: '/results', label: t('Results'), icon: Trophy },
    { id: '/schedule', label: t('Schedule'), icon: BarChart3 },
    { id: '/notifications', label: t('Notifications'), icon: Bell },
  ];

  const menuItems = user?.role === 'super_admin' ? superAdminItems : schoolAdminItems;

  return (
       <div className="bg-white h-screen w-64 shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className= {!isRTL ?  "flex items-center space-x-3" : "flex items-center space-x-reverse space-x-3"}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">{t('appTitle')}</h1>
              <p className="text-sm text-gray-500">
                {user?.role === 'super_admin' ? t('adminPanel') : t('entityPanel')}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 py-6">
          <nav className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center ${isRTL && 'space-x-reverse' } space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
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

        {/* Footer */}
        <div className="p-4 border-t">
          <div className={`flex items-center space-x-3 ${isRTL && 'space-x-reverse' } mb-4`}>
            <img
              src={
                user?.avatar ||
                'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop'
              }
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
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>
      </div>
    );
};