import { getAuth } from '@clerk/express'; // NEW: Official Clerk Express helper
import Booking from '../models/bookingModel.js'; 

// ==========================================
// 1. CREATE BOOKING (Handles "Enroll Now")
// ==========================================
export const createBooking = async (req, res) => {
    try {
        // FIXED: Extract clerkUserId securely from the Clerk token, instead of relying on the frontend body
        const auth = getAuth(req);
        const clerkUserId = auth?.userId; 

        if (!clerkUserId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
        }

        // Extract the rest of the data sent from the React frontend
        const { studentName, courseId, courseName, teacherName, price } = req.body;

        const existingBooking = await Booking.findOne({ clerkUserId, course: courseId });
        if (existingBooking) {
            return res.status(400).json({
                success: false,
                alreadyBooked: true, 
                booking: existingBooking,
                message: "You already have a booking for this course."
            });
        }

        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); 
        const randomPart = Math.floor(1000 + Math.random() * 9000); 
        const invoiceNumber = `INV-${datePart}-${randomPart}`;
        const bookingId = `BK-${Date.now()}`;

        const newBooking = new Booking({
            bookingId,
            invoiceNumber,
            clerkUserId,     // Securely applied from the token!
            studentName,
            course: courseId, 
            courseName,
            teacherName,
            price
        });

        await newBooking.save();

        res.status(201).json({
            success: true,
            message: "Invoice generated successfully.",
            data: {
                invoiceNumber: newBooking.invoiceNumber,
                courseName: newBooking.courseName,
                price: newBooking.price,
                studentName: newBooking.studentName,
                paymentStatus: newBooking.paymentStatus
            }
        });

    } catch (error) {
        console.error("Error creating manual booking:", error);
        res.status(500).json({ success: false, message: "Failed to create invoice." });
    }
};

// ==========================================
// 2. CHECK BOOKING (Fires on course page load)
// ==========================================
export const checkBooking = async (req, res) => {
    try {
        const { courseId } = req.query;
        
        // FIXED: Using official getAuth helper
        const auth = getAuth(req);
        const clerkUserId = auth?.userId; 

        if (!clerkUserId || !courseId) {
            return res.status(400).json({ success: false, message: "Missing user or course ID" });
        }

        const booking = await Booking.findOne({ clerkUserId, course: courseId });

        if (booking) {
            return res.status(200).json({ success: true, enrolled: true, booking: booking });
        }
        return res.status(200).json({ success: true, enrolled: false });

    } catch (error) {
        console.error("Error checking booking:", error);
        res.status(500).json({ success: false, message: "Failed to check enrollment status." });
    }
};

// ==========================================
// 3. GET ALL BOOKINGS (Admin: BookingsPage.jsx)
// ==========================================
export const getBookings = async (req, res) => {
    try {
        const { search = "", limit = 200, page = 1 } = req.query;
        const query = {};
        
        if (search) {
            query.$or = [
                { studentName: { $regex: search, $options: "i" } },
                { courseName: { $regex: search, $options: "i" } },
                { invoiceNumber: { $regex: search, $options: "i" } },
                { teacherName: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (page - 1) * limit;
        const bookings = await Booking.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
        
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("Error getting bookings:", error);
        res.status(500).json({ success: false, message: "Failed to get bookings." });
    }
};

// ==========================================
// 4. GET USER BOOKINGS (Student: My Courses)
// ==========================================
export const getUserBookings = async (req, res) => {
    try {
        // FIXED: Using official getAuth helper
        const auth = getAuth(req);
        const clerkUserId = auth?.userId;

        if (!clerkUserId) {
            return res.status(401).json({ success: false, message: "Unauthorized: Missing Clerk User ID" });
        }

        const bookings = await Booking.find({ clerkUserId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("Error getting user bookings:", error);
        res.status(500).json({ success: false, message: "Failed to get user bookings." });
    }
};

// ==========================================
// 5. GET STATS (Admin: DashboardPage.jsx)
// ==========================================
export const getStats = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        
        const paidBookings = await Booking.find({ paymentStatus: "Paid" });
        const totalRevenue = paidBookings.reduce((sum, b) => sum + (b.price || 0), 0);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const bookingsLast7Days = await Booking.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

        const topCourses = await Booking.aggregate([
            { $match: { paymentStatus: "Paid" } },
            { $group: { _id: "$courseName", count: { $sum: 1 }, revenue: { $sum: "$price" } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { courseName: "$_id", count: 1, revenue: 1, _id: 0 } }
        ]);

        res.status(200).json({
            success: true,
            stats: { totalBookings, totalRevenue, bookingsLast7Days, topCourses }
        });
    } catch (error) {
        console.error("Error getting stats:", error);
        res.status(500).json({ success: false, message: "Failed to get stats." });
    }
};

// ==========================================
// 6. GET PENDING BOOKINGS (Admin Dashboard logic)
// ==========================================
export const getPendingBookings = async (req, res) => {
    try {
        const pendingBookings = await Booking.find({ paymentStatus: "Pending Verification" }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: pendingBookings.length, bookings: pendingBookings });
    } catch (error) {
        console.error("Error fetching pending bookings:", error);
        res.status(500).json({ success: false, message: "Failed to fetch pending bookings." });
    }
};

// ==========================================
// 7. APPROVE BOOKING (Admin Button Click)
// ==========================================
export const approveBooking = async (req, res) => {
    try {
        const { id } = req.params; 
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { paymentStatus: "Paid", orderStatus: "Approved" },
            { new: true } 
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        res.status(200).json({ success: true, message: "Course unlocked!", booking: updatedBooking });
    } catch (error) {
        console.error("Error approving booking:", error);
        res.status(500).json({ success: false, message: "Failed to approve booking." });
    }
};