import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Clock,
  BookOpen,
  ChevronDown,
  CheckCircle,
  Circle,
  X,
  ArrowLeft,
  User,
  Award,
  Target,
  ArrowRight,
  Sparkles,
  Receipt
} from "lucide-react";
import {
  courseDetailStylesH,
  courseDetailStyles,
  toastStyles,
  animationDelaysH,
  courseDetailCustomStyles,
} from "../assets/dummyStyles";

import { useUser, useAuth } from "@clerk/react";

const API_BASE = "https://lms-site-8cyh.onrender.com";

const fmtMinutes = (mins) => {
  const h = Math.floor((mins || 0) / 60);
  const m = (mins || 0) % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${toastStyles.toast} ${
        type === "error" ? toastStyles.toastError : toastStyles.toastInfo
      }`}
    >
      <div className={toastStyles.toastContent}>
        <span>{message}</span>
        <button onClick={onClose} className={toastStyles.toastClose}>
          <X className={toastStyles.toastCloseIcon} />
        </button>
      </div>
    </div>
  );
};

const toEmbedUrl = (url) => {
  if (!url) return "";
  try {
    const trimmed = String(url).trim();
    if (/\/embed\//.test(trimmed)) return trimmed;
    const watchMatch = trimmed.match(/[?&]v=([^&#]+)/);
    if (watchMatch && watchMatch[1])
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    const shortMatch = trimmed.match(/youtu\.be\/([^?&#/]+)/);
    if (shortMatch && shortMatch[1])
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    const lastSeg = trimmed.split("/").filter(Boolean).pop();
    if (lastSeg && lastSeg.length === 11)
      return `https://www.youtube.com/embed/${lastSeg}`;
    return trimmed;
  } catch (e) {
    return url;
  }
};

const appendAutoplay = (embedUrl, autoplay = true) => {
  if (!embedUrl) return "";
  
  let finalUrl = embedUrl;

  // 1. Add clean parameters if it's a YouTube link (hides logo, restricts related videos)
  if (finalUrl.includes("youtube.com/embed")) {
    const separator = finalUrl.includes("?") ? "&" : "?";
    finalUrl = `${finalUrl}${separator}modestbranding=1&rel=0`;
  }

  // 2. Add autoplay logic if the user is enrolled
  if (autoplay) {
    const separator = finalUrl.includes("?") ? "&" : "?";
    finalUrl = `${finalUrl}${separator}autoplay=1`;
  }

  return finalUrl;
};

