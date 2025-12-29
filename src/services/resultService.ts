import { apiClient, ApiResponse } from './api';
import { ParticipantResult } from '../types';

export interface CreateResultRequest {
  eventId: string;
  participantId: string;
  position?: number;
  score?: number;
  time?: string;
  notes?: string;
}

export interface BulkResultRequest {
  eventId: string;
  results: {
    participantId: string;
    position?: number;
    score?: number;
    time?: string;
    notes?: string;
  }[];
}

export interface ResultFilters {
  eventId?: string;
  participantId?: string;
  schoolId?: string;
  status?: 'pending' | 'completed';
}

class ResultService {
  async getAllResults(filters?: ResultFilters): Promise<ApiResponse<ParticipantResult[]>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockResults: ParticipantResult[] = [
      {
        eventId: '1',
        eventName: 'Mathematics Competition',
        position: 1,
        score: 95,
        status: 'completed',
        certificate: 'cert_math_001.pdf'
      },
      {
        eventId: '2',
        eventName: 'Basketball Championship',
        position: 2,
        status: 'completed',
        certificate: 'cert_basketball_002.pdf'
      },
      {
        eventId: '3',
        eventName: 'Science Fair',
        position: 3,
        score: 88,
        status: 'completed'
      },
      {
        eventId: '4',
        eventName: 'Debate Championship',
        status: 'pending'
      },
      {
        eventId: '5',
        eventName: 'Swimming Championship',
        position: 1,
        time: '1:45.32',
        status: 'completed',
        certificate: 'cert_swimming_005.pdf'
      }
    ];
    
    // Apply filters
    let filteredResults = mockResults;
    if (filters) {
      if (filters.eventId) {
        filteredResults = filteredResults.filter(r => r.eventId === filters.eventId);
      }
      if (filters.status) {
        filteredResults = filteredResults.filter(r => r.status === filters.status);
      }
    }
    
    return {
      data: filteredResults,
      success: true,
      message: 'Results retrieved successfully'
    };
  }

  async getResultById(id: string): Promise<ApiResponse<ParticipantResult>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const results = await this.getAllResults();
    const result = results.data[0]; // Mock single result
    
    return {
      data: result,
      success: true,
      message: 'Result retrieved successfully'
    };
  }

  async createResult(resultData: CreateResultRequest): Promise<ApiResponse<ParticipantResult>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newResult: ParticipantResult = {
      eventId: resultData.eventId,
      eventName: 'Competition Name', // Would be fetched from event service
      position: resultData.position,
      score: resultData.score,
      time: resultData.time,
      status: 'completed'
    };
    
    return {
      data: newResult,
      success: true,
      message: 'Result created successfully'
    };
  }

  async createBulkResults(bulkData: BulkResultRequest): Promise<ApiResponse<{
    success: number;
    failed: number;
    results: ParticipantResult[];
  }>> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results: ParticipantResult[] = bulkData.results.map(result => ({
      eventId: bulkData.eventId,
      eventName: 'Competition Name',
      position: result.position,
      score: result.score,
      time: result.time,
      status: 'completed'
    }));
    
    return {
      data: {
        success: results.length,
        failed: 0,
        results
      },
      success: true,
      message: 'Bulk results created successfully'
    };
  }

  async updateResult(id: string, resultData: Partial<CreateResultRequest>): Promise<ApiResponse<ParticipantResult>> {
    return apiClient.put<ParticipantResult>(`/results/${id}`, resultData);
  }

  async deleteResult(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/results/${id}`);
  }

  async publishResults(eventId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put<{ message: string }>(`/results/event/${eventId}/publish`, {});
  }

  async getEventResults(eventId: string): Promise<ApiResponse<ParticipantResult[]>> {
    return apiClient.get<ParticipantResult[]>(`/results/event/${eventId}`);
  }

  async getParticipantResults(participantId: string): Promise<ApiResponse<ParticipantResult[]>> {
    return apiClient.get<ParticipantResult[]>(`/results/participant/${participantId}`);
  }

  async getSchoolResults(schoolId: string): Promise<ApiResponse<ParticipantResult[]>> {
    return apiClient.get<ParticipantResult[]>(`/results/entity/${schoolId}`);
  }

  async generateCertificate(resultId: string): Promise<ApiResponse<{ certificateUrl: string }>> {
    return apiClient.post<{ certificateUrl: string }>(`/results/${resultId}/certificate`, {});
  }

  async downloadCertificate(resultId: string): Promise<Blob> {
    const response = await fetch(`${apiClient['baseURL']}/results/${resultId}/certificate/download`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download certificate');
    }
    
    return response.blob();
  }

  async uploadResultsFile(eventId: string, file: File): Promise<ApiResponse<{
    success: number;
    failed: number;
    errors: string[];
  }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('eventId', eventId);
    
    return apiClient.upload<{
      success: number;
      failed: number;
      errors: string[];
    }>('/results/upload', formData);
  }

  async exportResults(eventId: string, format: 'excel' | 'pdf' = 'excel'): Promise<Blob> {
    const response = await fetch(`${apiClient['baseURL']}/results/event/${eventId}/export?format=${format}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to export results');
    }
    
    return response.blob();
  }

  async getResultStats(): Promise<ApiResponse<{
    totalResults: number;
    publishedResults: number;
    pendingResults: number;
    certificatesGenerated: number;
  }>> {
    return apiClient.get<{
      totalResults: number;
      publishedResults: number;
      pendingResults: number;
      certificatesGenerated: number;
    }>('/results/stats');
  }
}

export const resultService = new ResultService();