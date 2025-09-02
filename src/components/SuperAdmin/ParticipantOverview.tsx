import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, Download, Eye, School, Trophy, FileText } from 'lucide-react';
import { participantService } from '../../services/participantService';
import { schoolService } from '../../services/schoolService';
import { useApi } from '../../hooks/useApi';
import { Participant } from '../../types';

export const ParticipantOverview: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);


  const fetchPerticipants = useCallback(() => participantService.getAllParticipants(), []);
    const fetchSchools = useCallback(() => schoolService.getAllSchools(), []);
  
    const { data: participants, loading, error, refetch } = useApi(
      fetchPerticipants,
      { immediate: true }
    );

  const { data: schools } = useApi(
    fetchSchools,
    { immediate: true }
  );

  const filteredParticipants = participants?.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = filterSchool === 'all' || participant.schoolId === filterSchool;
    const matchesCategory = filterCategory === 'all' || participant.category === filterCategory;
    
    return matchesSearch && matchesSchool && matchesCategory;
  }) || [];

  const totalParticipants = participants?.length || 0;
  const academicParticipants = participants?.filter(p => p.category === 'academic').length || 0;
  const sportsParticipants = participants?.filter(p => p.category === 'sporting').length || 0;
  const withResults = participants?.filter(p => p.results && p.results.length > 0).length || 0;

  const handleExport = async () => {
    try {
      await participantService.exportParticipants();
    } catch (error) {
      console.error('Error exporting participants:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600">
              <Users className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading participants</h3>
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Participants</h1>
        <p className="text-gray-600 mt-2">Overview of all registered participants across schools</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Participants</p>
              <p className="text-3xl font-bold text-gray-900">{totalParticipants}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Academic</p>
              <p className="text-3xl font-bold text-gray-900">{academicParticipants}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sports</p>
              <p className="text-3xl font-bold text-gray-900">{sportsParticipants}</p>
            </div>
            <Trophy className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">With Results</p>
              <p className="text-3xl font-bold text-gray-900">{withResults}</p>
            </div>
            <Trophy className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search participants or schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterSchool}
                onChange={(e) => setFilterSchool(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Schools</option>
                {schools?.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="sporting">Sports</option>
              </select>
            </div>
          </div>
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Participant</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">School</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Grade</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Events</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Results</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant) => (
                <tr key={participant.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {participant.photo ? (
                        <img
                          src={participant.photo}
                          alt={participant.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{participant.name}</p>
                        <p className="text-sm text-gray-600">Age {participant.age}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <School className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{participant.schoolName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{participant.grade}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      participant.category === 'academic' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {participant.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {participant.eventsRegistered.slice(0, 2).map((eventId, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          Event {index + 1}
                        </span>
                      ))}
                      {participant.eventsRegistered.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{participant.eventsRegistered.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {participant.results && participant.results.length > 0 ? (
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-900">{participant.results.length} result(s)</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No results</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedParticipant(participant)}
                      className="bg-blue-100 text-blue-700 py-1 px-3 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participant Details Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                {selectedParticipant.photo ? (
                  <img
                    src={selectedParticipant.photo}
                    alt={selectedParticipant.name}
                    className="w-20 h-20 rounded-full object-cover mr-6"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mr-6">
                    <Users className="w-10 h-10 text-gray-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedParticipant.name}</h2>
                  <p className="text-gray-600">{selectedParticipant.schoolName}</p>
                  <p className="text-gray-600">{selectedParticipant.grade} • Age {selectedParticipant.age}</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedParticipant.category === 'academic' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedParticipant.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Registrations</h3>
                <div className="space-y-3">
                  {selectedParticipant.eventsRegistered.map((eventId, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">Event {index + 1}</p>
                      <p className="text-sm text-gray-600">Status: Registered</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Documents</h3>
                <div className="space-y-2">
                  {selectedParticipant.documents?.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-sm text-gray-900">{doc}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-sm">No documents uploaded</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Results & Achievements</h3>
                {selectedParticipant.results && selectedParticipant.results.length > 0 ? (
                  <div className="space-y-4">
                    {selectedParticipant.results.map((result, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{result.eventName}</h4>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            {result.position === 1 ? '🥇 1st' : 
                             result.position === 2 ? '🥈 2nd' : 
                             result.position === 3 ? '🥉 3rd' : 
                             `${result.position}th`}
                          </span>
                        </div>
                        {result.score && <p className="text-sm text-gray-600">Score: {result.score}/100</p>}
                        {result.time && <p className="text-sm text-gray-600">Time: {result.time}</p>}
                        {result.certificate && (
                          <button className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                            onClick={() => navigate(`/certificate/${result.eventId}`)}
                            <Download className="w-4 h-4" />
                            Download Certificate
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No results available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredParticipants.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Participants Found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};