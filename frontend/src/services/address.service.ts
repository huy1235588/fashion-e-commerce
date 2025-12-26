import api from '@/lib/api';
import { Address, CreateAddressRequest, UpdateAddressRequest } from '@/types';

export const addressService = {
  // Get all addresses for the current user
  async getAddresses(): Promise<Address[]> {
    const response = await api.get<{ data: Address[] }>('/addresses');
    return response.data ?? [];
  },

  // Get a specific address
  async getAddress(id: number): Promise<Address> {
    const response = await api.get<{ data: Address }>(`/addresses/${id}`);
    if (!response.data) throw new Error('Address not found');
    return response.data;
  },

  // Create a new address
  async createAddress(data: CreateAddressRequest): Promise<Address> {
    const response = await api.post<{ data: Address }>('/addresses', data);
    if (!response.data) throw new Error('Failed to create address');
    return response.data;
  },

  // Update an existing address
  async updateAddress(id: number, data: UpdateAddressRequest): Promise<Address> {
    const response = await api.put<{ data: Address }>(`/addresses/${id}`, data);
    if (!response.data) throw new Error('Failed to update address');
    return response.data;
  },

  // Delete an address
  async deleteAddress(id: number): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },

  // Set an address as default
  async setDefaultAddress(id: number): Promise<Address> {
    const response = await api.put<{ data: Address }>(`/addresses/${id}/set-default`);
    if (!response.data) throw new Error('Failed to set default address');
    return response.data;
  },
};
