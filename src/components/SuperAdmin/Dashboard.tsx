import React from 'react';
import { School, Users, Calendar, DollarSign, TrendingUp, Trophy, AlertCircle } from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Registered Schools', value: '156', icon: School, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', change: '+12%' },
    { label: 'Total Participants', value: '2,847', icon: Users, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', change: '+18%' },
    { label: 'Active Events', value: '24', icon: Calendar, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', change: '+5%' },
    { label: 'Revenue Generated', value: '$45,230', icon: DollarSign, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50', change: '+23%' },
  ];

  const recentActivities = [
    { type: 'school', message: 'Riverside High School registered for Basketball Championship', time: '2 hours ago', status: 'success' },
    { type: 'payment', message: 'Payment of $350 received from Springfield High', time: '4 hours ago', status: 'success' },
    { type: 'event', message: 'Mathematics Competition results published', time: '6 hours ago', status: 'info' },
    { type: 'alert', message: 'Low participation in Science Fair - 5 spots remaining', time: '8 hours ago', status: 'warning' },
    { type: 'school', message: 'New school registration: Oakwood Academy', time: '12 hours ago', status: 'info' },
  ];

  const upcomingEvents = [
    { name: 'Mathematics Competition', date: '2025-02-15', participants: 75, venue: 'Central Hall' },
    { name: 'Basketball Championship', date: '2025-02-20', participants: 48, venue: 'Sports Complex' },
    { name: 'Science Fair', date: '2025-02-25', participants: 89, venue: 'Exhibition Hall' },
    { name: 'Debate Championship', date: '2025-03-05', participants: 28, venue: 'Auditorium' },
  ];

  const topSchools = [
    { name: 'Springfield High School', participants: 45, events: 8, revenue: '$1,250' },
    { name: 'Riverside Academy', participants: 38, events: 6, revenue: '$980' },
    { name: 'Oakwood High', participants: 32, events: 7, revenue: '$1,100' },
    { name: 'Central School', participants: 29, events: 5, revenue: '$750' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of the Olympics management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className={`p-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-100 text-green-600' :
                  activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {activity.type === 'school' && <School className="w-4 h-4" />}
                  {activity.type === 'payment' && <DollarSign className="w-4 h-4" />}
                  {activity.type === 'event' && <Trophy className="w-4 h-4" />}
                  {activity.type === 'alert' && <AlertCircle className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm font-medium">{activity.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{event.name}</h3>
                  <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{event.participants} participants</span>
                  <span>{event.venue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Schools */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Participating Schools</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">School Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Participants</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Events</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {topSchools.map((school, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {school.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{school.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{school.participants}</td>
                  <td className="py-4 px-4 text-gray-600">{school.events}</td>
                  <td className="py-4 px-4 font-semibold text-green-600">{school.revenue}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};