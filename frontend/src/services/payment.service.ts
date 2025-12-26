import api from '@/lib/api';

export interface InitiatePaymentRequest {
  order_id: number;
}

export interface InitiatePaymentResponse {
  payment_url?: string;
  message?: string;
}

export const paymentService = {
  // Initiate payment for an order
  async initiatePayment(data: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    const response = await api.post<{ data: InitiatePaymentResponse }>('/payments/initiate', data);
    if (!response.data) throw new Error('Failed to initiate payment');
    return response.data;
  },
};
