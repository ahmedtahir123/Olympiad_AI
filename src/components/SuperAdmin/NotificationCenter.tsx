import React, { useCallback, useState } from 'react';
import { Bell, Send, Users, School as Entity, Calendar, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { schoolService } from '../../services/schoolService';
import { useApi, useMutation } from '../../hooks/useApi';
import { Announcement } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const NotificationCenter: React.FC = () => {
   const { t } = useLanguage();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const fetchSchools = useCallback(() => schoolService.getAllSchools(), []);
  const fetchNotifications = useCallback(() => notificationService.getAllAnnouncements(), []);

  const { data: announcements, loading, error, refetch } = useApi(
    fetchNotifications,
    { immediate: true }
  );

    const { data: entities } = useApi(fetchSchools, {
    immediate: true,
  });

  const createAnnouncementMutation = useMutation(
    (data: any) => notificationService.createAnnouncement(data),
    {
      onSuccess: () => {
        refetch();
        setShowCreateModal(false);
        resetForm();
      }
    }
  );

  const deleteAnnouncementMutation = useMutation(
    (id: string) => notificationService.deleteAnnouncement(id),
    {
      onSuccess: () => refetch()
    }
  );

  const resendAnnouncementMutation = useMutation(
    (id: string) => notificationService.resendAnnouncement(id),
    {
      onSuccess: () => refetch()
    }
  );

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success',
    targetSchools: [] as string[],
    sendEmail: false,
    sendSms: false
  });

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      targetSchools: [],
      sendEmail: false,
      sendSms: false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAnnouncementMutation.mutate(formData);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      await deleteAnnouncementMutation.mutate(id);
    }
  };

  const CreateAnnouncementModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('createTitle')}</h2>
          <button
            onClick={() => {
              setShowCreateModal(false);
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('announcementTitle')} *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter announcement title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('message')} *
            </label>
            <textarea
              required
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your message here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('announcementType')} *
              </label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="info">{t('information')}</option>
                <option value="warning">{t('warning')}</option>
                <option value="success">{t('success')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('targetAudience')} *
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">{t('allEntity')}</option>
                <option value="specific">{t('specificEntity')}</option>
                <option value="event">{t('competitionParticipants')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('selectEntity')}
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {entities?.map(entity => (
                <label key={entity.id} className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.targetSchools.includes(entity.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          targetSchools: [...formData.targetSchools, entity.id]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          targetSchools: formData.targetSchools.filter(id => id !== entity.id)
                        });
                      }
                    }}
                    className="mr-2" 
                  />
                  <span className="text-sm text-gray-700">{entity.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={formData.sendEmail}
                onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                className="mr-2" 
              />
              <span className="text-sm text-gray-700">{t('sendEmail')}</span>
            </label>
          </div>

          <div>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={formData.sendSms}
                onChange={(e) => setFormData({ ...formData, sendSms: e.target.checked })}
                className="mr-2" 
              />
              <span className="text-sm text-gray-700">{t('sendSms')}</span>
            </label>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {t('saveDraft')}
            </button>
            <button
              type="submit"
              disabled={createAnnouncementMutation.loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {createAnnouncementMutation.loading ? t('sending') : t('sendAnnouncement')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
              <Bell className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{t('errorLoading')}</h3>
              <p className="text-sm text-red-700 mt-1">{error.message}</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('notificationCenter')}</h1>
        <p className="text-gray-600 mt-2">{t('notificationSubtitle')}</p>
      </div>

      {/* Header Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="font-semibold text-gray-900">{t('communicationCenter')}</h2>
              <p className="text-sm text-gray-600">{t('manageCommunication')}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            {t('createAnnouncement')}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-200" />
            <span className="text-2xl font-bold">{entities?.length || 0}</span>
          </div>
          <h3 className="font-semibold mb-2">{t('allEntities')}</h3>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 text-sm transition-all">
            {t('sendToAll')}
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-green-200" />
            <span className="text-2xl font-bold">24</span>
          </div>
          <h3 className="font-semibold mb-2">{t('activeCompetitions')}</h3>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 text-sm transition-all">
            {t('competitionUpdates')}
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Entity className="w-8 h-8 text-purple-200" />
            <span className="text-2xl font-bold">{entities?.filter(s => s.status === 'pending').length || 0}</span>
          </div>
          <h3 className="font-semibold mb-2">{t('pendingEntities')}</h3>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 text-sm transition-all">
            {t('sendReminders')}
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t('recentAnnouncements')}</h2>
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
              {t('filter')}
            </button>
            <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors">
              {t('export')}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {announcements?.map((announcement) => (
            <div key={announcement.id} className={`border-l-4 rounded-lg p-6 ${getTypeColor(announcement.type)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{getTypeIcon(announcement.type)}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                    <p className="text-gray-700 mb-3">{announcement.message}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{t('by')} {announcement.createdBy}</span>
                      <span>•</span>
                      <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                      {announcement.targetSchools && (
                        <>
                          <span>•</span>
                          <span>{t('sentTo')} {announcement.targetSchools.length} {t('entities')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setSelectedAnnouncement(announcement)}
                    className="bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(announcement.id)}
                    disabled={deleteAnnouncementMutation.loading}
                    className="bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {announcement.targetSchools && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {announcement.targetSchools.slice(0, 3).map((schoolId, index) => {
                    const entity = entities?.find(s => s.id === schoolId);
                    return (
                      <span key={index} className="px-2 py-1 bg-white bg-opacity-50 rounded text-sm">
                        {entity?.name || `${t('entity')} ${index + 1}`}
                      </span>
                    );
                  })}
                  {announcement.targetSchools.length > 3 && (
                    <span className="px-2 py-1 bg-white bg-opacity-50 rounded text-sm">
                      +{announcement.targetSchools.length - 3} {t('more')}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Details Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{getTypeIcon(selectedAnnouncement.type)}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedAnnouncement.title}</h2>
                  <p className="text-gray-600">
                    {selectedAnnouncement.type.charAt(0).toUpperCase() + selectedAnnouncement.type.slice(1)} Announcement
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('message')}</h3>
                <p className="text-gray-700 leading-relaxed">{selectedAnnouncement.message}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('details')}</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">{t('createdBy')}:</span> {selectedAnnouncement.createdBy}</p>
                    <p><span className="font-medium">{t('date')}:</span> {new Date(selectedAnnouncement.createdAt).toLocaleString()}</p>
                    <p><span className="font-medium">{t('type')}:</span> {selectedAnnouncement.type}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('recipients')}</h3>
                  {selectedAnnouncement.targetSchools ? (
                    <div className="space-y-1">
                      {selectedAnnouncement.targetSchools.map((schoolId, index) => {
                        const entity = entities?.find(s => s.id === schoolId);
                        return (
                          <p key={index} className="text-sm text-gray-700">• {entity?.name || `Entity ${index + 1}`}</p>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">{t('allRegisteredEntities')}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <button 
                  onClick={() => resendAnnouncementMutation.mutate(selectedAnnouncement.id)}
                  disabled={resendAnnouncementMutation.loading}
                  className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  {resendAnnouncementMutation.loading ? t('resending') : t('resend')}
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Edit className="w-5 h-5" />
                  {t('edit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && <CreateAnnouncementModal />}
    </div>
  );
};