import { Calendar, DollarSign, Filter, MapPin, Minus, Plus, Search, Trophy, Users } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApi } from '../../hooks/useApi';
import { eventService } from '../../services/eventService';

export const EventSelection: React.FC = () => {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showSelected, setShowSelected] = useState(false);
  const { t, isRTL } = useLanguage();

  const fetchEvents = useCallback(() => eventService.getAllEvents(), []);

  const { data: events, loading, error, refetch } = useApi(fetchEvents, {
    immediate: true,
  });

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesSelected = !showSelected || selectedEvents.includes(event.id);

    return matchesSearch && matchesCategory && matchesSelected;
  }) || [];

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const getTotalCost = () => {
    return events?.reduce((total, event) => {
      return selectedEvents.includes(event.id) ? total + event.fee : total;
    }, 0) || 0;
  };

  const handleProceedToPayment = async () => {
    if (selectedEvents.length === 0) return;

    try {
      // This would typically navigate to payment screen
      console.log('Proceeding to payment with events:', selectedEvents);
    } catch (error) {
      console.error('Error proceeding to payment:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600">
              <Trophy className="w-5 h-5" />
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("competitionSelection")}</h1>
          <p className="text-gray-600 mt-1">{t("chooseEvents")}</p>
        </div>
        <div className={`flex items-center space-x-4" ${isRTL ? 'flex-row-reverse space-x-4' : ''}`}>
          <div className="text-right">
            <p className="text-sm text-gray-500">{t("selectedCompetitions")}</p>
            <p className="text-2xl font-bold text-blue-600">{selectedEvents.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{t("totalCost")}</p>
            <p className="text-2xl font-bold text-green-600">${getTotalCost()}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t("searchEvents")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className={`flex items-center space-x-4" ${isRTL ? 'flex-row-reverse space-x-4' : ''}`}>
            <div className={`flex items-center space-x-2" ${isRTL ? 'flex-row-reverse space-x-2' : ''}`}>
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t("allCategories")}</option>
                <option value="academic">{t("academic")}</option>
                <option value="sporting">{t("sporting")}</option>
              </select>
            </div>
            <button
              onClick={() => setShowSelected(!showSelected)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${showSelected
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {showSelected ? t("showAll") : t("showSelected")}
            </button>
          </div>
        </div>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const isSelected = selectedEvents.includes(event.id);

          return (
            <div
              key={event.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center space-x-2" ${isRTL ? 'flex-row-reverse space-x-2' : ''}`}>

                    <Trophy className={`w-5 h-5 ${event.category === 'academic' ? 'text-purple-500' : 'text-orange-500'}`} />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.category === 'academic'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-orange-100 text-orange-800'
                      }`}>
                      {t(event.category)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEventToggle(event.id)}
                    className={`p-2 rounded-full transition-colors ${isSelected
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {isSelected ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className={`space-y-3 ${isRTL ? 'text-left' : 'text-right'}`}>
                  <div className={`flex items-center text-sm text-gray-600 ${isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>

                  <div className={`flex items-center text-sm text-gray-600 ${isRTL ? ' space-x-2 space-x-reverse' : 'space-x-2'}`}>
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue}</span>
                  </div>

                  <div className={`flex items-center text-sm text-gray-600 ${isRTL ? ' space-x-2 space-x-reverse' : 'space-x-2'}`}>
                    <Users className="w-4 h-4" />
                    <span>{event.maxParticipants} {t("maxParticipants")}</span>
                  </div>

                  <div className={`flex items-center justify-between pt-3 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                      <span className="font-semibold text-green-600">${event.fee}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {event.currentParticipants || 0} {t("registered")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("noEventsFound")}</h3>
          <p className="text-gray-600">
            {searchTerm || categoryFilter !== 'all' || showSelected
              ? t("tryAdjusting")
              : t("noEventsAvailable")
            }
          </p>
        </div>
      )}

      {/* Proceed to Payment Button */}
      {selectedEvents.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleProceedToPayment}
            className={`bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-2' : ''}`}
          >
            <span>{t("proceedToPayment")}</span>
            <span className="bg-blue-500 px-2 py-1 rounded text-sm">
              ${getTotalCost()}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

