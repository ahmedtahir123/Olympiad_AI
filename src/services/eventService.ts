import { apiClient, ApiResponse } from './api';
import { Event } from '../types';

export interface CreateEventRequest {
  name: string;
  category: 'academic' | 'sporting';
  type: string;
  description: string;
  date: string;
  venue: string;
  fee: number;
  maxParticipants: number;
  rules: string[];
  ageGroups: string[];
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

export interface EventFilters {
  category?: 'academic' | 'sporting';
  status?: 'draft' | 'active' | 'completed';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

class EventService {
  async getAllEvents(filters?: EventFilters): Promise<ApiResponse<Event[]>> {
    // Mock events data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockEvents: Event[] = [
      {
        id: '1',
        name: 'Mathematics Competition',
        category: 'academic',
        type: 'Individual',
        description: 'Annual mathematics competition testing problem-solving skills and mathematical knowledge.',
        date: '2025-03-15',
        venue: 'Central Hall, Room A',
        fee: 50,
        maxParticipants: 100,
        currentParticipants: 75,
        rules: ['Calculators not allowed', 'Duration: 2 hours', 'Multiple choice and written answers'],
        ageGroups: ['15-17', '18+'],
        status: 'active'
      },
      {
        id: '2',
        name: 'Basketball Championship',
        category: 'sporting',
        type: 'Team',
        description: 'Inter-entity basketball tournament with teams competing for the championship title.',
        date: '2025-03-20',
        venue: 'Sports Complex Arena',
        fee: 200,
        maxParticipants: 48,
        currentParticipants: 32,
        rules: ['Teams of 5 players', 'Standard FIBA rules apply', 'Tournament format'],
        ageGroups: ['15-17', '18+'],
        status: 'active'
      },
      {
        id: '3',
        name: 'Science Fair',
        category: 'academic',
        type: 'Individual',
        description: 'Students present innovative science projects and experiments.',
        date: '2025-03-25',
        venue: 'Exhibition Hall',
        fee: 75,
        maxParticipants: 80,
        currentParticipants: 45,
        rules: ['Original research required', 'Presentation time: 10 minutes', 'Display board provided'],
        ageGroups: ['12-14', '15-17'],
        status: 'active'
      },
      {
        id: '4',
        name: 'Debate Championship',
        category: 'academic',
        type: 'Team',
        description: 'Formal debate competition on current affairs and social issues.',
        date: '2025-04-05',
        venue: 'Main Auditorium',
        fee: 100,
        maxParticipants: 32,
        currentParticipants: 28,
        rules: ['Teams of 3 speakers', 'Oxford-style debate format', 'Topics announced 1 week prior'],
        ageGroups: ['15-17', '18+'],
        status: 'active'
      },
      {
        id: '5',
        name: 'Swimming Championship',
        category: 'sporting',
        type: 'Individual',
        description: 'Swimming competition with multiple stroke categories and distances.',
        date: '2025-04-10',
        venue: 'Aquatic Center',
        fee: 60,
        maxParticipants: 120,
        currentParticipants: 89,
        rules: ['Multiple stroke categories', 'Qualifying times required', 'Medical clearance needed'],
        ageGroups: ['12-14', '15-17', '18+'],
        status: 'active'
      }
    ];
    
    // Apply filters if provided
    let filteredEvents = mockEvents;
    if (filters) {
      if (filters.category) {
        filteredEvents = filteredEvents.filter(event => event.category === filters.category);
      }
      if (filters.status) {
        filteredEvents = filteredEvents.filter(event => event.status === filters.status);
      }
      if (filters.search) {
        filteredEvents = filteredEvents.filter(event => 
          event.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          event.description.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
    }
    
    return {
      data: filteredEvents,
      success: true,
      message: 'Competitions retrieved successfully'
    };
  }

  async getEventById(id: string): Promise<ApiResponse<Event>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const events = await this.getAllEvents();
    const event = events.data.find(e => e.id === id);
    
    if (!event) {
      throw {
        message: 'Competition not found',
        status: 404
      };
    }
    
    return {
      data: event,
      success: true,
      message: 'Competition retrieved successfully'
    };
  }

  async createEvent(eventData: CreateEventRequest): Promise<ApiResponse<Event>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newEvent: Event = {
      id: 'event-' + Date.now(),
      ...eventData,
      currentParticipants: 0,
      status: 'draft'
    };
    
    return {
      data: newEvent,
      success: true,
      message: 'Competition created successfully'
    };
  }

  async updateEvent(eventData: UpdateEventRequest): Promise<ApiResponse<Event>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const { id, ...updateData } = eventData;
    const existingEvent = await this.getEventById(id);
    
    const updatedEvent: Event = {
      ...existingEvent.data,
      ...updateData
    };
    
    return {
      data: updatedEvent,
      success: true,
      message: 'Competition updated successfully'
    };
  }

  async deleteEvent(id: string): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      data: { message: 'Competition deleted successfully' },
      success: true,
      message: 'Competition deleted successfully'
    };
  }

  async getEventParticipants(eventId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>(`/events/${eventId}/participants`);
  }

  async registerForEvent(eventId: string, participantIds: string[]): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/events/${eventId}/register`, {
      participantIds,
    });
  }

  async unregisterFromEvent(eventId: string, participantId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/events/${eventId}/participants/${participantId}`);
  }

  async getEventStats(): Promise<ApiResponse<{
    totalEvents: number;
    activeEvents: number;
    totalParticipants: number;
    totalRevenue: number;
  }>> {
    return apiClient.get<{
      totalEvents: number;
      activeEvents: number;
      totalParticipants: number;
      totalRevenue: number;
    }>('/events/stats');
  }
}

export const eventService = new EventService();