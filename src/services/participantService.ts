import { apiClient, ApiResponse } from './api';
import { Participant } from '../types';

export interface CreateParticipantRequest {
  name: string;
  age: number;
  grade: string;
  category: string;
  photo?: File;
  documents?: File[];
}

export interface UpdateParticipantRequest extends Partial<CreateParticipantRequest> {
  id: string;
}

export interface ParticipantFilters {
  schoolId?: string;
  category?: string;
  grade?: string;
  search?: string;
  eventId?: string;
}

class ParticipantService {
  async getAllParticipants(filters?: ParticipantFilters): Promise<ApiResponse<Participant[]>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockParticipants: Participant[] = [
      {
        id: '1',
        name: 'John Doe',
        age: 16,
        grade: '11th',
        category: 'academic',
        schoolId: '1',
        schoolName: 'Springfield High Entity',
        photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        documents: ['birth_certificate.pdf', 'medical_form.pdf'],
        eventsRegistered: ['1', '3'],
        results: [
          {
            eventId: '1',
            eventName: 'Mathematics Competition',
            position: 1,
            score: 95,
            status: 'completed',
            certificate: 'cert_math_john.pdf'
          }
        ]
      },
      {
        id: '2',
        name: 'Jane Smith',
        age: 17,
        grade: '12th',
        category: 'sporting',
        schoolId: '1',
        schoolName: 'Springfield High Entity',
        photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        documents: ['birth_certificate.pdf', 'sports_physical.pdf'],
        eventsRegistered: ['2', '5'],
        results: [
          {
            eventId: '5',
            eventName: 'Swimming Championship',
            position: 2,
            time: '1:45.32',
            status: 'completed'
          }
        ]
      },
      {
        id: '3',
        name: 'Mike Johnson',
        age: 15,
        grade: '10th',
        category: 'academic',
        schoolId: '2',
        schoolName: 'Riverside Academy',
        photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        documents: ['birth_certificate.pdf'],
        eventsRegistered: ['3', '4'],
        results: []
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        age: 18,
        grade: '12th',
        category: 'academic',
        schoolId: '4',
        schoolName: 'Central Entity',
        documents: ['birth_certificate.pdf', 'transcript.pdf'],
        eventsRegistered: ['4'],
        results: [
          {
            eventId: '4',
            eventName: 'Debate Championship',
            position: 3,
            status: 'completed',
            certificate: 'cert_debate_sarah.pdf'
          }
        ]
      }
    ];
    
    // Apply filters
    let filteredParticipants = mockParticipants;
    if (filters) {
      if (filters.schoolId) {
        filteredParticipants = filteredParticipants.filter(p => p.schoolId === filters.schoolId);
      }
      if (filters.category) {
        filteredParticipants = filteredParticipants.filter(p => p.category === filters.category);
      }
      if (filters.search) {
        filteredParticipants = filteredParticipants.filter(p =>
          p.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          p.schoolName.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
    }
    
    return {
      data: filteredParticipants,
      success: true,
      message: 'Participants retrieved successfully'
    };
  }

  async getParticipantById(id: string): Promise<ApiResponse<Participant>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const participants = await this.getAllParticipants();
    const participant = participants.data.find(p => p.id === id);
    
    if (!participant) {
      throw {
        message: 'Participant not found',
        status: 404
      };
    }
    
    return {
      data: participant,
      success: true,
      message: 'Participant retrieved successfully'
    };
  }

  async createParticipant(participantData: CreateParticipantRequest): Promise<ApiResponse<Participant>> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newParticipant: Participant = {
      id: 'participant-' + Date.now(),
      name: participantData.name,
      age: participantData.age,
      grade: participantData.grade,
      category: participantData.category,
      schoolId: 'current-entity-id', // Would come from auth context
      schoolName: 'Current Entity', // Would come from auth context
      photo: participantData.photo ? 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' : undefined,
      documents: participantData.documents?.map(doc => doc.name) || [],
      eventsRegistered: [],
      results: []
    };
    
    return {
      data: newParticipant,
      success: true,
      message: 'Participant created successfully'
    };
  }

  async updateParticipant(participantData: UpdateParticipantRequest): Promise<ApiResponse<Participant>> {
    await new Promise(resolve => setTimeout(resolve, 900));
    
    const { id, ...updateData } = participantData;
    const existingParticipant = await this.getParticipantById(id);
    
    const updatedParticipant: Participant = {
      ...existingParticipant.data,
      ...updateData,
      photo: updateData.photo ? 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' : existingParticipant.data.photo
    };
    
    return {
      data: updatedParticipant,
      success: true,
      message: 'Participant updated successfully'
    };
  }

  async deleteParticipant(id: string): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: { message: 'Participant deleted successfully' },
      success: true,
      message: 'Participant deleted successfully'
    };
  }

  async bulkUploadParticipants(file: File): Promise<ApiResponse<{ 
    success: number; 
    failed: number; 
    errors: string[] 
  }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.upload<{ 
      success: number; 
      failed: number; 
      errors: string[] 
    }>('/participants/bulk-upload', formData);
  }

  async getParticipantEvents(participantId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>(`/participants/${participantId}/events`);
  }

  async getParticipantResults(participantId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>(`/participants/${participantId}/results`);
  }

  async downloadParticipantDocument(participantId: string, documentName: string): Promise<Blob> {
    const response = await fetch(`${apiClient['baseURL']}/participants/${participantId}/documents/${documentName}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download document');
    }
    
    return response.blob();
  }

  async getParticipantStats(): Promise<ApiResponse<{
    totalParticipants: number;
    academicParticipants: number;
    sportsParticipants: number;
    withResults: number;
  }>> {
    return apiClient.get<{
      totalParticipants: number;
      academicParticipants: number;
      sportsParticipants: number;
      withResults: number;
    }>('/participants/stats');
  }
}

export const participantService = new ParticipantService();