const normalizeCourse = (c) => {
  if (!c) return c;
  const course = { ...c };
  course.lectures = Array.isArray(course.lectures)
    ? course.lectures.map((l) => {
        const lecture = { ...l };
        lecture.durationMin =
          lecture.durationMin ??
          lecture.totalMinutes ??
          (lecture.duration?.hours || 0) * 60 +
            (lecture.duration?.minutes || 0);
        lecture.chapters = Array.isArray(lecture.chapters)
          ? lecture.chapters.map((ch) => {
              const chapter = { ...ch };
              chapter.durationMin =
                chapter.durationMin ??
                chapter.totalMinutes ??
                (chapter.duration?.hours || 0) * 60 +
                  (chapter.duration?.minutes || 0);
              return chapter;
            })
          : [];
        return lecture;
      })
    : [];
  return course;
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = id;

  const { user } = useUser();
  const { getToken } = useAuth();
  const isLoggedIn = Boolean(user);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const [toast, setToast] = useState(null);
  const [expandedLectures, setExpandedLectures] = useState(new Set());
  const [completedChapters, setCompletedChapters] = useState(new Set());
  const [isTeacherAnimating, setIsTeacherAnimating] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const studentNameFromUser = useMemo(() => {
    if (!user) return "";
    const fullName =
      user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const email =
      user.primaryEmailAddress?.emailAddress ||
      (user.emailAddresses && user.emailAddresses[0]?.emailAddress) ||
      "";
    return fullName || email || "";
  }, [user]);

  const studentEmailFromUser = useMemo(() => {
    if (!user) return "";
    return (
      user.primaryEmailAddress?.emailAddress ||
      (user.emailAddresses && user.emailAddresses[0]?.emailAddress) ||
      ""
    );
  }, [user]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/course/${courseId}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to fetch course ${courseId}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!mounted) return;
        if (!json || !json.success) {
          throw new Error((json && json.message) || "Failed to load course");
        }
        const normalized = normalizeCourse(json.course);
        setCourse(normalized);
      })
      .catch((err) => {
        console.error("Failed to load course:", err);
        if (mounted) setError(err.message || "Failed to load course");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [courseId]);

  useEffect(() => {
    let mounted = true;
    if (!course || !isLoggedIn) return;

    const checkEnrollment = async () => {
      try {
        const token = await getToken();
        const q = `${API_BASE}/api/booking/check?courseId=${encodeURIComponent(
          course._id ?? course.id ?? courseId
        )}`;

        const res = await fetch(q, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));

        if (!mounted) return;

        if (data.success && data.enrolled) {
          setBookingInfo(data.booking);
          if (
            course.pricingType === "free" ||
            data.booking?.paymentStatus === "Paid"
          ) {
            setIsEnrolled(true);
          } else if (data.booking?.paymentStatus === "Pending Verification") {
              setInvoiceData({
                  invoiceNumber: data.booking.invoiceNumber,
                  courseName: data.booking.courseName,
                  price: data.booking.price,
                  studentName: data.booking.studentName
              })
          }
        }
      } catch (err) {
        console.debug("booking.check failed:", err);
      }
    };

    checkEnrollment();
    return () => (mounted = false);
  }, [course, isLoggedIn, getToken, courseId]);

  useEffect(() => {
    setIsTeacherAnimating(true);
    const timer = setTimeout(() => setIsTeacherAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [course]);

  useEffect(() => setIsPageLoaded(true), []);

  const [selectedContent, setSelectedContent] = useState({
    type: "lecture",
    lectureId: null,
    chapterId: null,
  });

  const selectedLecture = useMemo(() => {
    if (!selectedContent.lectureId || !course) return null;
    return (
      (course.lectures || []).find(
        (l) =>
          String(l.id) === String(selectedContent.lectureId) ||
          String(l._id) === String(selectedContent.lectureId)
      ) || null
    );
  }, [course, selectedContent.lectureId]);

  const selectedChapter = useMemo(() => {
    if (!selectedContent.chapterId || !selectedLecture) return null;
    return (
      (selectedLecture.chapters || []).find(
        (ch) =>
          String(ch.id) === String(selectedContent.chapterId) ||
          String(ch._id) === String(selectedContent.chapterId)
      ) || null
    );
  }, [selectedLecture, selectedContent.chapterId]);

  const currentVideoContent = useMemo(() => {
    if (selectedContent.type === "chapter" && selectedChapter)
      return selectedChapter;
    if (selectedContent.type === "lecture" && selectedLecture)
      return selectedLecture;
    return null;
  }, [selectedContent, selectedLecture, selectedChapter]);

  const totalMinutes = useMemo(
    () =>
      (course?.lectures || []).reduce(
        (sum, l) => sum + (l.durationMin || l.totalMinutes || 0),
        0
      ),
    [course]
  );

  const priceObj = course?.price;
  const hasPriceObj = !!(
    priceObj &&
    (priceObj.sale != null || priceObj.original != null)
  );
  const salePrice =
    hasPriceObj && priceObj.sale != null ? Number(priceObj.sale) : null;
  const originalPrice =
    hasPriceObj && priceObj.original != null ? Number(priceObj.original) : null;
  const formatCurrency = (n) => (n == null || Number.isNaN(n) ? "" : `₹${n}`);
  const hasDiscount =
    originalPrice != null && salePrice != null && originalPrice > salePrice;
  const courseIsFree = course
    ? !!course.isFree ||
      !course.price ||
      (!course.price.sale && !course.price.original) ||
      course.pricingType === "free"
    : true;

  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => {
      const next = new Set(prev);
      if (next.has(lectureId)) next.delete(lectureId);
      else next.add(lectureId);
      return next;
    });
  };

  const handleContentSelect = (lectureId, chapterId = null) => {
    if (isLoggedIn && isEnrolled) {
      setSelectedContent({
        type: chapterId ? "chapter" : "lecture",
        lectureId,
        chapterId,
      });
      setExpandedLectures((prev) =>
        prev.has(lectureId) ? new Set(prev) : new Set([...prev, lectureId])
      );
      return;
    }
    if (!isLoggedIn) {
      setToast({
        message: "Please login to access course content",
        type: "error",
      });
      return;
    }
    if (!isEnrolled && bookingInfo && bookingInfo.price > 0) {
      setToast({
        message:
          "Your enrollment is pending verification. Please complete payment and send the screenshot via WhatsApp.",
        type: "error",
      });
      return;
    }
    setToast({
      message: "Please enroll in the course to access content",
      type: "error",
    });
    return;
  };

  const onLectureHeaderClick = (lectureId) => {
    const isOpen = expandedLectures.has(lectureId);
    if (isOpen) {
      setExpandedLectures((prev) => {
        const next = new Set(prev);
        next.delete(lectureId);
        return next;
      });
      if (selectedContent.lectureId === lectureId) {
        setSelectedContent({
          type: "lecture",
          lectureId: null,
          chapterId: null,
        });
      }
      return;
    }
    if (!isEnrolled) {
      if (!isLoggedIn) {
        setToast({ message: "Please login to view chapters", type: "error" });
      } else if (
        bookingInfo &&
        bookingInfo.price > 0 &&
        (bookingInfo.paymentStatus === "Unpaid" ||
          bookingInfo.paymentStatus === "Pending Verification") 
      ) {
        setToast({
          message: "Payment pending verification. Complete payment to view chapters.",
          type: "error",
        });
      } else {
        setToast({ message: "Please enroll to view chapters", type: "error" });
      }
      return;
    }
    setExpandedLectures((prev) => new Set([...prev, lectureId]));
    handleContentSelect(lectureId, null);
  };

  const toggleChapterCompletion = (chapterId, e) => {
    if (e) e.stopPropagation();
    if (!isLoggedIn || !isEnrolled) {
      setToast({
        message: "Please enroll and login to track progress",
        type: "error",
      });
      return;
    }
    setCompletedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      setToast({ message: "Please login to enroll", type: "error" });
      return;
    }
    if (!course || isEnrolling) return;

    if (isEnrolled) {
      navigate("/mycourses");
      return;
    }
    
    if (bookingInfo && bookingInfo.paymentStatus === "Pending Verification") {
         setShowInvoiceModal(true);
         return;
    }

    setIsEnrolling(true);
    try {
      const numericPrice =
        salePrice != null
          ? salePrice
          : originalPrice != null
          ? originalPrice
          : 0;
      const token = await getToken();

      const payload = {
        courseId: course._id ?? course.id ?? courseId,
        courseName: course.name,
        teacherName: course.teacher || "",
        price: numericPrice,
        studentName: studentNameFromUser,
        email: studentEmailFromUser,
      };

      const res = await fetch(`${API_BASE}/api/booking/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({ success: false }));

      if (!res.ok) {
        if (data.alreadyBooked) {
          setIsEnrolled(
            course.pricingType === "free" ||
              data.booking?.paymentStatus === "Paid"
          );
          setBookingInfo(data.booking);
          
          if (data.booking?.paymentStatus === "Pending Verification") {
             setInvoiceData({
                 invoiceNumber: data.booking.invoiceNumber,
                 courseName: data.booking.courseName,
                 price: data.booking.price,
                 studentName: data.booking.studentName
             });
             setShowInvoiceModal(true);
          } else {
             setToast({
               message: "Redirecting to your course content...",
               type: "info",
             });
          }
          return;
        }
        throw new Error(data.message || "Enrollment failed");
      }

      if (data.success) {
        if (course.pricingType === "free") {
          setIsEnrolled(true);
          setToast({ message: "Successfully enrolled!", type: "info" });
        } else if (data.data && data.data.invoiceNumber) {
          setInvoiceData(data.data);
          setShowInvoiceModal(true);
          setBookingInfo({ paymentStatus: "Pending Verification", ...data.data });
        }
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleBackToHome = () => navigate("/");

  // --- INVOICE MODAL WITH DUAL QR CODES & WIDER SPACING ---
  const InvoiceModal = () => {
    if (!showInvoiceModal || !invoiceData) return null;

    // UPDATE THESE PATHS LATER
    const qrCodeEsewa = "../public/esewa.jpeg"; 
    const qrCodeKhalti = "../public/khalti.jpeg"; 
    const yourWhatsAppNumber = "+977-9818062229"; 

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
          <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Receipt className="w-6 h-6" /> Payment Invoice
            </h2>
            <button onClick={() => setShowInvoiceModal(false)} className="text-indigo-200 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="bg-indigo-50 rounded-xl p-4 mb-6 border border-indigo-100">
               <p className="text-sm text-indigo-800 font-medium mb-1">Invoice Number</p>
               <p className="text-2xl font-mono font-bold text-indigo-900 tracking-wider bg-white px-3 py-2 rounded shadow-inner inline-block">
                 {invoiceData.invoiceNumber}
               </p>
            </div>

            <div className="space-y-3 mb-6 text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Course:</span>
                <span className="font-medium text-right max-w-[60%]">{invoiceData.courseName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Student:</span>
                <span className="font-medium">{invoiceData.studentName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{studentEmailFromUser}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-gray-800 font-bold">Total Fee:</span>
                <span className="font-bold text-lg text-indigo-600">{formatCurrency(invoiceData.price)}</span>
              </div>
            </div>

            {/* --- UPDATED: WIDER SPACING (gap-10 sm:gap-12) & "OR" DIVIDER --- */}
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mb-6">
              <p className="text-sm text-gray-600 font-medium mb-4 text-center">Scan to Pay via your preferred wallet</p>
              
              <div className="flex gap-8 sm:gap-12 w-full justify-center items-center">
                  
                  {/* eSewa QR */}
                  <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full shadow-sm">eSewa</span>
                      <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white shadow-md rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                          <img src={qrCodeEsewa} alt="eSewa QR" className="w-full h-full object-contain" 
                               onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                          <div className="hidden text-center p-2 text-[10px] text-gray-400">eSewa QR<br/>Missing</div>
                      </div>
                  </div>

                  {/* Visual Divider (OR) */}
                  <div className="text-gray-300 font-bold text-sm hidden sm:block">
                     OR
                  </div>

                  {/* Khalti / Fonepay QR */}
                  <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full shadow-sm">Khalti / IME Pay</span>
                      <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white shadow-md rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                          <img src={qrCodeKhalti} alt="Khalti QR" className="w-full h-full object-contain" 
                               onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                          <div className="hidden text-center p-2 text-[10px] text-gray-400">QR 2<br/>Missing</div>
                      </div>
                  </div>

              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-start">
                <div className="shrink-0">
                  <Target className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Payment Instructions</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      To unlock this course, please scan a QR code above & do the Payment. Then, send a message/WhatsApp to <strong>{yourWhatsAppNumber}</strong> with:
                      <br/><br/>
                      1. Your Invoice Number: <strong>{invoiceData.invoiceNumber}</strong><br/>
                      2. A <strong> screenshot </strong>of your payment confirmation.<br/>
                      3. Estimated time for Processing: <strong> 5-10 minutes.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
                onClick={() => setShowInvoiceModal(false)}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md"
            >
                I Understand, Close Invoice
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-6 text-center">Loading course...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  if (!course) {
    return (
      <div className={courseDetailStylesH.notFoundContainer}>
        <div className={courseDetailStylesH.notFoundPattern}>
          <div
            className={`${courseDetailStylesH.notFoundBlob} top-10 left-10 bg-purple-300`}
          />
          <div
            className={`${courseDetailStylesH.notFoundBlob} top-10 right-10 bg-yellow-300 ${animationDelaysH.delay2000}`}
          />
          <div
            className={`${courseDetailStylesH.notFoundBlob} bottom-10 left-20 bg-pink-300 ${animationDelaysH.delay400}`}
          ></div>
        </div>
        <div className={courseDetailStylesH.notFoundContent}>
          <h2 className={courseDetailStylesH.notFoundTitle}>
            Course not found
          </h2>
          <p className={courseDetailStylesH.notFoundText}>
            Go back to courses list
          </p>
          <button
            onClick={() => navigate("/courses")}
            className={courseDetailStylesH.notFoundButton}
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const bookingPendingPayment =
    bookingInfo &&
    bookingInfo.paymentStatus === "Pending Verification" &&
    (salePrice || originalPrice || bookingInfo.price) > 0;

  return (
    <div className={courseDetailStylesH.pageContainer}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <InvoiceModal />

      <div
        className={`${courseDetailStylesH.mainContainer} ${
          isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToHome}
            className={courseDetailStylesH.backButton}
          >
            <ArrowLeft className={courseDetailStylesH.backButtonIcon} />
            <span className={courseDetailStylesH.backButtonText}>
              Back to Home
            </span>
          </button>
          <div />
        </div>

        <div className={courseDetailStylesH.headerContainer}>
          <div className={courseDetailStylesH.courseBadge}>
            <BookOpen className={courseDetailStylesH.badgeIcon} />
            <span className={courseDetailStylesH.badgeText}>
              {courseIsFree ? "Free Course" : "Premium Course"}
            </span>
          </div>

          <h1 className={courseDetailStylesH.courseTitle}>{course.name}</h1>

          {course.overview && (
            <div className={courseDetailStylesH.overviewContainer}>
              <div className={courseDetailStylesH.overviewCard}>
                <div className={courseDetailStylesH.overviewHeader}>
                  <Target className={courseDetailStylesH.overviewIcon} />
                  <h3 className={courseDetailStylesH.overviewTitle}>
                    Course Overview
                  </h3>
                </div>
                <div 
                  className={courseDetailStyles.overviewText}
                  dangerouslySetInnerHTML={{ __html: course.overview }}
                />
              </div>
            </div>
          )}

          <div
            className={`${courseDetailStylesH.statsContainer} ${animationDelaysH.delay300}`}
          >
            <div className={courseDetailStylesH.statItem}>
              <Clock className={courseDetailStylesH.statIcon} />
              <span className={courseDetailStylesH.statText}>
                {fmtMinutes(totalMinutes)}
              </span>
            </div>
            <div className={courseDetailStylesH.statItem}>
              <BookOpen className={courseDetailStylesH.statIcon} />
              <span className={courseDetailStylesH.statText}>
                {(course.lectures || []).length} lectures
              </span>
            </div>

            <div
              className={`${courseDetailStylesH.teacherStat} ${
                isTeacherAnimating ? "scale-110 bg-indigo-100/50" : ""
              }`}
            >
              <User className={courseDetailStylesH.teacherIcon} />
              <span className={courseDetailStylesH.teacherText}>
                {course.teacher}
              </span>
            </div>
          </div>
        </div>

        <div className={courseDetailStylesH.mainGrid}>
          <div className={courseDetailStylesH.videoSection}>
            <div className={courseDetailStylesH.videoContainer}>
              <div className={courseDetailStylesH.videoWrapper}>
                {currentVideoContent?.videoUrl ? (
                  <iframe
                    title={
                      currentVideoContent.title || currentVideoContent.name
                    }
                    src={appendAutoplay(
                      toEmbedUrl(currentVideoContent.videoUrl),
                      isLoggedIn && isEnrolled
                    )}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={courseDetailStylesH.videoFrame}
                  />
                ) : (
                  <div className={courseDetailStylesH.videoPlaceholder}>
                    <div
                      className={courseDetailStylesH.videoPlaceholderPattern}
                    >
                      <div
                        className={`${courseDetailStylesH.videoPlaceholderBlob} top-1/4 left-1/4 bg-purple-500`}
                      />
                      <div
                        className={`${courseDetailStylesH.videoPlaceholderBlob} bottom-1/4 right-1/4 bg-blue-500`}
                      />
                    </div>
                    <div
                      className={courseDetailStylesH.videoPlaceholderContent}
                    >
                      <div className={courseDetailStylesH.videoPlaceholderIcon}>
                        <Play
                          className={
                            courseDetailStylesH.videoPlaceholderPlayIcon
                          }
                        />
                      </div>
                      <p className={courseDetailStylesH.videoPlaceholderText}>
                        Select a lecture or chapter to play video
                      </p>
                      {!isLoggedIn || !isEnrolled ? (
                        <p
                          className={
                            courseDetailStylesH.videoPlaceholderSubtext
                          }
                        >
                          {!isLoggedIn
                            ? "Login required"
                            : bookingPendingPayment
                            ? "Pending Verification" 
                            : "Enrollment required"}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              <div className={courseDetailStylesH.videoInfo}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={courseDetailStylesH.videoTitle}>
                      {currentVideoContent?.title ||
                        currentVideoContent?.name ||
                        "Select content to play"}
                    </h3>
                    <p className={courseDetailStylesH.videoDescription}>
                      {selectedContent.type === "chapter"
                        ? `Part of: ${selectedLecture?.title}`
                        : currentVideoContent?.description}
                    </p>
                    {currentVideoContent?.durationMin && (
                      <div className={courseDetailStylesH.videoMeta}>
                        <div className={courseDetailStylesH.durationBadge}>
                          <Clock className={courseDetailStylesH.durationIcon} />
                          <span>
                            {fmtMinutes(currentVideoContent.durationMin)}
                          </span>
                        </div>
                        {selectedContent.type === "chapter" && (
                          <span className={courseDetailStylesH.chapterBadge}>
                            Chapter
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isLoggedIn && isEnrolled && selectedContent.chapterId && (
                  <div className={courseDetailStylesH.completionSection}>
                    <button
                      onClick={() =>
                        toggleChapterCompletion(selectedContent.chapterId)
                      }
                      className={`${courseDetailStylesH.completionButton} ${
                        completedChapters.has(selectedContent.chapterId)
                          ? courseDetailStylesH.completionButtonCompleted
                          : courseDetailStylesH.completionButtonIncomplete
                      }`}
                    >
                      {completedChapters.has(selectedContent.chapterId) ? (
                        <>
                          <CheckCircle
                            className={courseDetailStylesH.completionIcon}
                          />
                          Chapter Completed
                        </>
                      ) : (
                        <>
                          <Circle
                            className={courseDetailStylesH.completionIcon}
                          />
                          Mark as Complete
                        </>
                      )}
                    </button>
                    <p className={courseDetailStylesH.completionText}>
                      {completedChapters.has(selectedContent.chapterId)
                        ? "Great job! You've completed this chapter."
                        : "Click to mark this chapter as completed."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className={courseDetailStylesH.sidebar}>
            <div
              className={`${courseDetailStylesH.sidebarCard} ${animationDelaysH.delay200}`}
            >
              <div className={courseDetailStylesH.contentHeader}>
                <h4 className={courseDetailStylesH.contentTitle}>
                  Course Content
                </h4>
                {courseIsFree && (
                  <div className={courseDetailStylesH.freeAccessBadge}>
                    <Sparkles className={courseDetailStylesH.freeAccessIcon} />
                    Free Access
                  </div>
                )}
              </div>

              <div className={courseDetailStylesH.contentList}>
                {(course.lectures || []).map((lecture, index) => (
                  <div
                    key={lecture.id ?? lecture._id ?? index}
                    className={courseDetailStylesH.lectureItem}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`${courseDetailStylesH.lectureHeader} ${
                        expandedLectures.has(lecture.id ?? lecture._id)
                          ? courseDetailStylesH.lectureHeaderExpanded
                          : courseDetailStylesH.lectureHeaderNormal
                      }`}
                      onClick={() =>
                        onLectureHeaderClick(lecture.id ?? lecture._id)
                      }
                    >
                      <div className={courseDetailStylesH.lectureContent}>
                        <div className={courseDetailStylesH.lectureLeft}>
                          <div
                            className={`${courseDetailStylesH.lectureChevron} ${
                              expandedLectures.has(lecture.id ?? lecture._id)
                                ? courseDetailStylesH.lectureChevronExpanded
                                : courseDetailStylesH.lectureChevronNormal
                            }`}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </div>
                          <div className={courseDetailStylesH.lectureInfo}>
                            <div className={courseDetailStylesH.lectureTitle}>
                              {lecture.title}
                            </div>
                            <div className={courseDetailStylesH.lectureMeta}>
                              <div
                                className={courseDetailStylesH.lectureDuration}
                              >
                                <Clock
                                  className={
                                    courseDetailStylesH.lectureDurationIcon
                                  }
                                />
                                {fmtMinutes(lecture.durationMin)}
                              </div>
                              <span
                                className={
                                  courseDetailStylesH.lectureChaptersCount
                                }
                              >
                                {lecture.chapters?.length || 0} chapters
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedLectures.has(lecture.id ?? lecture._id) && (
                      <div className={courseDetailStylesH.chaptersList}>
                        {(lecture.chapters || []).map((chapter) => {
                          const chapId = chapter.id ?? chapter._id;
                          const isCompleted = completedChapters.has(chapId);
                          const isSelected =
                            String(selectedContent.chapterId) ===
                              String(chapId) &&
                            String(selectedContent.lectureId) ===
                              String(lecture.id ?? lecture._id);
                          return (
                            <div
                              key={chapId}
                              className={`${courseDetailStylesH.chapterItem} ${
                                isSelected
                                  ? courseDetailStylesH.chapterItemSelected
                                  : courseDetailStylesH.chapterItemNormal
                              }`}
                              onClick={() =>
                                handleContentSelect(
                                  lecture.id ?? lecture._id,
                                  chapId
                                )
                              }
                            >
                              <div
                                className={courseDetailStylesH.chapterContent}
                              >
                                <div
                                  className={courseDetailStylesH.chapterLeft}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleChapterCompletion(chapId, e);
                                    }}
                                    className={`${
                                      courseDetailStylesH.chapterCompletionButton
                                    } ${
                                      isCompleted
                                        ? courseDetailStylesH.chapterCompletionCompleted
                                        : courseDetailStylesH.chapterCompletionNormal
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle className="w-5 h-5" />
                                    ) : (
                                      <Circle className="w-5 h-5" />
                                    )}
                                  </button>
                                  <div
                                    className={courseDetailStylesH.chapterInfo}
                                  >
                                    <div
                                      className={`${
                                        courseDetailStylesH.chapterName
                                      } ${
                                        isSelected
                                          ? courseDetailStylesH.chapterNameSelected
                                          : courseDetailStylesH.chapterNameNormal
                                      }`}
                                    >
                                      {chapter.name}
                                    </div>
                                    <div
                                      className={
                                        courseDetailStylesH.chapterTopic
                                      }
                                    >
                                      {chapter.topic}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span
                                    className={
                                      courseDetailStylesH.chapterDuration
                                    }
                                  >
                                    {fmtMinutes(chapter.durationMin)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`${courseDetailStylesH.sidebarCard} ${animationDelaysH.delay200}`}
            >
              <div className={courseDetailStylesH.pricingHeader}>
                <h5 className={courseDetailStylesH.pricingTitle}>Pricing</h5>
              </div>
              <div className={courseDetailStylesH.pricingAmount}>
                <div className={courseDetailStylesH.pricingCurrent}>
                  {salePrice != null
                    ? formatCurrency(salePrice)
                    : originalPrice != null
                    ? formatCurrency(originalPrice)
                    : "Free"}
                </div>
                {hasDiscount && (
                  <div className={courseDetailStylesH.pricingOriginal}>
                    {formatCurrency(originalPrice)}
                  </div>
                )}
                {hasDiscount && (
                  <div className={courseDetailStylesH.pricingDiscount}>
                    {Math.round(
                      ((originalPrice - salePrice) / originalPrice) * 100
                    )}
                    % off
                  </div>
                )}
              </div>
              <p className={courseDetailStylesH.pricingDescription}>
                {courseIsFree
                  ? "Free access · Learn anytime (enroll to unlock)"
                  : "One-time payment · Lifetime access · 30-day guarantee"}
              </p>

              <div className="mt-6">
                {!isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className={courseDetailStylesH.enrollButton}
                  >
                    {isEnrolling ? (
                      <>
                        <div className={courseDetailStylesH.enrollSpinner} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className={courseDetailStylesH.enrollButtonIcon} />
                        {bookingPendingPayment ? "View Invoice" : (courseIsFree ? "Enroll (Free)" : "Enroll Now")}
                        <span className="ml-auto opacity-80 group-hover:opacity-100">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/mycourses")}
                    className={courseDetailStylesH.enrollButton}
                  >
                    <CheckCircle className={courseDetailStylesH.enrollButtonIcon} />
                    Go to Course
                    <span className="ml-auto opacity-80 group-hover:opacity-100">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div
              className={`${courseDetailStylesH.sidebarCard} ${animationDelaysH.delay400}`}
            >
              <div className={courseDetailStylesH.progressHeader}>
                <Award className={courseDetailStylesH.progressIcon} />
                <h5 className={courseDetailStylesH.progressTitle}>
                  Your Progress
                </h5>
              </div>
              <div className={courseDetailStylesH.progressSection}>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Course Completion</span>
                    <span className="font-semibold text-indigo-600">
                      {Math.round(
                        (completedChapters.size /
                          (course.lectures?.flatMap((l) => l.chapters || [])
                            .length || 1)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className={courseDetailStylesH.progressBarContainer}>
                    <div
                      className={courseDetailStylesH.progressBar}
                      style={{
                        width: `${
                          (completedChapters.size /
                            (course.lectures?.flatMap((l) => l.chapters || [])
                              .length || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div className={courseDetailStylesH.progressStats}>
                  <div className={courseDetailStylesH.progressStat}>
                    <div className={courseDetailStylesH.progressStatValue}>
                      {fmtMinutes(totalMinutes)}
                    </div>
                    <div className={courseDetailStylesH.progressStatLabel}>
                      Total Duration
                    </div>
                  </div>
                  <div className={courseDetailStylesH.progressStat}>
                    <div className={courseDetailStylesH.progressStatValue}>
                      {completedChapters.size}
                    </div>
                    <div className={courseDetailStylesH.progressStatLabel}>
                      Completed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{courseDetailCustomStyles}</style>
    </div>
  );
};

export default CourseDetail;