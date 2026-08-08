import Invoice from '../models/Invoice';
import Payment from '../models/Payment';
import crypto from 'crypto';

export class BillingService {
  private generateInvoiceNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `INV-${timestamp}-${random}`;
  }

  private generatePaymentNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `PAY-${timestamp}-${random}`;
  }

  async createInvoice(data: {
    patientId: string;
    appointmentId?: string;
    admissionId?: string;
    items: Array<{ description: string; category: string; amount: number }>;
    tax?: number;
    discount?: number;
    dueDate?: Date;
    notes?: string;
    createdBy: string;
  }) {
    const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = data.tax || 0;
    const discount = data.discount || 0;
    const totalAmount = subtotal + tax - discount;

    return Invoice.create({
      invoiceNumber: this.generateInvoiceNumber(),
      patient: data.patientId,
      appointment: data.appointmentId,
      admission: data.admissionId,
      items: data.items,
      subtotal,
      tax,
      discount,
      totalAmount,
      status: 'draft',
      dueDate: data.dueDate,
      notes: data.notes,
      createdBy: data.createdBy,
    });
  }

  async getInvoices(filters: { patientId?: string; status?: string; page?: number; limit?: number }) {
    const { patientId, status, page = 1, limit = 10 } = filters;
    const query: any = {};
    if (patientId) query.patient = patientId;
    if (status && status !== 'all') query.status = status;

    const total = await Invoice.countDocuments(query);
    const invoices = await Invoice.find(query)
      .populate('patient', 'firstName lastName patientId')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: invoices,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getInvoiceById(id: string) {
    const invoice = await Invoice.findById(id)
      .populate('patient', 'firstName lastName patientId email phone')
      .populate('createdBy', 'firstName lastName');
    if (!invoice) throw new Error('Invoice not found');
    return invoice;
  }

  async recordPayment(data: {
    invoiceId: string;
    patientId: string;
    amount: number;
    method: string;
    reference?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    processedBy: string;
    notes?: string;
  }) {
    const invoice = await Invoice.findById(data.invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const payment = await Payment.create({
      paymentNumber: this.generatePaymentNumber(),
      invoice: data.invoiceId,
      patient: data.patientId,
      amount: data.amount,
      method: data.method as any,
      reference: data.reference,
      insuranceProvider: data.insuranceProvider,
      insurancePolicyNumber: data.insurancePolicyNumber,
      processedBy: data.processedBy,
      notes: data.notes,
    });

    const totalPaid = await Payment.aggregate([
      { $match: { invoice: invoice._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const paid = totalPaid[0]?.total || 0;
    if (paid >= invoice.totalAmount) {
      invoice.status = 'paid';
    } else if (paid > 0) {
      invoice.status = 'partially_paid';
    }
    await invoice.save();

    return payment;
  }

  async getPaymentsByInvoice(invoiceId: string) {
    return Payment.find({ invoice: invoiceId })
      .populate('processedBy', 'firstName lastName')
      .sort({ createdAt: -1 });
  }

  async getPaymentsByPatient(patientId: string) {
    return Payment.find({ patient: patientId })
      .populate('invoice', 'invoiceNumber totalAmount')
      .sort({ createdAt: -1 });
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalInvoices, paid, partiallyPaid, overdue, todayRevenue, totalRevenue] = await Promise.all([
      Invoice.countDocuments(),
      Invoice.countDocuments({ status: 'paid' }),
      Invoice.countDocuments({ status: 'partially_paid' }),
      Invoice.countDocuments({ status: 'overdue' }),
      Payment.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Payment.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    return {
      totalInvoices,
      paid,
      partiallyPaid,
      overdue,
      todayRevenue: todayRevenue[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
    };
  }
}
