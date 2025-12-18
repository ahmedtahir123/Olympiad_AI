import React, { useCallback, useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Eye, Filter, Search, Users, DollarSign, MapPin, Clock } from 'lucide-react';
import { eventService } from '../../services/eventService';
import { useApi, useMutation } from '../../hooks/useApi';
import { Event } from '../../types';

export const EventManagement: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'academic' | 'sporting'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'active' | 'completed'>('all');

  const fetchEvents = useCallback(() => eventService.getAllEvents(), []);
  
    const { data: events, loading, error, refetch } = useApi(fetchEvents, {
    immediate: true,
  });

  const createEventMutation = useMutation(
    (data: any) => eventService.createEvent(data),
    {
      onSuccess: () => {
        refetch();
        setShowCreateModal(false);
        resetForm();
      }
    }
  );

  const updateEventMutation = useMutation(
    (data: any) => eventService.updateEvent(data),
    {
      onSuccess: () => {
        refetch();
        setShowCreateModal(false);
        setEditingEvent(null);
        resetForm();
      }
    }
  );

  const deleteEventMutation = useMutation(
    (id: string) => eventService.deleteEvent(id),
    {
      onSuccess: () => refetch()
    }
  );

  const [formData, setFormData] = useState({
    name: '',
    category: 'academic' as 'academic' | 'sporting',
    type: '',
    description: '',
    date: '',
    venue: '',
    fee: '',
    maxParticipants: '',
    rules: [] as string[],
    ageGroups: [] as string[]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'academic',
      type: '',
      description: '',
      date: '',
      venue: '',
      fee: '',
      maxParticipants: '',
      rules: [],
      ageGroups: []
    });
  };

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      fee: parseFloat(formData.fee),
      maxParticipants: parseInt(formData.maxParticipants)
    };

    if (editingEvent) {
      await updateEventMutation.mutate({
        id: editingEvent.id,
        ...eventData
      });
    } else {
      await createEventMutation.mutate(eventData);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      category: event.category,
      type: event.type,
      description: event.description,
      date: event.date,
      venue: event.venue,
      fee: event.fee.toString(),
      maxParticipants: event.maxParticipants.toString(),
      rules: event.rules,
      ageGroups: event.ageGroups
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEventMutation.mutate(id);
    }
  };

  const CreateEventModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingEvent ? 'Edit Compition' : 'Create New Compition'}
          </h2>
          <button
            onClick={() => {
              setShowCreateModal(false);
              setEditingEvent(null);
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compition Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'academic' | 'sporting' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="academic">Academic</option>
                <option value="sporting">Sports</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compition Type *
              </label>
              <select 
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="Individual">Individual</option>
                <option value="Team">Team</option>
                <option value="Individual/Team">Individual/Team</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compition Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue *
              </label>
              <input
                type="text"
                required
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter venue location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Fee ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter fee amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Participants *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter maximum participants"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Groups *
              </label>
              <div className="space-y-2">
                {['12-14', '15-17', '18+'].map(ageGroup => (
                  <label key={ageGroup} className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={formData.ageGroups.includes(ageGroup)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            ageGroups: [...formData.ageGroups, ageGroup]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            ageGroups: formData.ageGroups.filter(ag => ag !== ageGroup)
                          });
                        }
                      }}
                      className="mr-2" 
                    />
                    <span className="text-sm">{ageGroup} years</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compition Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the event, its objectives, and what participants can expect"
            />
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setEditingEvent(null);
                resetForm();
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createEventMutation.loading || updateEventMutation.loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {createEventMutation.loading || updateEventMutation.loading
                ? 'Saving...'
                : editingEvent ? 'Update Compition' : 'Create & Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
              <Calendar className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading events</h3>
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
        <h1 className="text-3xl font-bold text-gray-900">Compition Management</h1>
        <p className="text-gray-600 mt-2">Create and manage academic and sporting events</p>
      </div>

      {/* Header Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="sporting">Sports</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Compition
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Compitions</p>
              <p className="text-3xl font-bold text-gray-900">{events?.length || 0}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Compitions</p>
              <p className="text-3xl font-bold text-gray-900">
                {events?.filter(e => e.status === 'active').length || 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Participants</p>
              <p className="text-3xl font-bold text-gray-900">
                {events?.reduce((sum, event) => sum + (event.currentParticipants || 0), 0) || 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ${events?.reduce((sum, event) => sum + ((event.currentParticipants || 0) * event.fee), 0).toLocaleString() || 0}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Compitions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${event.category === 'academic' ? 'bg-purple-100' : 'bg-orange-100'}`}>
                <Calendar className={`w-6 h-6 ${event.category === 'academic' ? 'text-purple-600' : 'text-orange-600'}`} />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{event.venue}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm">{event.currentParticipants || 0}/{event.maxParticipants} participants</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">${event.fee}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${((event.currentParticipants || 0) / event.maxParticipants) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {event.maxParticipants - (event.currentParticipants || 0)} spots remaining
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedEvent(event)}
                className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button 
                onClick={() => handleEdit(event)}
                className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(event.id)}
                disabled={deleteEventMutation.loading}
                className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Compition found</h3>
          <p className="text-gray-600">
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first event to get started'
            }
          </p>
        </div>
      )}

      {/* Compition Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEvent.status)}`}>
                  {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Compition Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Description</p>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Category</p>
                    <p className="text-gray-600 capitalize">{selectedEvent.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Type</p>
                    <p className="text-gray-600">{selectedEvent.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date & Venue</p>
                    <p className="text-gray-600">{new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.venue}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Age Groups</p>
                    <div className="flex gap-2 mt-1">
                      {selectedEvent.ageGroups.map((age, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {age} years
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rules & Guidelines</h3>
                <div className="space-y-2">
                  {selectedEvent.rules.map((rule, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <p className="text-gray-600 text-sm">{rule}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Registration Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Registered</p>
                      <p className="text-xl font-bold text-gray-900">{selectedEvent.currentParticipants || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Available</p>
                      <p className="text-xl font-bold text-gray-900">{selectedEvent.maxParticipants - (selectedEvent.currentParticipants || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fee</p>
                      <p className="text-xl font-bold text-gray-900">${selectedEvent.fee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-xl font-bold text-gray-900">${(selectedEvent.currentParticipants || 0) * selectedEvent.fee}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && <CreateEventModal />}
    </div>
  );
};