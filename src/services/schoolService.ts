import { apiClient, ApiResponse } from './api';
import { School } from '../types';

export interface UpdateSchoolRequest {
  name?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  logo?: string;
}

export interface SchoolFilters {
  status?: 'pending' | 'approved' | 'rejected';
  search?: string;
}

class SchoolService {
  async getAllSchools(filters?: SchoolFilters): Promise<ApiResponse<School[]>> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const mockSchools: School[] = [
      {
        id: '1',
        name: 'Springfield High School',
        contactEmail: 'admin@springfield.edu',
        contactPhone: '+1 (555) 123-4567',
        address: '123 Main Street, Springfield, IL 62701',
        logo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        status: 'approved',
        registeredAt: '2025-01-15T10:30:00Z',
        totalStudents: 1200,
        eventsJoined: 8
      },
      {
        id: '2',
        name: 'Riverside Academy',
        contactEmail: 'contact@riverside.edu',
        contactPhone: '+1 (555) 234-5678',
        address: '456 River Road, Riverside, CA 92501',
        status: 'approved',
        registeredAt: '2025-01-18T14:20:00Z',
        totalStudents: 950,
        eventsJoined: 6
      },
      {
        id: '3',
        name: 'Oakwood High',
        contactEmail: 'info@oakwood.edu',
        contactPhone: '+1 (555) 345-6789',
        address: '789 Oak Avenue, Oakwood, TX 75001',
        status: 'pending',
        registeredAt: '2025-01-22T09:15:00Z',
        totalStudents: 800,
        eventsJoined: 0
      },
      {
        id: '4',
        name: 'Central School',
        contactEmail: 'admin@central.edu',
        contactPhone: '+1 (555) 456-7890',
        address: '321 Central Blvd, Central City, NY 10001',
        status: 'approved',
        registeredAt: '2025-01-20T16:45:00Z',
        totalStudents: 1100,
        eventsJoined: 5
      },
      {
        id: '5',
        name: 'Mountain View School',
        contactEmail: 'contact@mountainview.edu',
        contactPhone: '+1 (555) 567-8901',
        address: '654 Mountain Road, Mountain View, CO 80424',
        status: 'rejected',
        registeredAt: '2025-01-25T11:30:00Z',
        totalStudents: 600,
        eventsJoined: 0
      }
    ];
    
    // Apply filters
    let filteredSchools = mockSchools;
    if (filters) {
      if (filters.status) {
        filteredSchools = filteredSchools.filter(school => school.status === filters.status);
      }
      if (filters.search) {
        filteredSchools = filteredSchools.filter(school =>
          school.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          school.contactEmail.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
    }
    
    return {
      data: filteredSchools,
      success: true,
      message: 'Schools retrieved successfully'
    };
  }

  async getSchoolById(id: string): Promise<ApiResponse<School>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const schools = await this.getAllSchools();
    const school = schools.data.find(s => s.id === id);
    
    if (!school) {
      throw {
        message: 'School not found',
        status: 404
      };
    }
    
    return {
      data: school,
      success: true,
      message: 'School retrieved successfully'
    };
  }

  async updateSchool(id: string, schoolData: UpdateSchoolRequest): Promise<ApiResponse<School>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const existingSchool = await this.getSchoolById(id);
    const updatedSchool: School = {
      ...existingSchool.data,
      ...schoolData
    };
    
    return {
      data: updatedSchool,
      success: true,
      message: 'School updated successfully'
    };
  }

  async updateSchoolStatus(id: string, status: 'approved' | 'rejected'): Promise<ApiResponse<School>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const existingSchool = await this.getSchoolById(id);
    const updatedSchool: School = {
      ...existingSchool.data,
      status
    };
    
    return {
      data: updatedSchool,
      success: true,
      message: `School ${status} successfully`
    };
  }

  async deleteSchool(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/schools/${id}`);
  }

  async uploadSchoolLogo(id: string, logoFile: File): Promise<ApiResponse<{ logoUrl: string }>> {
    const formData = new FormData();
    formData.append('logo', logoFile);
    
    return apiClient.upload<{ logoUrl: string }>(`/schools/${id}/logo`, formData);
  }

  async getSchoolStats(): Promise<ApiResponse<{
    totalSchools: number;
    pendingSchools: number;
    approvedSchools: number;
    rejectedSchools: number;
  }>> {
    return apiClient.get<{
      totalSchools: number;
      pendingSchools: number;
      approvedSchools: number;
      rejectedSchools: number;
    }>('/schools/stats');
  }

  async getSchoolEvents(schoolId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>(`/schools/${schoolId}/events`);
  }

  async getSchoolParticipants(schoolId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>(`/schools/${schoolId}/participants`);
  }
}

export const schoolService = new SchoolService();