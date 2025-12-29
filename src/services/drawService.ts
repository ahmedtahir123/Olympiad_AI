import { apiClient, ApiResponse } from './api';
import { CompetitionDraw, Match } from '../types';

export interface CreateDrawRequest {
  eventId: string;
  drawType: 'single_elimination' | 'double_elimination' | 'round_robin' | 'group_stage';
  seedingMethod: 'random' | 'ranked' | 'manual';
  startDate?: string;
  endDate?: string;
  venues?: string[];
}

export interface UpdateMatchRequest {
  matchId: string;
  participant1?: string;
  participant2?: string;
  winner?: string;
  score?: string;
  status: 'pending' | 'ongoing' | 'completed';
  scheduledTime?: string;
  venue?: string;
}

export interface DrawFilters {
  eventId?: string;
  status?: 'draft' | 'published' | 'ongoing' | 'completed';
  drawType?: string;
}

class DrawService {
  async getAllDraws(filters?: DrawFilters): Promise<ApiResponse<CompetitionDraw[]>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockDraws: CompetitionDraw[] = [
      {
        id: '1',
        eventId: '2',
        eventName: 'Basketball Championship',
        drawType: 'single_elimination',
        totalParticipants: 16,
        totalRounds: 4,
        matches: [
          {
            id: 'match-1',
            round: 1,
            position: 1,
            participant1: 'Springfield High A',
            participant2: 'Riverside Academy A',
            school1: 'Springfield High Entity',
            school2: 'Riverside Academy',
            winner: 'Springfield High A',
            score: '78-65',
            status: 'completed',
            scheduledTime: '2025-03-20T10:00:00Z',
            venue: 'Court A'
          },
          {
            id: 'match-2',
            round: 1,
            position: 2,
            participant1: 'Central Entity A',
            participant2: 'Oakwood High A',
            school1: 'Central Entity',
            school2: 'Oakwood High',
            status: 'pending',
            scheduledTime: '2025-03-20T11:30:00Z',
            venue: 'Court B'
          },
          {
            id: 'match-3',
            round: 2,
            position: 1,
            participant1: 'Springfield High A',
            status: 'pending',
            scheduledTime: '2025-03-20T15:00:00Z',
            venue: 'Court A'
          }
        ],
        status: 'ongoing',
        createdAt: '2025-01-15T10:00:00Z',
        createdBy: 'System Administrator'
      },
      {
        id: '2',
        eventId: '1',
        eventName: 'Mathematics Competition',
        drawType: 'round_robin',
        totalParticipants: 12,
        totalRounds: 1,
        matches: [
          {
            id: 'match-4',
            round: 1,
            position: 1,
            participant1: 'John Doe',
            participant2: 'Jane Smith',
            school1: 'Springfield High Entity',
            school2: 'Springfield High Entity',
            winner: 'John Doe',
            score: '95-87',
            status: 'completed',
            scheduledTime: '2025-03-15T09:00:00Z',
            venue: 'Room A'
          }
        ],
        status: 'completed',
        createdAt: '2025-01-10T14:30:00Z',
        createdBy: 'System Administrator'
      }
    ];
    
    // Apply filters
    let filteredDraws = mockDraws;
    if (filters) {
      if (filters.eventId) {
        filteredDraws = filteredDraws.filter(d => d.eventId === filters.eventId);
      }
      if (filters.status) {
        filteredDraws = filteredDraws.filter(d => d.status === filters.status);
      }
      if (filters.drawType) {
        filteredDraws = filteredDraws.filter(d => d.drawType === filters.drawType);
      }
    }
    
