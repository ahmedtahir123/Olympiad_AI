import { apiClient, ApiResponse } from './api';
import { Announcement } from '../types';

export interface CreateAnnouncementRequest {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  targetSchools?: string[];
  sendEmail?: boolean;
  sendSms?: boolean;
}

export interface NotificationFilters {
  type?: 'info' | 'warning' | 'success';
  targetSchools?: string[];
  dateFrom?: string;
  dateTo?: string;
}

class NotificationService {
  async getAllAnnouncements(filters?: NotificationFilters): Promise<ApiResponse<Announcement[]>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Registration Deadline Extended',
        message: 'The registration deadline for Mathematics Competition has been extended to March 1st, 2025. Entities can still register their participants.',
        type: 'info',
        targetSchools: ['1', '2', '4'],
        createdAt: '2025-01-25T10:00:00Z',
        createdBy: 'System Administrator'
      },
      {
        id: '2',
        title: 'Venue Change for Basketball Championship',
        message: 'Due to maintenance work, the Basketball Championship venue has been changed from Sports Complex Arena to Central Gymnasium. Please update your schedules accordingly.',
        type: 'warning',
        createdAt: '2025-01-24T14:30:00Z',
        createdBy: 'System Administrator'
      },
      {
        id: '3',
        title: 'Science Fair Results Published',
        message: 'Congratulations to all participants! The Science Fair results have been published and certificates are now available for download.',
        type: 'success',
        targetSchools: ['1', '2', '3', '4'],
        createdAt: '2025-01-23T16:45:00Z',
        createdBy: 'System Administrator'
      },
      {
        id: '4',
        title: 'New Compition Added: Swimming Championship',
        message: 'We are excited to announce a new event - Swimming Championship. Registration is now open for all age groups.',
        type: 'info',
        createdAt: '2025-01-22T09:15:00Z',
        createdBy: 'System Administrator'
      }
    ];
    
    // Apply filters
    let filteredAnnouncements = mockAnnouncements;
    if (filters) {
      if (filters.type) {
        filteredAnnouncements = filteredAnnouncements.filter(a => a.type === filters.type);
      }
      if (filters.targetSchools && filters.targetSchools.length > 0) {
        filteredAnnouncements = filteredAnnouncements.filter(a => 
          !a.targetSchools || a.targetSchools.some(entity => filters.targetSchools!.includes(entity))
        );
      }
    }
    
    return {
      data: filteredAnnouncements,
      success: true,
      message: 'Announcements retrieved successfully'
    };
  }

  async getAnnouncementById(id: string): Promise<ApiResponse<Announcement>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const announcements = await this.getAllAnnouncements();
    const announcement = announcements.data.find(a => a.id === id);
    
    if (!announcement) {
      throw {
        message: 'Announcement not found',
        status: 404
      };
    }
    
    return {
      data: announcement,
      success: true,
      message: 'Announcement retrieved successfully'
    };
  }

  async createAnnouncement(announcementData: CreateAnnouncementRequest): Promise<ApiResponse<Announcement>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAnnouncement: Announcement = {
      id: 'announcement-' + Date.now(),
      title: announcementData.title,
      message: announcementData.message,
      type: announcementData.type,
      targetSchools: announcementData.targetSchools,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
    
    return {
      data: newAnnouncement,
      success: true,
      message: 'Announcement created successfully'
    };
  }

  async updateAnnouncement(id: string, announcementData: Partial<CreateAnnouncementRequest>): Promise<ApiResponse<Announcement>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const existingAnnouncement = await this.getAnnouncementById(id);
    const updatedAnnouncement: Announcement = {
      ...existingAnnouncement.data,
      ...announcementData
    };
    
    return {
      data: updatedAnnouncement,
      success: true,
      message: 'Announcement updated successfully'
    };
  }

  async deleteAnnouncement(id: string): Promise<ApiResponse<{ message: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: { message: 'Announcement deleted successfully' },
      success: true,
      message: 'Announcement deleted successfully'
    };
  }

  async resendAnnouncement(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/notifications/${id}/resend`, {});
  }

  async getSchoolAnnouncements(schoolId: string): Promise<ApiResponse<Announcement[]>> {
    return apiClient.get<Announcement[]>(`/notifications/entity/${schoolId}`);
  }

  async markAsRead(announcementId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put<{ message: string }>(`/notifications/${announcementId}/read`, {});
  }

  async sendBulkNotification(data: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success';
    targetType: 'all' | 'entities' | 'event_participants';
    targetIds?: string[];
    channels: ('email' | 'sms' | 'push')[];
  }): Promise<ApiResponse<{ 
    sent: number; 
    failed: number; 
    announcementId: string 
  }>> {
    return apiClient.post<{ 
      sent: number; 
      failed: number; 
      announcementId: string 
    }>('/notifications/bulk', data);
  }

  async getNotificationStats(): Promise<ApiResponse<{
    totalAnnouncements: number;
    sentToday: number;
    totalRecipients: number;
    readRate: number;
  }>> {
    return apiClient.get<{
      totalAnnouncements: number;
      sentToday: number;
      totalRecipients: number;
      readRate: number;
    }>('/notifications/stats');
  }

  async getNotificationTemplates(): Promise<ApiResponse<{
    id: string;
    name: string;
    subject: string;
    content: string;
    type: string;
  }[]>> {
    return apiClient.get<{
      id: string;
      name: string;
      subject: string;
      content: string;
      type: string;
    }[]>('/notifications/templates');
  }
}

export const notificationService = new NotificationService();