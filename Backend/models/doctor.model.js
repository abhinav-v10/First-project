import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Doctor name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Doctor email is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            enum: [
                'General Medicine',
                'Cardiology',
                'Orthopedics',
                'Pediatrics',
                'Dermatology',
                'Neurology',
                'Gynecology',
                'ENT',
                'Ophthalmology',
                'Psychiatry',
            ],
        },
        designation: {
            type: String,
            enum: ['Junior Doctor', 'Senior Doctor', 'Consultant', 'HOD'],
            default: 'Junior Doctor',
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalFeedbacks: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
