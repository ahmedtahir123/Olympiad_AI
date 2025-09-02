import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Calendar, MapPin, Clock, Users, Medal, Eye, Filter, Search } from 'lucide-react';
import { drawService } from '../../services/drawService';
import { useApi } from '../../hooks/useApi';
import { CompetitionDraw, Match } from '../../types';

export const CompetitionDraws: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDraw, setSelectedDraw] = useState<CompetitionDraw | null>(null);

  const fetchDraws = useCallback(() => drawService.getAllDraws(), []);
          const { data: draws, loading, error, refetch } = useApi(fetchDraws, {
          immediate: true,
        });

  const filteredDraws = draws?.filter(draw => {
    const matchesEvent = selectedEvent === 'all' || draw.eventId === selectedEvent;
    const matchesSearch = draw.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draw.drawType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEvent && matchesSearch;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-gray-200 bg-gray-50';
      case 'ongoing': return 'border-green-200 bg-green-50 animate-pulse';
      case 'completed': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const renderBracket = (draw: CompetitionDraw) => {
    const rounds = draw.matches.reduce((acc, match) => {
      if (!acc[match.round]) acc[match.round] = [];
      acc[match.round].push(match);
      return acc;
    }, {} as Record<number, Match[]>);

    const maxRound = Math.max(...Object.keys(rounds).map(Number));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{draw.eventName} - {draw.drawType}</h3>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(draw.status)}`}>
              {draw.status.charAt(0).toUpperCase() + draw.status.slice(1)}
            </span>
            {draw.status === 'ongoing' && (
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium">Live</span>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex space-x-8 min-w-max p-4">
            {Object.entries(rounds).map(([roundNum, matches]) => (
              <div key={roundNum} className="flex flex-col space-y-4">
                <h4 className="text-center font-semibold text-gray-700 mb-4">
                  {roundNum === maxRound.toString() ? 'Final' : 
                   roundNum === (maxRound - 1).toString() ? 'Semi-Final' : 
                   `Round ${roundNum}`}
                </h4>
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className={`border-2 rounded-lg p-4 w-64 ${getMatchStatusColor(match.status)}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Match {match.position}</span>
                        {match.status === 'ongoing' && (
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className={`flex items-center justify-between p-2 rounded ${
                          match.winner === match.participant1 ? 'bg-green-100 border-green-300' : 'bg-white'
                        }`}>
                          <span className="font-medium text-sm">{match.participant1 || 'TBD'}</span>
                          <span className="font-bold">{match.score || '-'}</span>
                        </div>
                        <div className="text-center text-xs text-gray-400">vs</div>
                        <div className={`flex items-center justify-between p-2 rounded ${
                          match.winner === match.participant2 ? 'bg-green-100 border-green-300' : 'bg-white'
                        }`}>
                          <span className="font-medium text-sm">{match.participant2 || 'TBD'}</span>
                          <span className="font-bold">{match.score || '-'}</span>
                        </div>
                      </div>

                      {match.scheduledTime && (
                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(match.scheduledTime).toLocaleString()}</span>
                        </div>
                      )}

                      {match.venue && (
                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                          <MapPin className="w-3 h-3" />
                          <span>{match.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading draws</h3>
              <p className="text-sm text-red-700 mt-1">{error.message}</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Competition Draws</h1>
          <p className="text-gray-600 mt-1">View tournament brackets and match schedules</p>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-sm text-gray-500">{filteredDraws.length} tournaments</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              <option value="academic">Academic Events</option>
              <option value="sporting">Sporting Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tournament Cards */}
      {!selectedDraw ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDraws.map((draw) => (
            <div
              key={draw.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedDraw(draw)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-900">{draw.eventName}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(draw.status)}`}>
                    {draw.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Medal className="w-4 h-4 mr-2" />
                    <span>{draw.drawType.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{draw.totalParticipants} participants</span>
                  </div>

                  {draw.createdAt && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(draw.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-gray-500">
                      {draw.matches.filter(m => m.status === 'completed').length} / {draw.matches.length} matches completed
                    </span>
                    <Eye className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <button
              onClick={() => setSelectedDraw(null)}
              className="text-blue-600 hover:text-blue-800 font-medium mb-4"
            >
              ← Back to tournaments
            </button>
          </div>
          <div className="p-6">
            {renderBracket(selectedDraw)}
          </div>
        </div>
      )}

      {filteredDraws.length === 0 && !loading && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tournaments found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedEvent !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Tournament draws will appear here once created by administrators'
            }
          </p>
        </div>
      )}
    </div>
  );
};
