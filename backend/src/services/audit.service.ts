import AuditLog from '../models/AuditLog';

export class AuditService {
  async log(data: {
    user: string;
    role: string;
    action: string;
    resource: string;
    resourceId: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    result?: 'success' | 'failure';
  }) {
    await AuditLog.create({
      ...data,
      result: data.result || 'success',
    });
  }

  async getLogs(filters: {
    user?: string;
    resource?: string;
    action?: string;
    page?: number;
    limit?: number;
  }) {
    const { user, resource, action, page = 1, limit = 50 } = filters;

    const query: any = {};
    if (user) query.user = user;
    if (resource) query.resource = resource;
    if (action) query.action = action;

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .populate('user', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

export const auditService = new AuditService();
