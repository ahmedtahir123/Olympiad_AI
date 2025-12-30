import React, { useState, useCallback } from 'react';
import { School, Users, MapPin, Phone, Mail, CheckCircle, XCircle, Clock, Search, Filter, Eye, Edit } from 'lucide-react';
import { schoolService } from '../../services/schoolService';
import { useApi } from '../../hooks/useApi';
import { Entity as SchoolType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const SchoolManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { t, isRTL } = useLanguage();
  const fetchSchools = useCallback(() => schoolService.getAllSchools(), []);

  const { data: entities, loading, error, refetch } = useApi(fetchSchools, {
    immediate: true,
  });

  const filteredSchools = entities?.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entity.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleApprove = async (schoolId: string) => {
    try {
      await schoolService.approveSchool(schoolId);
      refetch();
    } catch (error) {
      console.error('Error approving entity:', error);
    }
  };

  const handleReject = async (schoolId: string) => {
    if (window.confirm('Are you sure you want to reject this entity application?')) {
      try {
        await schoolService.rejectSchool(schoolId);
        refetch();
      } catch (error) {
        console.error('Error rejecting entity:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
              <School className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading entities</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('entityTitle')}</h1>
          <p className="text-gray-600 mt-1">{t('entitySubtitle')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {entities?.filter(s => s.status === 'approved').length || 0}
            </p>
            <p className="text-sm text-gray-500">{t('entityApproved')}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {entities?.filter(s => s.status === 'pending').length || 0}
            </p>
            <p className="text-sm text-gray-500">{t('entityPending')}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {entities?.length || 0}
            </p>
            <p className="text-sm text-gray-500">{t('entityTotal')}</p>
          </div>
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
                placeholder="Search entities..."
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
              <option value="all">{t('status')}</option>
              <option value="pending">{t('entityPending')}</option>
              <option value="approved">{t('entityApproved')}</option>
              <option value="rejected">{t('entityRejected')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entity List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  t('entityEntity'),
                  t('entityContact'),
                  t('entityLocation'),
                  t('entityParticipants'),
                  t('entityStatus'),
                ].map((h, i) => (
                  <th
                    key={i}
                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'
                      }`}
                  >
                    {h}
                  </th>
                ))}

                <th
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-left' : 'text-right'
                    }`}
                >
                  {t('entityActions')}
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSchools.map((entity) => (
                <tr key={entity.id} className="hover:bg-gray-50">
                  {/* ENTITY */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'
                        }`}
                    >
                      <div className="flex-shrink-0 h-10 w-10">
                        {entity.logo ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={entity.logo}
                            alt={entity.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <School className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <div className="text-sm font-medium text-gray-900">{entity.name}</div>
                        <div className="text-sm text-gray-500">{entity.type}</div>
                      </div>
                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {entity.contactPerson}
                    </div>
                    <div
                      className={`text-sm text-gray-500 flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'
                        }`}
                    >
                      <Mail className="w-3 h-3" />
                      <span>{entity.contactEmail}</span>
                    </div>
                    <div
                      className={`text-sm text-gray-500 flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'
                        }`}
                    >
                      <Phone className="w-3 h-3" />
                      <span>{entity.contactPhone}</span>
                    </div>
                  </td>

                  {/* LOCATION */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm text-gray-900 flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'
                        }`}
                    >
                    </div>
                    <div className="text-sm text-gray-500">{entity.address}</div>
                  </td>

                  {/* PARTICIPANTS */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm text-gray-900 flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'
                        }`}
                    >
                      <Users className="w-3 h-3" />
                      <span>{entity.totalStudents || 0}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {entity.participantsCount || 0} {t('entityParticipating')}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'
                        }`}
                    >
                      {getStatusIcon(entity.status)}
                      <span className={`px-2 text-xs font-semibold rounded-full ${getStatusColor(entity.status)}`}>
                        {entity.status}
                      </span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isRTL ? 'text-left' : 'text-right'
                      }`}
                  >
                    <div
                      className={`flex items-center ${isRTL
                          ? 'justify-start space-x-reverse space-x-2'
                          : 'justify-end space-x-2'
                        }`}
                    >
                      <button
                        title={t('entityViewDetails')}
                        onClick={() => {
                          setSelectedSchool(entity);
                          setShowDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {entity.status === 'pending' && (
                        <>
                          <button
                            title={t('entityApprove')}
                            onClick={() => handleApprove(entity.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            title={t('entityReject')}
                            onClick={() => handleReject(entity.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {filteredSchools.length === 0 && !loading && (
        <div className={`text-center py-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('entityNoEntitiesFound')}
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all'
              ? t('entityTryAdjustingSearch')
              : t('entityNoRegisteredEntities')
            }
          </p>
        </div>
      )}
      {/* Entity Details Modal */}
      {showDetails && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {t('entityDetails')} {/* 'Entity Details' / 'تفاصيل الكيان' */}
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Entity Info */}
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                {selectedSchool.logo ? (
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={selectedSchool.logo}
                    alt={selectedSchool.name}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <School className="w-8 h-8 text-blue-600" />
                  </div>
                )}
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedSchool.name}</h3>
                  <p className="text-gray-600">{selectedSchool.type}</p>
                  <div className={`flex items-center mt-1 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                    {getStatusIcon(selectedSchool.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSchool.status)}`}>
                      {selectedSchool.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">{t('entityContactInfo')}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{selectedSchool.contactPerson}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{selectedSchool.contactEmail}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{selectedSchool.contactPhone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">{t('entityLocation')}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{selectedSchool.city}, {selectedSchool.state}</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{selectedSchool.address}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">{t('entityStatistics')}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{selectedSchool.totalStudents || 0}</p>
                    <p className="text-sm text-gray-500">{t('entityTotalParticipants')}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedSchool.participantsCount || 0}</p>
                    <p className="text-sm text-gray-500">{t('entityParticipants')}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{selectedSchool.eventsCount || 0}</p>
                    <p className="text-sm text-gray-500">{t('entityCompetitions')}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">${selectedSchool.totalPayments || 0}</p>
                    <p className="text-sm text-gray-500">{t('entityPayments')}</p>
                  </div>
                </div>
              </div>

              {/* Approve/Reject Buttons */}
              {selectedSchool.status === 'pending' && (
                <div className={`flex ${isRTL ? 'justify-start space-x-reverse space-x-3' : 'justify-end space-x-3'} pt-4 border-t`}>
                  <button
                    onClick={() => {
                      handleReject(selectedSchool.id);
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    {t('entityReject')}
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedSchool.id);
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t('entityApprove')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

