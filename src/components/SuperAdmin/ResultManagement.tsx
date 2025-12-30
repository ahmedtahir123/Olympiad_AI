import { Award, Download, Edit, Eye, Plus, Trophy, Upload } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApi, useMutation } from '../../hooks/useApi';
import { eventService } from '../../services/eventService';
import { resultService } from '../../services/resultService';
import { ParticipantResult } from '../../types';

export const ResultManagement: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const { t, isRTL } = useLanguage();


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
    {/* Header */}
    <div
      className={`flex items-center justify-between mb-6 ${
        isRTL ? 'flex-row-reverse' : ''
      }`}
    >
      <h2 className="text-2xl font-bold text-gray-900">
        {t('resultManagementCreateCompetitionResults')}
      </h2>
      <button
        onClick={() => setShowCreateModal(false)}
        className="text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </div>

    <form className="space-y-6">
      {/* Event + Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('resultManagementSelectCompetition')} *
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">{t('resultManagementChooseEvent')}</option>
            {events
              ?.filter(e => e.status === 'completed' || e.status === 'active')
              .map(event => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('resultManagementResultType')} *
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="ranking">{t('resultManagementRanking')}</option>
            <option value="score">{t('resultManagementScoreBased')}</option>
            <option value="time">{t('resultManagementTimeBased')}</option>
            <option value="points">{t('resultManagementPointsBased')}</option>
          </select>
        </div>
      </div>

      {/* Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('resultManagementUploadFile')}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {t('resultManagementUploadHint')}
          </p>
          <p className="text-sm text-gray-500">
            {t('resultManagementUploadFormats')}
          </p>
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={handleBulkUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Manual Entry */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('resultManagementManualEntry')}
        </h3>

        <div className="space-y-4">
          {[1, 2, 3].map(position => (
            <div
              key={position}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('resultManagementPosition')}
                </label>
                <input
                  type="number"
                  value={position}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('resultManagementParticipant')}
                </label>
                <input
                  type="text"
                  placeholder={t('resultManagementParticipantPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('resultManagementEntity')}
                </label>
                <input
                  type="text"
                  placeholder={t('resultManagementEntityPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('resultManagementScoreTime')}
                </label>
                <input
                  type="text"
                  placeholder={t('resultManagementScoreTimePlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="mt-4 flex items-center gap-2 text-blue-600">
          <Plus className="w-4 h-4" />
          {t('resultManagementAddMore')}
        </button>
      </div>

      {/* Footer */}
      <div
        className={`flex gap-4 pt-6 border-t ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => setShowCreateModal(false)}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg"
        >
          {t('resultManagementCancel')}
        </button>

        <button
          type="button"
          className="flex-1 bg-gray-600 text-white py-3 rounded-lg"
        >
          {t('resultManagementSaveDraft')}
        </button>

        <button
          type="submit"
          disabled={createResultMutation.loading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg disabled:opacity-50"
        >
          {createResultMutation.loading
            ? t('resultManagementPublishing')
            : t('resultManagementPublish')}
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
   <div
  dir={isRTL ? 'rtl' : 'ltr'}
  className={`p-8 ${isRTL ? 'text-right' : 'text-left'}`}
>
  {/* Header */}
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900">
      {t('resultManagementTitle')}
    </h1>
    <p className="text-gray-600 mt-2">
      {t('resultManagementSubtitle')}
    </p>
  </div>

  {/* Header Actions */}
  <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex gap-4">
        <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
          <Upload className="w-5 h-5" />
          {t('resultManagementBulkUpload')}
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
          {t('resultManagementExportResults')}
        </button>
      </div>

      <button
        onClick={() => setShowCreateModal(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
      >
        <Plus className="w-5 h-5" />
        {t('resultManagementCreateResults')}
      </button>
    </div>
  </div>

  {/* Competitions with Results */}
  <div className="grid grid-cols-1 gap-8">
    {Object.entries(groupedResults).map(([eventId, eventData]) => (
      <div key={eventId} className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {eventData.eventName}
            </h2>
            <p className="text-gray-600">
              {t('resultManagementResultsPublished')}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200">
              <Edit className="w-4 h-4" />
              {t('resultManagementEdit')}
            </button>

            <button
              onClick={() => handleExportResults(eventId)}
              className="flex items-center gap-2 bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200"
            >
              <Download className="w-4 h-4" />
              {t('resultManagementExport')}
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-start py-3 px-4 font-semibold text-gray-700">
                  {t('resultManagementPosition')}
                </th>
                <th className="text-start py-3 px-4 font-semibold text-gray-700">
                  {t('resultManagementParticipant')}
                </th>
                <th className="text-start py-3 px-4 font-semibold text-gray-700">
                  {t('resultManagementEntity')}
                </th>
                <th className="text-start py-3 px-4 font-semibold text-gray-700">
                  {t('resultManagementScore')}
                </th>
                <th className="text-start py-3 px-4 font-semibold text-gray-700">
                  {t('resultManagementCertificate')}
                </th>
                <th className="text-start py-3 px-4 font-semibold text-gray-700">
                  {t('resultManagementActions')}
                </th>
              </tr>
            </thead>

            <tbody>
              {eventData.results.map((result, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 flex items-center">
                    {result.position <= 3 && (
                      <span className="me-2 text-lg">
                        {result.position === 1 ? '🥇' : result.position === 2 ? '🥈' : '🥉'}
                      </span>
                    )}
                    <span className="font-semibold text-gray-900">
                      #{result.position || 'N/A'}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-medium text-gray-900">
                    {t('resultManagementParticipant')} {index + 1}
                  </td>

                  <td className="py-4 px-4">
                    {t('resultManagementEntity')} {index + 1}
                  </td>

                  <td className="py-4 px-4 font-semibold">
                    {result.score ? `${result.score}/100` : result.time || 'N/A'}
                  </td>

                  <td className="py-4 px-4">
                    {result.certificate ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {t('resultManagementGenerated')}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {t('resultManagementNotGenerated')}
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
      </div>
    ))}
  </div>

  {showCreateModal && <CreateResultModal />}
</div>


  );
};