import React from 'react';
import { Trophy, Users, Calendar, CreditCard, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SchoolAdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Events Joined', value: '12', icon: Calendar, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Total Participants', value: '45', icon: Users, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
    { label: 'Payment Status', value: 'Paid', icon: CreditCard, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Results Available', value: '8', icon: Trophy, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50' },
  ];

  const recentResults = [
    { event: 'Mathematics Quiz', participant: 'John Doe', position: '1st', points: '95/100' },
    { event: '100m Sprint', participant: 'Jane Smith', position: '2nd', points: '12.4s' },
    { event: 'Essay Writing', participant: 'Mike Johnson', position: '3rd', points: '88/100' },
    { event: 'Basketball', participant: 'Team A', position: '1st', points: 'Champions' },
  ];

  const upcomingEvents = [
    { name: 'Science Fair', date: '2025-02-15', category: 'Academic', status: 'Registered' },
    { name: 'Swimming Championship', date: '2025-02-20', category: 'Sports', status: 'Pending' },
    { name: 'Debate Competition', date: '2025-02-25', category: 'Academic', status: 'Registered' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of {user?.schoolName}'s Olympics participation</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">+12% from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Results */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Results</h2>
            <Award className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {recentResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div>
                  <h3 className="font-semibold text-gray-900">{result.event}</h3>
                  <p className="text-gray-600 text-sm">{result.participant}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.position === '1st' ? 'bg-yellow-100 text-yellow-800' :
                    result.position === '2nd' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {result.position}
                  </span>
                  <p className="text-gray-600 text-sm mt-1">{result.points}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div>
                  <h3 className="font-semibold text-gray-900">{event.name}</h3>
                  <p className="text-gray-600 text-sm">{event.category} • {event.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.status === 'Registered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-all duration-200 transform hover:scale-105">
            <Users className="w-6 h-6 mb-2" />
            <h3 className="font-semibold">Add Participants</h3>
            <p className="text-sm opacity-80">Register new students</p>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-all duration-200 transform hover:scale-105">
            <Calendar className="w-6 h-6 mb-2" />
            <h3 className="font-semibold">Browse Events</h3>
            <p className="text-sm opacity-80">Find new competitions</p>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-all duration-200 transform hover:scale-105">
            <Trophy className="w-6 h-6 mb-2" />
            <h3 className="font-semibold">View Results</h3>
            <p className="text-sm opacity-80">Check latest scores</p>
          </button>
        </div>
      </div>
    </div>
  );
};