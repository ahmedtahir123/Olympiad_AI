import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Plus, Edit, Trash2, Calendar, MapPin, Clock, Users, Search, Filter, Play, Pause, RotateCcw } from 'lucide-react';
import { drawService } from '../../services/drawService';
import { eventService } from '../../services/eventService';
import { useApi } from '../../hooks/useApi';
import { Draw, Event, Match } from '../../types';

export const DrawManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDraw, setEditingDraw] = useState<Draw | null>(null);
  const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchDraws = useCallback(() => drawService.getAllDraws(), []);
    const fetchEvents = useCallback(() => eventService.getAllEvents(), []);
      
        const { data: draws, loading, error, refetch } = useApi(fetchDraws, {
        immediate: true,
      });
  
       const { data: events } = useApi(fetchEvents, {
        immediate: true,
      });

  const [formData, setFormData] = useState({
    eventId: '',
    tournamentType: 'single_elimination',
    startDate: '',
    venue: '',
    participants: [] as string[]
  });

  const filteredDraws = draws?.filter(draw => {
    const matchesSearch = draw.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draw.tournamentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || draw.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDraw) {
        await drawService.updateDraw(editingDraw.id, formData);
      } else {
        await drawService.createDraw(formData);
      }

      // Reset form
      setFormData({
        eventId: '',
        tournamentType: 'single_elimination',
        startDate: '',
        venue: '',
        participants: []
      });
      setShowCreateForm(false);
      setEditingDraw(null);
      refetch();
    } catch (error) {
      console.error('Error saving draw:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this draw?')) {
      try {
        await drawService.deleteDraw(id);
        refetch();
      } catch (error) {
        console.error('Error deleting draw:', error);
      }
    }
  };

  const handleEdit = (draw: Draw) => {
    setEditingDraw(draw);
    setFormData({
      eventId: draw.eventId,
      tournamentType: draw.tournamentType,
      startDate: draw.startDate || '',
      venue: draw.venue || '',
      participants: draw.participants || []
    });
    setShowCreateForm(true);
  };

  const handleGenerateBracket = async (drawId: string) => {
    try {
      await drawService.generateBracket(drawId);
      refetch();
    } catch (error) {
      console.error('Error generating bracket:', error);
    }
  };

  const handleUpdateMatchScore = async (matchId: string, score1: number, score2: number, winner: string) => {
    try {
      await drawService.updateMatchScore(matchId, { score1, score2, winner });
      refetch();
    } catch (error) {
      console.error('Error updating match score:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'border-blue-200 bg-blue-50';
      case 'live': return 'border-green-200 bg-green-50 animate-pulse';
      case 'completed': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const renderBracket = (draw: Draw) => {
    const rounds = draw.matches.reduce((acc, match) => {
      if (!acc[match.round]) acc[match.round] = [];
      acc[match.round].push(match);
      return acc;
    }, {} as Record<number, Match[]>);

    const maxRound = Math.max(...Object.keys(rounds).map(Number));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{draw.eventName} - {draw.tournamentType}</h3>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(draw.status)}`}>
              {draw.status.charAt(0).toUpperCase() + draw.status.slice(1)}
            </span>
            {draw.status === 'live' && (
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
                        <span className="text-xs text-gray-500">Match {match.matchNumber}</span>
                        {match.status === 'live' && (
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
                          <input
                            type="number"
                            value={match.score1 || ''}
                            onChange={(e) => handleUpdateMatchScore(match.id, parseInt(e.target.value) || 0, match.score2 || 0, match.winner || '')}
                            className="w-12 text-center border rounded px-1"
                            disabled={match.status === 'completed'}
                          />
                        </div>
                        <div className="text-center text-xs text-gray-400">vs</div>
                        <div className={`flex items-center justify-between p-2 rounded ${
                          match.winner === match.participant2 ? 'bg-green-100 border-green-300' : 'bg-white'
                        }`}>
                          <span className="font-medium text-sm">{match.participant2 || 'TBD'}</span>
                          <input
                            type="number"
                            value={match.score2 || ''}
                            onChange={(e) => handleUpdateMatchScore(match.id, match.score1 || 0, parseInt(e.target.value) || 0, match.winner || '')}
                            className="w-12 text-center border rounded px-1"
                            disabled={match.status === 'completed'}
                          />
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
              <p className="text-sm text-red-700 mt-1">{error}</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Draw Management</h1>
          <p className="text-gray-600 mt-1">Create and manage tournament brackets</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Draw</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search draws..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Draws Grid */}
      {!selectedDraw ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDraws.map((draw) => (
            <div
              key={draw.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
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
                    <Trophy className="w-4 h-4 mr-2" />
                    <span>{draw.tournamentType?.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{draw.totalParticipants} participants</span>
                  </div>

                  {draw.startDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(draw.startDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {draw.venue && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{draw.venue}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-gray-500">
                      {draw.matches.filter(m => m.status === 'completed').length} / {draw.matches.length} matches
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedDraw(draw)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Bracket
                      </button>
                      <button
                        onClick={() => handleEdit(draw)}
                        className="text-gray-600 hover:text-gray-800 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(draw.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
              ← Back to draws
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No draws found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first tournament draw to get started'
            }
          </p>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingDraw ? 'Edit Draw' : 'Create New Draw'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingDraw(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event
                </label>
                <select
                  required
                  value={formData.eventId}
                  onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Event</option>
                  {events?.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tournament Type
                </label>
                <select
                  required
                  value={formData.tournamentType}
                  onChange={(e) => setFormData({ ...formData, tournamentType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="single_elimination">Single Elimination</option>
                  <option value="double_elimination">Double Elimination</option>
                  <option value="round_robin">Round Robin</option>
                  <option value="group_stage">Group Stage</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter venue"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingDraw(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingDraw ? 'Update' : 'Create'} Draw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

