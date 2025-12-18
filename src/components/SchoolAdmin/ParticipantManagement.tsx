import React, { useState, useEffect, useCallback } from 'react';
import { User, Plus, Edit, Trash2, Upload, Download, Search, Filter, Camera, FileText } from 'lucide-react';
import { participantService } from '../../services/participantService';
import { eventService } from '../../services/eventService';
import { useApi, useMutation } from '../../hooks/useApi';
import { Participant, Event } from '../../types';

export const ParticipantManagement: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchPerticipants = useCallback(() => participantService.getAllParticipants(), []);
  const fetchEvents = useCallback(() => eventService.getAllEvents(), []);

  const { data: participants, loading, error, refetch } = useApi(
    fetchPerticipants,
    { immediate: true }
  );

        const { data: events } = useApi(fetchEvents, {
        immediate: true,
      });

  const createParticipantMutation = useMutation(
    (data: any) => participantService.createParticipant(data),
    {
      onSuccess: () => {
        refetch();
        setShowAddForm(false);
        resetForm();
      }
    }
  );

  const updateParticipantMutation = useMutation(
    (data: any) => participantService.updateParticipant(data),
    {
      onSuccess: () => {
        refetch();
        setShowAddForm(false);
        setEditingParticipant(null);
        resetForm();
      }
    }
  );

  const deleteParticipantMutation = useMutation(
    (id: string) => participantService.deleteParticipant(id),
    {
      onSuccess: () => refetch()
    }
  );

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    category: '',
    eventsRegistered: [] as string[],
    photo: null as File | null,
    documents: [] as File[]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      grade: '',
      category: '',
      eventsRegistered: [],
      photo: null,
      documents: []
    });
  };

  const filteredParticipants = participants?.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || participant.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  }) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const participantData = {
      ...formData,
      age: parseInt(formData.age),
    };

    if (editingParticipant) {
      await updateParticipantMutation.mutate({
        id: editingParticipant.id,
        ...participantData
      });
    } else {
      await createParticipantMutation.mutate(participantData);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      await deleteParticipantMutation.mutate(id);
    }
  };

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant);
    setFormData({
      name: participant.name,
      age: participant.age.toString(),
      grade: participant.grade,
      category: participant.category,
      eventsRegistered: participant.eventsRegistered,
      photo: null,
      documents: []
    });
    setShowAddForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      try {
        await participantService.bulkUploadParticipants(file);
        refetch();
        setSelectedFile(null);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
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
              <User className="w-5 h-5" />
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Participant Management</h1>
          <p className="text-gray-600 mt-1">Manage student registrations and event assignments</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => participantService.exportParticipants()}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import</span>
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Participant</span>
          </button>
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
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Grades</option>
              <option value="9th">Grade 9</option>
              <option value="10th">Grade 10</option>
              <option value="11th">Grade 11</option>
              <option value="12th">Grade 12</option>
            </select>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compitions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParticipants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {participant.photo ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={participant.photo}
                            alt={participant.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                        <div className="text-sm text-gray-500">Age {participant.age}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{participant.grade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {participant.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {participant.eventsRegistered.length} events
                    </div>
                    <div className="text-sm text-gray-500">
                      {participant.eventsRegistered.slice(0, 2).map(eventId => {
                        const event = events?.find(e => e.id === eventId);
                        return event?.name;
                      }).filter(Boolean).join(', ')}
                      {participant.eventsRegistered.length > 2 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(participant)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        disabled={updateParticipantMutation.loading}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(participant.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        disabled={deleteParticipantMutation.loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredParticipants.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No participants found</h3>
          <p className="text-gray-600">
            {searchTerm || gradeFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first participant'
            }
          </p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingParticipant ? 'Edit Participant' : 'Add New Participant'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingParticipant(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    max="20"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </label>
                  <select
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Grade</option>
                    <option value="9th">Grade 9</option>
                    <option value="10th">Grade 10</option>
                    <option value="11th">Grade 11</option>
                    <option value="12th">Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="academic">Academic</option>
                    <option value="sporting">Sporting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Compitions
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {events?.map((event) => (
                    <label key={event.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.eventsRegistered.includes(event.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              eventsRegistered: [...formData.eventsRegistered, event.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              eventsRegistered: formData.eventsRegistered.filter(id => id !== event.id)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{event.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Photo
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
                      className="hidden"
                    />
                  </label>
                  {formData.photo && (
                    <span className="text-sm text-gray-600">{formData.photo.name}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documents (Optional)
                </label>
                <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <FileText className="w-4 h-4" />
                  <span>Upload Documents</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFormData({ ...formData, documents: Array.from(e.target.files || []) })}
                    className="hidden"
                  />
                </label>
                {formData.documents.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    {formData.documents.length} document(s) selected
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingParticipant(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createParticipantMutation.loading || updateParticipantMutation.loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createParticipantMutation.loading || updateParticipantMutation.loading
                    ? 'Saving...'
                    : editingParticipant ? 'Update' : 'Add'} Participant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

