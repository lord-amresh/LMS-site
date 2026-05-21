import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    // Internal ID for your system
    bookingId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    // The ID you display on the frontend invoice and ask the user to send on WhatsApp
    invoiceNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    clerkUserId: {
        type: String,
        required: true,
        index: true
    },
    studentName: {
        type: String,
        default: 'Unknown'
    },
    course: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    teacherName: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true
    },

    paymentMethod: { 
        type: String, 
        enum: ["Manual QR Scan", "Online"], 
        default: "Manual QR Scan" 
    },
    
    // Updated states for the WhatsApp verification flow
    paymentStatus: { 
        type: String, 
        enum: ["Pending Verification", "Paid", "Rejected", "Unpaid"], 
        default: "Pending Verification" 
    },

    // Updated states to reflect admin actions
    orderStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Cancelled", "Completed"],
        default: "Pending",
    },

    notes: { type: String, default: "" },
}, {
    timestamps: true
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;