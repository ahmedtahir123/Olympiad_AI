import { apiClient, ApiResponse } from './api';
import { Payment } from '../types';

export interface CreatePaymentRequest {
  eventIds: string[];
  amount: number;
  method: 'card' | 'bank_transfer' | 'cash';
  paymentDetails?: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
    bankAccount?: string;
    routingNumber?: string;
  };
}

export interface PaymentFilters {
  status?: 'pending' | 'completed' | 'failed';
  method?: 'card' | 'bank_transfer' | 'cash';
  schoolId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

class PaymentService {
  async getAllPayments(filters?: PaymentFilters): Promise<ApiResponse<Payment[]>> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const mockPayments: Payment[] = [
      {
        id: '1',
        schoolId: '1',
        schoolName: 'Springfield High Entity',
        amount: 350,
        method: 'card',
        status: 'completed',
        date: '2025-01-20T10:30:00Z',
        invoiceNumber: 'INV-2025-001',
        eventsIncluded: ['Mathematics Competition', 'Science Fair', 'Basketball Championship']
      },
      {
        id: '2',
        schoolId: '2',
        schoolName: 'Riverside Academy',
        amount: 275,
        method: 'bank_transfer',
        status: 'completed',
        date: '2025-01-22T14:15:00Z',
        invoiceNumber: 'INV-2025-002',
        eventsIncluded: ['Mathematics Competition', 'Swimming Championship']
      },
      {
        id: '3',
        schoolId: '4',
        schoolName: 'Central Entity',
        amount: 200,
        method: 'card',
        status: 'pending',
        date: '2025-01-25T09:45:00Z',
        invoiceNumber: 'INV-2025-003',
        eventsIncluded: ['Debate Championship', 'Science Fair']
      },
      {
        id: '4',
        schoolId: '1',
        schoolName: 'Springfield High Entity',
        amount: 150,
        method: 'cash',
        status: 'failed',
        date: '2025-01-18T16:20:00Z',
        invoiceNumber: 'INV-2025-004',
        eventsIncluded: ['Swimming Championship']
      }
    ];
    
    // Apply filters
    let filteredPayments = mockPayments;
    if (filters) {
      if (filters.status) {
        filteredPayments = filteredPayments.filter(p => p.status === filters.status);
      }
      if (filters.method) {
        filteredPayments = filteredPayments.filter(p => p.method === filters.method);
      }
      if (filters.schoolId) {
        filteredPayments = filteredPayments.filter(p => p.schoolId === filters.schoolId);
      }
      if (filters.search) {
        filteredPayments = filteredPayments.filter(p =>
          p.schoolName.toLowerCase().includes(filters.search!.toLowerCase()) ||
          p.invoiceNumber.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
    }
    
    return {
      data: filteredPayments,
      success: true,
      message: 'Payments retrieved successfully'
    };
  }

  async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const payments = await this.getAllPayments();
    const payment = payments.data.find(p => p.id === id);
    
    if (!payment) {
      throw {
        message: 'Payment not found',
        status: 404
      };
    }
    
    return {
      data: payment,
      success: true,
      message: 'Payment retrieved successfully'
    };
  }

  async createPayment(paymentData: CreatePaymentRequest): Promise<ApiResponse<Payment>> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate payment processing
    
    const newPayment: Payment = {
      id: 'payment-' + Date.now(),
      schoolId: 'current-entity-id',
      schoolName: 'Current Entity',
      amount: paymentData.amount,
      method: paymentData.method,
      status: 'completed',
      date: new Date().toISOString(),
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-3),
      eventsIncluded: paymentData.eventIds
    };
    
    return {
      data: newPayment,
      success: true,
      message: 'Payment processed successfully'
    };
  }

  async updatePaymentStatus(id: string, status: 'completed' | 'failed'): Promise<ApiResponse<Payment>> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const existingPayment = await this.getPaymentById(id);
    const updatedPayment: Payment = {
      ...existingPayment.data,
      status
    };
    
    return {
      data: updatedPayment,
      success: true,
      message: `Payment ${status} successfully`
    };
  }

  async getSchoolPayments(schoolId: string): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<Payment[]>(`/payments/entity/${schoolId}`);
  }

  async downloadInvoice(paymentId: string): Promise<Blob> {
    const response = await fetch(`${apiClient['baseURL']}/payments/${paymentId}/invoice`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download invoice');
    }
    
    return response.blob();
  }

  async exportPayments(filters?: PaymentFilters): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    
    const endpoint = `/payments/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(`${apiClient['baseURL']}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to export payments');
    }
    
    return response.blob();
  }

  async getPaymentStats(): Promise<ApiResponse<{
    totalRevenue: number;
    completedPayments: number;
    pendingAmount: number;
    failedPayments: number;
    monthlyRevenue: { month: string; amount: number }[];
  }>> {
    return apiClient.get<{
      totalRevenue: number;
      completedPayments: number;
      pendingAmount: number;
      failedPayments: number;
      monthlyRevenue: { month: string; amount: number }[];
    }>('/payments/stats');
  }

  async processRefund(paymentId: string, amount?: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/payments/${paymentId}/refund`, {
      amount,
    });
  }
}

export const paymentService = new PaymentService();