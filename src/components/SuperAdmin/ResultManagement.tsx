import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Plus, Edit, Eye, Upload, Download, Medal, Award } from 'lucide-react';
import { resultService } from '../../services/resultService';
import { eventService } from '../../services/eventService';
import { useApi, useMutation } from '../../hooks/useApi';
import { ParticipantResult, Event } from '../../types';

export const ResultManagement: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');


  const fetchEvents = useCallback(() => eventService.getAllEvents(), []);
      const fetchResults = useCallback(() => resultService.getAllResults(), []);

      const { data: events, loading: eventsLoading } = useApi(
    fetchEvents,
    { immediate: true }
  );

  const { data: results, loading: resultsLoading, error, refetch } = useApi(
   fetchResults,
    { immediate: true }
  );

  const createResultMutation = useMutation(
    (data: any) => resultService.createResult(data),
    {
      onSuccess: () => {
        refetch();
        setShowCreateModal(false);
        setSelectedEvent('');
      }
    }
  );

  const publishResultsMutation = useMutation(
    (eventId: string) => resultService.publishResults(eventId),
    {
      onSuccess: () => refetch()
    }
  );

  const generateCertificateMutation = useMutation(
    (resultId: string) => resultService.generateCertificate(resultId),
    {
      onSuccess: () => refetch()
    }
  );

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedEvent) {
      try {
        await resultService.uploadResultsFile(selectedEvent, file);
        refetch();
      } catch (error) {
        console.error('Error uploading results:', error);
      }
    }
  };

  const handleExportResults = async (eventId: string) => {
    try {
      await resultService.exportResults(eventId);
    } catch (error) {
      console.error('Error exporting results:', error);
    }
  };

  const CreateResultModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Compition Results</h2>
          <button
            onClick={() => setShowCreateModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Compition *
              </label>
              <select 
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose an event</option>
                {events?.filter(e => e.status === 'completed' || e.status === 'active').map(event => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Result Type *
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="ranking">Position Ranking</option>
                <option value="score">Score Based</option>
                <option value="time">Time Based</option>
                <option value="points">Points Based</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Results File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Click to upload results file or drag and drop</p>
              <p className="text-sm text-gray-500">Excel (.xlsx) or CSV files only</p>
              <input 
                type="file" 
                accept=".xlsx,.csv" 
                onChange={handleBulkUpload}
                className="hidden" 
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Entry</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((position) => (
                <div key={position} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="number"
                      value={position}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Participant
                    </label>
                    <input
                      type="text"
                      placeholder="Participant name"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entity
                    </label>
                    <input
                      type="text"
                      placeholder="Entity name"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Score/Time
                    </label>
                    <input
                      type="text"
                      placeholder="Score or time"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add More Positions
            </button>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={createResultMutation.loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {createResultMutation.loading ? 'Publishing...' : 'Publish Results'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const groupedResults = results?.reduce((acc, result) => {
    if (!acc[result.eventId]) {
      acc[result.eventId] = {
        eventName: result.eventName,
        results: []
      };
    }
    acc[result.eventId].results.push(result);
    return acc;
  }, {} as Record<string, { eventName: string; results: ParticipantResult[] }>) || {};

  if (resultsLoading || eventsLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
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
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading results</h3>
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
        <h1 className="text-3xl font-bold text-gray-900">Result Management</h1>
        <p className="text-gray-600 mt-2">Create and manage event results and rankings</p>
      </div>

      {/* Header Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
              <Upload className="w-5 h-5" />
              Bulk Upload
              <input
                type="file"
                accept=".xlsx,.csv"
                onChange={handleBulkUpload}
                className="hidden"
              />
            </label>
            <button 
              onClick={() => handleExportResults('all')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Results
            </button>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Results
          </button>
        </div>
      </div>

      {/* Compitions with Results */}
      <div className="grid grid-cols-1 gap-8">
        {Object.entries(groupedResults).map(([eventId, eventData]) => (
          <div key={eventId} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{eventData.eventName}</h2>
                <p className="text-gray-600">Results published and available for download</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button 
                  onClick={() => handleExportResults(eventId)}
                  className="bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Position</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Participant</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Entity</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Certificate</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {eventData.results.map((result, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {result.position && result.position <= 3 && (
                            <span className="mr-2 text-lg">
                              {result.position === 1 ? '🥇' : result.position === 2 ? '🥈' : '🥉'}
                            </span>
                          )}
                          <span className="font-semibold text-gray-900">#{result.position || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">Participant {index + 1}</p>
                      </td>
                      <td className="py-4 px-4 text-gray-900">Entity {index + 1}</td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">
                          {result.score ? `${result.score}/100` : result.time || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {result.certificate ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Generated
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            Not Generated
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="bg-blue-100 text-blue-700 py-1 px-3 rounded hover:bg-blue-200 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          {!result.certificate && (
                            <button
                              onClick={() => generateCertificateMutation.mutate(result.eventId)}
                              disabled={generateCertificateMutation.loading}
                              className="bg-yellow-100 text-yellow-700 py-1 px-3 rounded hover:bg-yellow-200 transition-colors disabled:opacity-50"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                          )}
                          {result.certificate && (
                            <button
                              onClick={() => navigate(`/certificate/${result.eventId}`)}
                              className="bg-green-100 text-green-700 py-1 px-3 rounded hover:bg-green-200 transition-colors"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Certificate Generation */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-yellow-800">Certificate Generation</h3>
                  <p className="text-sm text-yellow-700">Generate certificates for top 3 positions</p>
                </div>
                <button 
                  onClick={() => generateCertificateMutation.mutate(eventId)}
                  disabled={generateCertificateMutation.loading}
                  className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Award className="w-4 h-4" />
                  {generateCertificateMutation.loading ? 'Generating...' : 'Generate Certificates'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compitions Pending Results */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Compitions Pending Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.filter(e => e.status === 'completed' && !groupedResults[e.id]).map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Pending Results
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{event.name}</h3>
              <p className="text-gray-600 mb-4">Compition Date: {new Date(event.date).toLocaleDateString()}</p>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Create Results
              </button>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && <CreateResultModal />}
    </div>
  );
};