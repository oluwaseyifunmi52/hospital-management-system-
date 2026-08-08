"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const serviceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    fee: {
        type: Number,
        required: true,
        min: 0,
    },
    duration: {
        type: Number,
        required: true,
        min: 15,
        default: 30,
    },
});
const doctorProfileSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: [true, 'Professional title is required'],
        enum: ['Dr.', 'Prof.', 'Assoc. Prof.', 'Mr.', 'Mrs.', 'Ms.'],
    },
    specialty: {
        type: String,
        required: [true, 'Specialty is required'],
        trim: true,
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
    },
    licenseNumber: {
        type: String,
        required: [true, 'License number is required'],
        unique: true,
        trim: true,
    },
    yearsExperience: {
        type: Number,
        min: 0,
        default: 0,
    },
    qualifications: [
        {
            type: String,
            trim: true,
        },
    ],
    certifications: [
        {
            type: String,
            trim: true,
        },
    ],
    expertise: [
        {
            type: String,
            trim: true,
        },
    ],
    languages: [
        {
            type: String,
            trim: true,
        },
    ],
    bio: {
        type: String,
        maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    },
    profilePhoto: {
        type: String,
    },
    services: [serviceSchema],
    consultationFee: {
        type: Number,
        required: [true, 'Consultation fee is required'],
        min: 0,
    },
    inPersonConsultation: {
        type: Boolean,
        default: true,
    },
    videoConsultation: {
        type: Boolean,
        default: false,
    },
    workingDays: [
        {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
    ],
    workingHours: {
        start: {
            type: String,
            required: true,
        },
        end: {
            type: String,
            required: true,
        },
    },
    availabilityStatus: {
        type: String,
        enum: ['available', 'busy', 'off_duty'],
        default: 'available',
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    reviewCount: {
        type: Number,
        min: 0,
        default: 0,
    },
}, {
    timestamps: true,
});
doctorProfileSchema.index({ user: 1 });
doctorProfileSchema.index({ specialty: 1 });
doctorProfileSchema.index({ department: 1 });
doctorProfileSchema.index({ availabilityStatus: 1 });
const DoctorProfile = mongoose_1.default.model('DoctorProfile', doctorProfileSchema);
exports.default = DoctorProfile;
//# sourceMappingURL=DoctorProfile.js.map