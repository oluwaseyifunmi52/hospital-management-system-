import mongoose, { Schema, Model } from 'mongoose';
import { INursingNote } from '../types';

const nursingNoteSchema = new Schema<INursingNote>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    nurse: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['general', 'medication', 'assessment', 'instruction', 'handover'],
      default: 'general',
    },
  },
  { timestamps: true }
);

const NursingNote: Model<INursingNote> = mongoose.model<INursingNote>('NursingNote', nursingNoteSchema);
export default NursingNote;
