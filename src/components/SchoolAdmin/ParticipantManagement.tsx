import { Camera, Download, Edit, FileText, Filter, Plus, Search, Trash2, Upload, User } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApi, useMutation } from '../../hooks/useApi';
import { eventService } from '../../services/eventService';
import { participantService } from '../../services/participantService';
import { Participant } from '../../types';

export const ParticipantManagement: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { t, isRTL } = useLanguage();


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
    <div className={`p-6 space-y-6 ${isRTL ? "rtl text-right" : "ltr text-left"}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("participantManagement")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("participantManagementDesc")}
          </p>
        </div>

        <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-3" : "space-x-3"}`}>
          <button
            onClick={() => participantService.exportParticipants()}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            {t("export")}
          </button>

          <label className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <Upload className="w-4 h-4" />
            {t("import")}
            <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} hidden />
          </label>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t("addParticipant")}
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? "right-3" : "left-3"}`} />
            <input
              type="text"
              placeholder={t("searchParticipants")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"}`}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">{t("allGrades")}</option>
              <option value="9th">{t("grade9")}</option>
              <option value="10th">{t("grade10")}</option>
              <option value="11th">{t("grade11")}</option>
              <option value="12th">{t("grade12")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                {t("participant")}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                {t("grade")}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                {t("category")}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                {t("competitions")}
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-end">
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredParticipants.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-3" : "space-x-3"}`}>
                    {p.photo ? (
                      <img src={p.photo} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-gray-500">
                        {t("age")} {p.age}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">{p.grade}</td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {t(p.category)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div>{p.eventsRegistered.length} {t("events")}</div>
                </td>

                <td className="px-6 py-4 text-end">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredParticipants.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium">{t("noParticipants")}</h3>
          <p className="text-gray-600">{t("adjustSearch")}</p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${isRTL ? "rtl text-right" : "ltr text-left"}`}>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingParticipant
                  ? t("editParticipant")
                  : t("addNewParticipant")}
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

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("participantName")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("age")}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="20"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("grade")}
                  </label>
                  <select
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t("selectGrade")}</option>
                    <option value="9th">{t("grade9")}</option>
                    <option value="10th">{t("grade10")}</option>
                    <option value="11th">{t("grade11")}</option>
                    <option value="12th">{t("grade12")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("category")}
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t("selectCategory")}</option>
                    <option value="academic">{t("academic")}</option>
                    <option value="sporting">{t("sporting")}</option>
                  </select>
                </div>
              </div>

              {/* Competitions */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("selectCompetitions")}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {events?.map((event) => (
                    <label
                      key={event.id}
                      className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.eventsRegistered.includes(event.id)}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            eventsRegistered: e.target.checked
                              ? [...formData.eventsRegistered, event.id]
                              : formData.eventsRegistered.filter(id => id !== event.id)
                          });
                        }}
                      />
                      <span className="text-sm">{event.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Photo */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("participantPhoto")}
                </label>
                <div className={`flex items-center ${isRTL ? "space-x-reverse space-x-4" : "space-x-4"}`}>
                  <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Camera className="w-4 h-4" />
                    {t("uploadPhoto")}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
                    />
                  </label>
                  {formData.photo && (
                    <span className="text-sm text-gray-600">{formData.photo.name}</span>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("documentsOptional")}
                </label>
                <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <FileText className="w-4 h-4" />
                  {t("uploadDocuments")}
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    hidden
                    onChange={(e) =>
                      setFormData({ ...formData, documents: Array.from(e.target.files || []) })
                    }
                  />
                </label>

                {formData.documents.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    {formData.documents.length} {t("documentsSelected")}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className={`flex justify-end ${isRTL ? "space-x-reverse space-x-3" : "space-x-3"}`}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingParticipant(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  {t("cancel")}
                </button>

                <button
                  type="submit"
                  disabled={createParticipantMutation.loading || updateParticipantMutation.loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {createParticipantMutation.loading || updateParticipantMutation.loading
                    ? t("saving")
                    : editingParticipant
                      ? t("update")
                      : t("add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

