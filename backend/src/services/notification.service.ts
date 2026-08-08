import Notification from '../models/Notification';

export class NotificationService {
  async create(data: {
    userId: string;
    title: string;
    message: string;
    type: string;
    link?: string;
  }) {
    return Notification.create({
      user: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      link: data.link,
    });
  }

  async getByUser(userId: string, filters: { isRead?: boolean; page?: number; limit?: number }) {
    const { isRead, page = 1, limit = 20 } = filters;
    const query: any = { user: userId };
    if (isRead !== undefined) query.isRead = isRead;

    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: notifications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async markAsRead(id: string) {
    return Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
  }

  async markAllAsRead(userId: string) {
    return Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
  }

  async getUnreadCount(userId: string) {
    const count = await Notification.countDocuments({ user: userId, isRead: false });
    return { count };
  }

  async delete(id: string) {
    return Notification.findByIdAndDelete(id);
  }
}
