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
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useUser, useAuth } from "@clerk/react";
import { courseDetailStyles } from "../assets/dummyStyles";

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
      className={`${courseDetailStyles.toast} ${
        type === "error"
          ? courseDetailStyles.toastError
          : courseDetailStyles.toastInfo
      }`}
    >
      <div className={courseDetailStyles.toastContent}>
        <span>{message}</span>
        <button onClick={onClose} className={courseDetailStyles.toastClose}>
          <X className={courseDetailStyles.toastCloseIcon} />
        </button>
      </div>
    </div>
  );
};

/* helpers */
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
    if (/drive\.google\.com/.test(trimmed)) {
      const fileMatch = trimmed.match(/\/file\/d\/([^/]+)(?:\/|$)/);
      if (fileMatch && fileMatch[1])
        return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
      const idMatch = trimmed.match(/[?&]id=([^&#]+)/);
      if (idMatch && idMatch[1])
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      return trimmed;
    }
    const lastSeg = trimmed.split("/").filter(Boolean).pop();
    if (lastSeg && lastSeg.length === 11 && /^[a-zA-Z0-9_-]+$/.test(lastSeg)) {
      return `https://www.youtube.com/embed/${lastSeg}`;
    }
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

const isDirectVideoFile = (url) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
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

const CourseDetailPage = () => {
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
  const [bookingInfo, setBookingInfo] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

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

        setIsEnrolled(false);
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

  // CORRECTION 1: Robust Enrollment check when user lands on page
  useEffect(() => {
    let mounted = true;
    if (!course || !isLoggedIn) return;

    const checkEnrollment = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/api/booking/check?courseId=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (!mounted) return;

        if (data.success && data.enrolled) {
          setBookingInfo(data.booking);
          // If free or already paid, mark as enrolled to switch button to "Go to Course"
          if (course.pricingType === "free" || data.booking.paymentStatus === "Paid") {
            setIsEnrolled(true);
          }
        }
      } catch (err) {
        console.debug("Enrollment check failed:", err);
      }
    };

    checkEnrollment();
    return () => (mounted = false);
  }, [course, getToken, id, isLoggedIn]);

  useEffect(() => {
    setIsTeacherAnimating(true);
    const timer = setTimeout(() => setIsTeacherAnimating(false), 800);
    return () => clearTimeout(timer);
  }, [course]);

  useEffect(() => setIsPageLoaded(true), []);

  const [selectedContent, setSelectedContent] = useState({
    type: null,
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
  const courseIsFree = course
    ? !!course.isFree ||
      !course.price ||
      (!course.price.sale && !course.price.original) ||
      course.pricingType === "free"
    : true;
  const hasDiscount =
    originalPrice != null && salePrice != null && originalPrice > salePrice;

  const bookingPendingPayment =
    bookingInfo &&
    ((bookingInfo.paymentStatus &&
      /unpaid/i.test(String(bookingInfo.paymentStatus))) ||
      (bookingInfo.orderStatus &&
        /pending/i.test(String(bookingInfo.orderStatus)))) &&
    (salePrice || originalPrice || bookingInfo.price);

  // handlers
  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => {
      const next = new Set(prev);
      if (next.has(lectureId)) next.delete(lectureId);
      else next.add(lectureId);
      return next;
    });
  };

  const onLectureHeaderClick = (lectureId) => {
    if (!isLoggedIn) {
      setToast({
        message: "Please login to access course content",
        type: "error",
      });
      return;
    }
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
      if (bookingPendingPayment) {
        setToast({
          message: "Payment pending — complete payment to view chapters",
          type: "error",
        });
      } else {
        setToast({
          message: "Please enroll in the course to view chapters",
          type: "error",
        });
      }
      return;
    }

    setExpandedLectures((prev) => new Set([...prev, lectureId]));
    handleContentSelect(lectureId, null);
  };

  const handleContentSelect = (lectureId, chapterId = null) => {
    if (!isLoggedIn) {
      setToast({
        message: "Please login to access course content",
        type: "error",
      });
      return;
    }

    if (isEnrolled) {
      setSelectedContent({
        type: chapterId ? "chapter" : "lecture",
        lectureId,
        chapterId,
      });
      setExpandedLectures((prev) => {
        const next = new Set(prev);
        next.add(lectureId);
        return next;
      });
      return;
    }

    if (!isEnrolled) {
      if (bookingPendingPayment) {
        setToast({
          message:
            "You have a pending payment — complete it to access the course.",
          type: "error",
        });
        return;
      }
      setToast({
        message: "Please enroll in the course to access this content",
        type: "error",
      });
    }
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

  // CORRECTION 2: Optimized handleEnroll to catch "already booked" flag
  const handleEnroll = async () => {
    if (!isLoggedIn) {
      setToast({ message: "Please login to enroll", type: "error" });
      return;
    }
    if (!course || isEnrolling) return;

    setIsEnrolling(true);
    try {
      const token = await getToken();
      const payload = {
        courseId: id,
        courseName: course.name,
        teacherName: course.teacher || "",
        price: course.pricingType === "free" ? 0 : (course.price?.sale || 0),
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

      const data = await res.json();

      if (!res.ok) {
        // If already booked, update local state instead of failing
        if (data.alreadyBooked) {
          setIsEnrolled(course.pricingType === "free" || data.booking?.paymentStatus === "Paid");
          setBookingInfo(data.booking);
          setToast({ message: "Redirecting to your course content...", type: "info" });
          return;
        }
        throw new Error(data.message || "Enrollment failed");
      }

      if (data.success) {
        if (course.pricingType === "free") {
          setIsEnrolled(true);
          setToast({ message: "Successfully enrolled!", type: "info" });
        } else if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleBackToHome = () => navigate("/");

  if (loading) return <div className="p-6 text-center">Loading course...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!course) {
    return (
      <div className={courseDetailStyles.notFoundContainer}>
        <div className={courseDetailStyles.notFoundContent}>
          <h2 className={courseDetailStyles.notFoundTitle}>Course not found</h2>
          <p className={courseDetailStyles.notFoundText}>
            Go back to courses list
          </p>
          <button
            onClick={() => navigate("/courses")}
            className={courseDetailStyles.notFoundButton}
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const currentRawUrl = currentVideoContent?.videoUrl || null;
  const currentEmbedUrl = currentRawUrl ? toEmbedUrl(currentRawUrl) : null;
  const currentIsDirectVideo = isDirectVideoFile(currentEmbedUrl);

  return (
    <div className={courseDetailStyles.container}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div
        className={`${courseDetailStyles.mainContainer} ${
          isPageLoaded
            ? courseDetailStyles.containerVisible
            : courseDetailStyles.containerHidden
        }`}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/courses")}
            className={courseDetailStyles.backButton}
          >
            <ArrowLeft className={courseDetailStyles.backIcon} />
            <span className={courseDetailStyles.backText}>Back to Home</span>
          </button>
        </div>

        <div className={courseDetailStyles.header}>
          <div className={courseDetailStyles.badge}>
            <BookOpen className={courseDetailStyles.badgeIcon} />
            <span className={courseDetailStyles.badgeText}>
              {courseIsFree ? "Free Course" : "Premium Course"}
            </span>
          </div>

          <h1 className={courseDetailStyles.title}>{course.name}</h1>

          {course.overview && (
            <div className={courseDetailStyles.overviewContainer}>
              <div className={courseDetailStyles.overview}>
                <div className={courseDetailStyles.overviewHeader}>
                  <Target className={courseDetailStyles.overviewIcon} />
                  <h3 className={courseDetailStyles.overviewTitle}>
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
            className={`${courseDetailStyles.statsContainer} animation-delay-300`}
          >
            <div className={courseDetailStyles.statItem}>
              <Clock className={courseDetailStyles.statIcon} />
              <span className={courseDetailStyles.statText}>
                {fmtMinutes(totalMinutes)}
              </span>
            </div>
            <div className={courseDetailStyles.statItem}>
              <BookOpen className={courseDetailStyles.statIcon} />
              <span className={courseDetailStyles.statText}>
                {(course.lectures || []).length} lectures
              </span>
            </div>

            <div
              className={`${courseDetailStyles.teacherStat} ${
                isTeacherAnimating ? courseDetailStyles.teacherAnimating : ""
              }`}
            >
              <User className={courseDetailStyles.statIcon} />
              <span className={courseDetailStyles.statText}>
                {course.teacher}
              </span>
            </div>
          </div>
        </div>

        <div className={courseDetailStyles.mainGrid}>
          <div className={courseDetailStyles.videoSection}>
            <div className={courseDetailStyles.videoContainer}>
              {currentEmbedUrl ? (
                currentIsDirectVideo ? (
                  <video
                    controls
                    src={currentEmbedUrl}
                    className={courseDetailStyles.video}
                  />
                ) : (
                  <iframe
                    title={
                      currentVideoContent?.title ||
                      currentVideoContent?.name ||
                      "video-player"
                    }
                    src={appendAutoplay(
                      currentEmbedUrl,
                      isLoggedIn && isEnrolled
                    )}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className={courseDetailStyles.iframe}
                  />
                )
              ) : (
                <div className={courseDetailStyles.videoPlaceholder}>
                  <div className={courseDetailStyles.videoPlaceholderBg}>
                    <div
                      className={courseDetailStyles.videoPlaceholderOrb1}
                    ></div>
                    <div
                      className={courseDetailStyles.videoPlaceholderOrb2}
                    ></div>
                  </div>
                  <div className={courseDetailStyles.videoPlaceholderContent}>
                    <div className={courseDetailStyles.videoPlaceholderIcon}>
                      <Play
                        className={courseDetailStyles.videoPlaceholderPlayIcon}
                      />
                    </div>
                    <p className={courseDetailStyles.videoPlaceholderText}>
                      Select a lecture or chapter to play video
                    </p>
                    {(!isLoggedIn || !isEnrolled) && (
                      <p className={courseDetailStyles.videoPlaceholderSubtext}>
                        {!isLoggedIn
                          ? "Login required"
                          : bookingPendingPayment
                          ? "Payment pending"
                          : "Enrollment required"}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className={courseDetailStyles.videoInfo}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={courseDetailStyles.videoTitle}>
                      {currentVideoContent?.title ||
                        currentVideoContent?.name ||
                        "Select content to play"}
                    </h3>
                    <p className={courseDetailStyles.videoDescription}>
                      {selectedContent.type === "chapter"
                        ? `Part of: ${selectedLecture?.title}`
                        : currentVideoContent?.description}
                    </p>
                    {currentVideoContent?.durationMin && (
                      <div className={courseDetailStyles.videoMeta}>
                        <div className={courseDetailStyles.durationBadge}>
                          <Clock className={courseDetailStyles.durationIcon} />
                          <span>
                            {fmtMinutes(currentVideoContent.durationMin)}
                          </span>
                        </div>
                        {selectedContent.type === "chapter" && (
                          <span className={courseDetailStyles.chapterBadge}>
                            Chapter
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isLoggedIn && isEnrolled && selectedContent.chapterId && (
                  <div className={courseDetailStyles.completionSection}>
                    <button
                      onClick={() =>
                        toggleChapterCompletion(selectedContent.chapterId)
                      }
                      className={`${courseDetailStyles.completionButton} ${
                        completedChapters.has(selectedContent.chapterId)
                          ? courseDetailStyles.completionButtonCompleted
                          : courseDetailStyles.completionButtonIncomplete
                      }`}
                    >
                      {completedChapters.has(selectedContent.chapterId) ? (
                        <>
                          <CheckCircle
                            className={courseDetailStyles.completionIcon}
                          />
                          Chapter Completed
                        </>
                      ) : (
                        <>
                          <Circle
                            className={courseDetailStyles.completionIcon}
                          />
                          Mark as Complete
                        </>
                      )}
                    </button>
                    <p className={courseDetailStyles.completionText}>
                      {completedChapters.has(selectedContent.chapterId)
                        ? "Great job! You've completed this chapter."
                        : "Click to mark this chapter as completed."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className={courseDetailStyles.sidebar}>
            <div className={courseDetailStyles.contentCard}>
              <div className={courseDetailStyles.contentHeader}>
                <h4 className={courseDetailStyles.contentTitle}>
                  Course Content
                </h4>
                {courseIsFree && (
                  <div className={courseDetailStyles.freeBadge}>
                    <Sparkles className={courseDetailStyles.freeBadgeIcon} />
                    Free Access
                  </div>
                )}
              </div>

              <div className={courseDetailStyles.contentList}>
                {(course.lectures || []).map((lecture, index) => (
                  <div
                    key={lecture.id ?? lecture._id ?? index}
                    className={courseDetailStyles.lectureItem}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`${courseDetailStyles.lectureHeader} ${
                        expandedLectures.has(lecture.id ?? lecture._id)
                          ? courseDetailStyles.lectureHeaderExpanded
                          : courseDetailStyles.lectureHeaderCollapsed
                      }`}
                      onClick={() =>
                        onLectureHeaderClick(lecture.id ?? lecture._id)
                      }
                    >
                      <div className={courseDetailStyles.lectureHeaderContent}>
                        <div className={courseDetailStyles.lectureLeftSection}>
                          <div
                            className={`${courseDetailStyles.lectureChevron} ${
                              expandedLectures.has(lecture.id ?? lecture._id)
                                ? courseDetailStyles.lectureChevronExpanded
                                : courseDetailStyles.lectureChevronCollapsed
                            }`}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </div>
                          <div className={courseDetailStyles.lectureInfo}>
                            <div className={courseDetailStyles.lectureTitle}>
                              {lecture.title}
                            </div>
                            <div className={courseDetailStyles.lectureMeta}>
                              <div
                                className={courseDetailStyles.lectureDuration}
                              >
                                <Clock className="w-4 h-4" />
                                {fmtMinutes(lecture.durationMin)}
                              </div>
                              <span
                                className={
                                  courseDetailStyles.lectureChapterCount
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
                      <div className={courseDetailStyles.chapterList}>
                        {(lecture.chapters || []).map((chapter) => {
                          const chapId = chapter.id ?? chapter._id;
                          const isCompleted = completedChapters.has(chapId);
                          const isSelected =
                            selectedContent.chapterId === chapId &&
                            selectedContent.lectureId ===
                              (lecture.id ?? lecture._id);
                          return (
                            <div
                              key={chapId}
                              className={`${courseDetailStyles.chapterItem} ${
                                isSelected
                                  ? courseDetailStyles.chapterSelected
                                  : courseDetailStyles.chapterNotSelected
                              } ${
                                !isEnrolled
                                  ? courseDetailStyles.chapterDisabled
                                  : ""
                              }`}
                              onClick={() =>
                                handleContentSelect(
                                  lecture.id ?? lecture._id,
                                  chapId
                                )
                              }
                            >
                              <div
                                className={courseDetailStyles.chapterContent}
                              >
                                <div
                                  className={
                                    courseDetailStyles.chapterLeftSection
                                  }
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isEnrolled)
                                        toggleChapterCompletion(chapId, e);
                                    }}
                                    className={`${
                                      courseDetailStyles.completionToggle
                                    } ${
                                      isCompleted
                                        ? courseDetailStyles.completionToggleCompleted
                                        : courseDetailStyles.completionToggleIncomplete
                                    }`}
                                    disabled={!isEnrolled}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle
                                        className={
                                          courseDetailStyles.completionIconSmall
                                        }
                                      />
                                    ) : (
                                      <Circle
                                        className={
                                          courseDetailStyles.completionIconSmall
                                        }
                                      />
                                    )}
                                  </button>
                                  <div
                                    className={courseDetailStyles.chapterText}
                                  >
                                    <div
                                      className={`${
                                        courseDetailStyles.chapterName
                                      } ${
                                        isSelected
                                          ? courseDetailStyles.chapterNameSelected
                                          : courseDetailStyles.chapterNameNotSelected
                                      }`}
                                    >
                                      {chapter.name}
                                    </div>
                                    <div
                                      className={
                                        courseDetailStyles.chapterTopic
                                      }
                                    >
                                      {chapter.topic}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span
                                    className={
                                      courseDetailStyles.chapterDuration
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
              className={`${courseDetailStyles.pricingCard} animation-delay-200`}
            >
              <div className={courseDetailStyles.pricingHeader}>
                <h5 className={courseDetailStyles.pricingTitle}>Pricing</h5>
              </div>

              <div className={courseDetailStyles.pricingAmount}>
                <div className={courseDetailStyles.price}>
                  {courseIsFree
                    ? "Free"
                    : salePrice != null
                    ? formatCurrency(salePrice)
                    : originalPrice != null
                    ? formatCurrency(originalPrice)
                    : "Free"}
                </div>

                {!courseIsFree && hasDiscount && (
                  <div className={courseDetailStyles.originalPrice}>
                    {formatCurrency(originalPrice)}
                  </div>
                )}
                {!courseIsFree && hasDiscount && (
                  <div className={courseDetailStyles.discountBadge}>
                    {Math.round(
                      ((originalPrice - salePrice) / originalPrice) * 100
                    )}
                    % off
                  </div>
                )}
              </div>

              <p className={courseDetailStyles.pricingDescription}>
                {courseIsFree
                  ? "Free access · Learn anytime"
                  : "One-time payment · Lifetime access "}
              </p>

              {/* CORRECTION 3: Smart Button UI */}
              <div className="mt-6">
                {!isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className={`${courseDetailStyles.enrollButton} ${courseDetailStyles.enrollPaidButton}`}
                  >
                    {isEnrolling ? (
                      <>
                        <div className={courseDetailStyles.enrollSpinner}></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className={courseDetailStyles.enrollIcon} />
                        {bookingPendingPayment ? "Complete Payment" : (courseIsFree ? "Enroll (Free)" : "Enroll Now")}
                        <span>
                          <ArrowRight className={courseDetailStyles.enrollArrow} />
                        </span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/mycourses")}
                    className={`${courseDetailStyles.enrollButton} ${courseDetailStyles.enrolledButton}`}
                  >
                    <CheckCircle className={courseDetailStyles.enrollIcon} />
                    Go to Course
                    <span>
                      <ArrowRight className={courseDetailStyles.enrollArrow} />
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div
              className={`${courseDetailStyles.progressCard} animation-delay-400`}
            >
              <div className={courseDetailStyles.progressHeader}>
                <Award className={courseDetailStyles.progressIcon} />
                <h5 className={courseDetailStyles.progressTitle}>
                  Your Progress
                </h5>
              </div>
              <div className={courseDetailStyles.progressContent}>
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
                  <div className={courseDetailStyles.progressBar}>
                    <div
                      className={courseDetailStyles.progressFill}
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
                <div className={courseDetailStyles.progressStats}>
                  <div className={courseDetailStyles.progressStat}>
                    <div className={courseDetailStyles.progressStatValue}>
                      {fmtMinutes(totalMinutes)}
                    </div>
                    <div className={courseDetailStyles.progressStatLabel}>
                      Total Duration
                    </div>
                  </div>
                  <div className={courseDetailStyles.progressStat}>
                    <div className={courseDetailStyles.progressStatValue}>
                      {completedChapters.size}
                    </div>
                    <div className={courseDetailStyles.progressStatLabel}>
                      Completed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{courseDetailStyles.animations}</style>
    </div>
  );
};

export default CourseDetailPage;

// it is similar to CourseDetailPageHome.jsx component