import express from 'express';
import { 
    checkBooking, 
    createBooking, 
    getBookings, 
    getStats, 
    getUserBookings,
    getPendingBookings, // NEW: Admin pending list
    approveBooking      // NEW: Admin approval action
} from '../controllers/bookingController.js';

const bookingRouter = express.Router();

// General Routes
bookingRouter.get('/', getBookings);
bookingRouter.get('/stats', getStats);

// User Booking Routes
bookingRouter.post('/create', createBooking);
bookingRouter.get('/check', checkBooking); 
bookingRouter.get('/my', getUserBookings);

// NEW: Admin Verification Routes
bookingRouter.get('/admin/pending', getPendingBookings);
bookingRouter.put('/admin/approve/:id', approveBooking);

// NOTE: bookingRouter.get('/confirm', confirmPayment) has been REMOVED.

export default bookingRouter;