    return {
      data: filteredDraws,
      success: true,
      message: 'Draws retrieved successfully'
    };
  }

  async getDrawById(id: string): Promise<ApiResponse<CompetitionDraw>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const draws = await this.getAllDraws();
    const draw = draws.data.find(d => d.id === id);
    
    if (!draw) {
      throw {
        message: 'Draw not found',
        status: 404
      };
    }
    
    return {
      data: draw,
      success: true,
      message: 'Draw retrieved successfully'
    };
  }

  async createDraw(drawData: CreateDrawRequest): Promise<ApiResponse<CompetitionDraw>> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newDraw: CompetitionDraw = {
      id: 'draw-' + Date.now(),
      eventId: drawData.eventId,
      eventName: 'Competition Name', // Would be fetched from event service
      drawType: drawData.drawType,
      totalParticipants: drawData.participants.length,
      totalRounds: Math.ceil(Math.log2(drawData.participants.length)),
      matches: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
    
    return {
      data: newDraw,
      success: true,
      message: 'Draw created successfully'
    };
  }

  async updateDraw(id: string, drawData: Partial<CreateDrawRequest>): Promise<ApiResponse<CompetitionDraw>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const existingDraw = await this.getDrawById(id);
    const updatedDraw: CompetitionDraw = {
      ...existingDraw.data,
      ...drawData
    };
    
    return {
      data: updatedDraw,
      success: true,
      message: 'Draw updated successfully'
    };
  }

  async deleteDraw(id: string): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      data: { message: 'Draw deleted successfully' },
      success: true,
      message: 'Draw deleted successfully'
    };
  }

  async publishDraw(id: string): Promise<ApiResponse<CompetitionDraw>> {
    return apiClient.put<CompetitionDraw>(`/draws/${id}/publish`, {});
  }

  async generateDraw(drawData: CreateDrawRequest): Promise<ApiResponse<CompetitionDraw>> {
    return apiClient.post<CompetitionDraw>('/draws/generate', drawData);
  }

  async updateMatch(drawId: string, matchData: UpdateMatchRequest): Promise<ApiResponse<Match>> {
    const { matchId, ...updateData } = matchData;
    return apiClient.put<Match>(`/draws/${drawId}/matches/${matchId}`, updateData);
  }

  async getDrawMatches(drawId: string): Promise<ApiResponse<Match[]>> {
    return apiClient.get<Match[]>(`/draws/${drawId}/matches`);
  }

  async getSchoolDraws(schoolId: string): Promise<ApiResponse<CompetitionDraw[]>> {
    return apiClient.get<CompetitionDraw[]>(`/draws/entity/${schoolId}`);
  }

  async getEventDraw(eventId: string): Promise<ApiResponse<CompetitionDraw | null>> {
    return apiClient.get<CompetitionDraw | null>(`/draws/event/${eventId}`);
  }

  async exportDraw(drawId: string, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> {
    const response = await fetch(`${apiClient['baseURL']}/draws/${drawId}/export?format=${format}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to export draw');
    }
    
    return response.blob();
  }

  async getDrawStats(): Promise<ApiResponse<{
    totalDraws: number;
    activeDraws: number;
    completedDraws: number;
    totalMatches: number;
    completedMatches: number;
  }>> {
    return apiClient.get<{
      totalDraws: number;
      activeDraws: number;
      completedDraws: number;
      totalMatches: number;
      completedMatches: number;
    }>('/draws/stats');
  }

  async scheduleMatch(drawId: string, matchId: string, scheduleData: {
    scheduledTime: string;
    venue: string;
  }): Promise<ApiResponse<Match>> {
    return apiClient.put<Match>(`/draws/${drawId}/matches/${matchId}/schedule`, scheduleData);
  }

  async startMatch(drawId: string, matchId: string): Promise<ApiResponse<Match>> {
    return apiClient.put<Match>(`/draws/${drawId}/matches/${matchId}/start`, {});
  }

  async completeMatch(drawId: string, matchId: string, result: {
    winner: string;
    score: string;
  }): Promise<ApiResponse<Match>> {
    return apiClient.put<Match>(`/draws/${drawId}/matches/${matchId}/complete`, result);
  }
}

export const drawService = new DrawService();