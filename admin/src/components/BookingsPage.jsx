import React, { useEffect, useRef, useState } from "react";
import { bookingsStyles } from "../assets/dummyStyles";
import { BadgeIndianRupee, BookOpen, GraduationCap, Search, User, CheckCircle, Clock } from "lucide-react";

const API_BASE = "https://lms-site-8cyh.onrender.com";

const BookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // Tracks which booking is being approved
  
  const [page, setPage] = useState(1); 
  const limit = 200;

  // debounce timer and abort controller
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const fetchBookings = async (search = "") => {
    setLoading(true);
    setError(null);

    // abort previous
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      q.set("limit", String(limit));
      q.set("page", String(page));

      const res = await fetch(`${API_BASE}/api/booking?${q.toString()}`, {
        method: "GET",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.message || `Request failed with status ${res.status}`
        );
      }

      const data = await res.json();
      if (data && data.success) {
        const normalized = (data.bookings || []).map((b, idx) => ({
          id: b._id || b.bookingId || String(idx),
          invoiceNumber: b.invoiceNumber || "N/A", // NEW: Added Invoice Number
          paymentStatus: b.paymentStatus || "Unknown", // NEW: Added Payment Status
          studentName: b.studentName || b.userName || "Unknown student",
          courseName: b.courseName || "Untitled course",
          price: b.price ?? 0,
          teacherName: b.teacherName || "Unknown teacher",
          purchaseDate: b.createdAt
            ? new Date(b.createdAt).toISOString().split("T")[0]
            : b.purchaseDate || "",
          raw: b,
        }));

        setBookings(normalized);
      } else {
        setBookings([]);
        setError(data?.message || "No data");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        // aborted — ignore
      } else {
        console.error("fetchBookings error:", err);
        setError(err.message || "Failed to fetch bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings("");
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchBookings(searchTerm.trim());
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  // NEW: Function to handle the approval of a pending booking
  const handleApprove = async (bookingId) => {
    if (!window.confirm("Are you sure you want to approve this payment and unlock the course?")) return;
    
    setActionLoading(bookingId);
    try {
        const res = await fetch(`${API_BASE}/api/booking/admin/approve/${bookingId}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();

        if (data.success) {
            // Update the local state so the UI reflects the change immediately without a page refresh
            setBookings(prev => prev.map(b => 
                b.id === bookingId ? { ...b, paymentStatus: 'Paid' } : b
            ));
            alert("Course unlocked! Student is now enrolled.");
        } else {
            alert(data.message || "Failed to approve booking.");
        }
    } catch (error) {
        console.error("Approval error:", error);
        alert("An error occurred while approving.");
    } finally {
        setActionLoading(null);
    }
  };

  return (
    <div className={bookingsStyles.pageContainer}>
      <div className={bookingsStyles.contentContainer}>
        <div className={bookingsStyles.headerContainer}>
          <h1 className={bookingsStyles.headerTitle}>Course Bookings</h1>
          <p className={bookingsStyles.headerSubtitle}>
            Manage and verify student course purchases
          </p>
        </div>

        {/* Search */}
        <div className={bookingsStyles.searchContainer}>
          <div className={bookingsStyles.searchInputContainer}>
            <Search className={bookingsStyles.searchIcon} />
            <input
              type="text"
              placeholder="Search by student, invoice no, course, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={bookingsStyles.searchInput}
            />
          </div>
        </div>

        <div style={{ minHeight: 36 }}>
          {loading && (
            <div className={bookingsStyles.loadingState}>
              <p>Loading bookings...</p>
            </div>
          )}
          {!loading && error && (
            <div className={bookingsStyles.errorState}>
              <p>Error: {error}</p>
            </div>
          )}
        </div>

        {/* booking grid */}
        <div className={bookingsStyles.bookingsGrid}>
          {!loading &&
            bookings.map((booking) => (
              <div key={booking.id} className={bookingsStyles.bookingCard}>
                
                {/* 1. Student Section */}
                <div className={bookingsStyles.studentSection}>
                  <div className={bookingsStyles.studentIconContainer}>
                    <User className={bookingsStyles.studentIcon} />
                  </div>

                  <div className={bookingsStyles.studentInfo}>
                    <h3 className={bookingsStyles.studentName}>
                      {booking.studentName}
                    </h3>
                    {/* NEW: Displaying the Invoice Number clearly */}
                    <p className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded mt-1 mb-1">
                      {booking.invoiceNumber}
                    </p>
                    <p className={bookingsStyles.purchaseDate}>
                      Purchased on {booking.purchaseDate || "-"}
                    </p>
                  </div>
                </div>

                {/* 2. Course Details */}
                <div className={bookingsStyles.courseDetails}>
                  <div className={bookingsStyles.detailItem}>
                    <BookOpen className={bookingsStyles.detailIcon} />
                    <span className={bookingsStyles.detailLabel}>Course:</span>
                    <span className={bookingsStyles.detailValue}>
                      {booking.courseName}
                    </span>
                  </div>

                  <div className={bookingsStyles.detailItem}>
                    <BadgeIndianRupee className={bookingsStyles.detailIcon} />
                    <span className={bookingsStyles.detailLabel}>Price:</span>
                    <span className={bookingsStyles.detailValue}>
                      ₹{booking.price}
                    </span>
                  </div>

                  <div className={bookingsStyles.detailItem}>
                    <GraduationCap className={bookingsStyles.detailIcon} />
                    <span className={bookingsStyles.detailLabel}>Teacher:</span>
                    <span className={bookingsStyles.detailValue}>
                      {booking.teacherName}
                    </span>
                  </div>
                </div>

                {/* 3. Status Container & Action Buttons */}
                <div className={`${bookingsStyles.statusContainer} flex flex-col items-end gap-2`}>
                  {/* Dynamic Badge based on status */}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
                    ${booking.paymentStatus === 'Pending Verification' ? 'bg-yellow-100 text-yellow-800' : 
                      booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {booking.paymentStatus === 'Pending Verification' ? <Clock className="w-3 h-3"/> : <CheckCircle className="w-3 h-3"/>}
                    {booking.paymentStatus}
                  </span>

                  {/* NEW: The Approve Button only shows if it is pending */}
                  {booking.paymentStatus === "Pending Verification" && (
                     <button
                        onClick={() => handleApprove(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:bg-indigo-400 shadow-sm flex items-center gap-2"
                     >
                        {actionLoading === booking.id ? "Approving..." : "Approve Payment"}
                     </button>
                  )}
                </div>
                
              </div>
            ))}
        </div>

        {/* no result */}
        {!loading && bookings.length === 0 && !error && (
          <div className={bookingsStyles.emptyState}>
            <div className={bookingsStyles.emptyContainer}>
              <Search className={bookingsStyles.emptyIcon} />
              <h3 className={bookingsStyles.emptyTitle}>No bookings found</h3>
              <p className={bookingsStyles.emptyText}>
                No bookings match your search criteria. Try adjusting your
                search terms.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;