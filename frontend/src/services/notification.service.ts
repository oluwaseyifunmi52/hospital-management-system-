import api from '../api/client';
import type { Notification } from '../types/system';
import type { PaginatedResponse, QueryParams } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const notificationService = {
  async getNotifications(filters: QueryParams = {}): Promise<PaginatedResponse<Notification>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.unreadOnly) params.set('unreadOnly', 'true');

    const res = await api.get<ApiResponse<PaginatedResponse<Notification>>>(`/notifications?${params.toString()}`);
    return res.data.data;
  },

  async getNotification(id: string): Promise<Notification> {
    const res = await api.get<ApiResponse<Notification>>(`/notifications/${id}`);
    return res.data.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const res = await api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return res.data.data;
  },

  async markAllAsRead(): Promise<{ message: string }> {
    const res = await api.patch<ApiResponse<{ message: string }>>('/notifications/read-all');
    return res.data.data;
  },

  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },

  async getUnreadCount(): Promise<number> {
    const res = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return res.data.data.count;
  },
};