import Drug from '../models/Drug';
import PharmacySale from '../models/PharmacySale';
import Prescription from '../models/Prescription';
import Notification from '../models/Notification';

export class PharmacyService {
  async addDrug(data: {
    name: string;
    genericName?: string;
    category: string;
    batchNumber: string;
    quantity: number;
    unitPrice: number;
    sellingPrice: number;
    expiryDate: Date;
    supplier?: string;
    reorderLevel?: number;
  }) {
    const existing = await Drug.findOne({ batchNumber: data.batchNumber });
    if (existing) throw new Error('Batch number already exists');

    return Drug.create(data);
  }

  async getDrugs(filters: { search?: string; category?: string; page?: number; limit?: number }) {
    const { search, category, page = 1, limit = 10 } = filters;
    const query: any = { isActive: true };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { batchNumber: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;

    const total = await Drug.countDocuments(query);
    const drugs = await Drug.find(query)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: drugs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async updateDrug(id: string, data: Partial<typeof Drug.prototype>) {
    const drug = await Drug.findByIdAndUpdate(id, data, { new: true });
    if (!drug) throw new Error('Drug not found');
    return drug;
  }

  async dispense(data: {
    prescriptionId?: string;
    patientId: string;
    pharmacistId: string;
    items: Array<{ drugId: string; quantity: number }>;
  }) {
    const items = [];
    let totalAmount = 0;

    for (const item of data.items) {
      const drug = await Drug.findById(item.drugId);
      if (!drug) throw new Error(`Drug not found: ${item.drugId}`);
      if (drug.quantity < item.quantity) throw new Error(`Insufficient stock for ${drug.name}`);

      drug.quantity -= item.quantity;
      await drug.save();

      const total = drug.sellingPrice * item.quantity;
      items.push({
        drug: drug._id,
        quantity: item.quantity,
        unitPrice: drug.sellingPrice,
        total,
      });
      totalAmount += total;
    }

    const sale = await PharmacySale.create({
      prescription: data.prescriptionId,
      patient: data.patientId,
      pharmacist: data.pharmacistId,
      items,
      totalAmount,
      paymentStatus: 'pending',
    });

    if (data.prescriptionId) {
      await Prescription.findByIdAndUpdate(data.prescriptionId, { status: 'completed' });
    }

    return sale;
  }

  async getSales(filters: { patientId?: string; page?: number; limit?: number }) {
    const { patientId, page = 1, limit = 10 } = filters;
    const query: any = {};
    if (patientId) query.patient = patientId;

    const total = await PharmacySale.countDocuments(query);
    const sales = await PharmacySale.find(query)
      .populate('patient', 'firstName lastName patientId')
      .populate('pharmacist', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: sales,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getLowStockDrugs() {
    return Drug.find({
      isActive: true,
      $expr: { $lte: ['$quantity', '$reorderLevel'] },
    }).sort({ quantity: 1 });
  }

  async getExpiringDrugs(days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return Drug.find({
      isActive: true,
      expiryDate: { $lte: futureDate },
    }).sort({ expiryDate: 1 });
  }

  async getStats() {
    const [totalDrugs, lowStock, expiring, totalSales] = await Promise.all([
      Drug.countDocuments({ isActive: true }),
      Drug.countDocuments({
        isActive: true,
        $expr: { $lte: ['$quantity', '$reorderLevel'] },
      }),
      Drug.countDocuments({
        isActive: true,
        expiryDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      }),
      PharmacySale.countDocuments(),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySales = await PharmacySale.countDocuments({ createdAt: { $gte: today } });

    return { totalDrugs, lowStock, expiring, totalSales, todaySales };
  }
}
