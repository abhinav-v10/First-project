import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
        },
        age: {
            type: Number,
            min: 0,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
