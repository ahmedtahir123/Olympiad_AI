import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Download, Medal, Award, Calendar, Filter, Search } from 'lucide-react';
import { ParticipantResult } from '../../types';

export const ResultsView: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockResults: (ParticipantResult & { participantName: string; participantPhoto: string })[] = [
    {
      eventId: '1',
      eventName: 'Mathematics Competition',
      participantName: 'John Doe',
      participantPhoto: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      position: 1,
      score: 95,
      status: 'completed',
      certificate: 'cert_math_john.pdf'
    },
    {
      eventId: '2',
      eventName: '100m Sprint',
      participantName: 'Jane Smith',
      participantPhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      position: 2,
      time: '12.4s',
      status: 'completed'
    },
    {
      eventId: '3',
      eventName: 'Science Fair',
      participantName: 'Mike Johnson',
      participantPhoto: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      position: 3,
      score: 88,
      status: 'completed',
      certificate: 'cert_science_mike.pdf'
    },
    {
      eventId: '4',
      eventName: 'Basketball Championship',
      participantName: 'Team A',
      participantPhoto: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      position: 1,
      status: 'completed',
      certificate: 'cert_basketball_team.pdf'
    },
    {
      eventId: '5',
      eventName: 'Debate Championship',
      participantName: 'Sarah Wilson',
      participantPhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      status: 'pending'
    }
  ];

  const filteredResults = mockResults.filter(result => {
    const matchesSearch = result.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = filterEvent === 'all' || result.eventName === filterEvent;
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    
    return matchesSearch && matchesEvent && matchesStatus;
  });

  const getPositionDisplay = (position?: number) => {
    if (!position) return null;
    
    switch (position) {
      case 1: return { emoji: '🥇', text: '1st Place', color: 'bg-yellow-100 text-yellow-800' };
      case 2: return { emoji: '🥈', text: '2nd Place', color: 'bg-gray-100 text-gray-800' };
      case 3: return { emoji: '🥉', text: '3rd Place', color: 'bg-orange-100 text-orange-800' };
      default: return { emoji: '🏅', text: `${position}th Place`, color: 'bg-blue-100 text-blue-800' };
    }
  };

  const completedResults = mockResults.filter(r => r.status === 'completed');
  const pendingResults = mockResults.filter(r => r.status === 'pending');
  const totalMedals = completedResults.filter(r => r.position && r.position <= 3).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Results & Achievements</h1>
        <p className="text-gray-600 mt-2">View your school's performance and download certificates</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Total Results</p>
              <p className="text-3xl font-bold">{completedResults.length}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Medals Won</p>
              <p className="text-3xl font-bold">{totalMedals}</p>
            </div>
            <Medal className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Certificates</p>
              <p className="text-3xl font-bold">{completedResults.filter(r => r.certificate).length}</p>
            </div>
            <Award className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Pending</p>
              <p className="text-3xl font-bold">{pendingResults.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search participants or events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              <option value="Mathematics Competition">Mathematics Competition</option>
              <option value="100m Sprint">100m Sprint</option>
              <option value="Science Fair">Science Fair</option>
              <option value="Basketball Championship">Basketball Championship</option>
              <option value="Debate Championship">Debate Championship</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredResults.map((result, index) => {
          const positionInfo = getPositionDisplay(result.position);
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={result.participantPhoto}
                    alt={result.participantName}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{result.participantName}</h3>
                    <p className="text-gray-600 text-sm">{result.eventName}</p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {result.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>

              {result.status === 'completed' && positionInfo && (
                <div className="mb-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${positionInfo.color}`}>
                    <span className="text-lg">{positionInfo.emoji}</span>
                    <span className="font-semibold">{positionInfo.text}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-4">
                {result.score && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-semibold text-gray-900">{result.score}/100</span>
                  </div>
                )}
                {result.time && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold text-gray-900">{result.time}</span>
                  </div>
                )}
              </div>

              {result.status === 'completed' && (
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Result Sheet
                  </button>
                  {result.certificate && (
                    <button 
                      onClick={() => navigate(`/certificate/${result.eventId}`)}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      Certificate
                    </button>
                  )}
                </div>
              )}

              {result.status === 'pending' && (
                <div className="text-center py-4">
                  <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Results will be published soon</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Achievement Summary */}
      {completedResults.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Achievement Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🥇</div>
              <p className="text-3xl font-bold">{completedResults.filter(r => r.position === 1).length}</p>
              <p className="text-blue-100">Gold Medals</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🥈</div>
              <p className="text-3xl font-bold">{completedResults.filter(r => r.position === 2).length}</p>
              <p className="text-blue-100">Silver Medals</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🥉</div>
              <p className="text-3xl font-bold">{completedResults.filter(r => r.position === 3).length}</p>
              <p className="text-blue-100">Bronze Medals</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};