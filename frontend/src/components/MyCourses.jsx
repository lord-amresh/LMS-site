import React, { useEffect } from "react";
import { myCoursesStyles, myCoursesCustomStyles } from "../assets/dummyStyles";

import { useUser, useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { Play, Star, User } from "lucide-react";

const API_BASE = "https://lms-site-8cyh.onrender.com";

const MyCourses = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userRatings, setUserRatings] = useState(() => {
    try {
      const raw = localStorage.getItem("userCourseRatings");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [hoverRatings, setHoverRatings] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem("userCourseRatings", JSON.stringify(userRatings));
    } catch {}
  }, [userRatings]);

  // fetch
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchMyCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!isSignedIn) {
          if (mounted) {
            setCourses([]);
            setLoading(false);
          }
          return;
        }

        // CORRECTED: Strictly await the token without silently catching to null
        const token = await getToken();
        if (!token) throw new Error("Authentication token missing. Please refresh.");

        // CORRECTED: Always attach the token 
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        };

        const bookingsRes = await fetch(`${API_BASE}/api/booking/my`, {
          method: "GET",
          // CORRECTED: Removed credentials: "include" to prevent CORS header stripping
          signal: controller.signal,
          headers,
        });

        if (bookingsRes.status === 401) {
          throw new Error(
            "Unauthorized — please sign in to view your bookings."
          );
        }

        if (!bookingsRes.ok) {
          const text = await bookingsRes.text().catch(() => "");
          throw new Error(
            text || `Failed to fetch bookings (${bookingsRes.status})`
          );
        }

        const bookingsJson = await bookingsRes.json();
        if (!bookingsJson || bookingsJson.success === false) {
          throw new Error(
            (bookingsJson && bookingsJson.message) || "Failed to load bookings"
          );
        }
        const bookings = bookingsJson.bookings || [];

        // fetch courses for each booking
        const combined = await Promise.all(
          bookings.map(async (b) => {
            const courseId = b.course ?? b.courseId ?? null;
            if (!courseId) return null;

            try {
              const courseRes = await fetch(
                `${API_BASE}/api/course/${courseId}`,
                {
                  method: "GET",
                  // CORRECTED: Removed credentials: "include"
                  signal: controller.signal,
                  headers, 
                }
              );

              if (!courseRes.ok) {
                console.warn(
                  `Course ${courseId} not available (status ${courseRes.status}). Skipping booking.`
                );
                return null;
              }

              const courseJson = await courseRes.json().catch(() => null);
              if (!courseJson || !courseJson.success || !courseJson.course) {
                console.warn(
                  `Course ${courseId} response invalid; skipping booking.`
                );
                return null;
              }

              const courseData = courseJson.course;

              return {
                booking: b,
                course: {
                  ...courseData,
                  image: courseData.image || null,
                  avgRating:
                    typeof courseData.avgRating !== "undefined"
                      ? courseData.avgRating
                      : courseData.rating ?? 0,
                  totalRatings:
                    typeof courseData.totalRatings !== "undefined"
                      ? courseData.totalRatings
                      : courseData.ratingCount ?? 0,
                },
              };
            } catch (err) {
              if (controller.signal.aborted) return null;
              console.warn("Course fetch error for", courseId, err);
              return null;
            }
          })
        );

        if (!mounted) return;
        const valid = combined.filter(Boolean);
        const uiCourses = valid.map(({ booking, course }) => ({
          booking,
          id: course._id ?? course.id ?? booking.course ?? booking.courseId,
          name: course.name ?? booking.courseName ?? "Untitled Course",
          teacher: course.teacher ?? booking.teacherName ?? "",
          image: course.image ?? null,
          avgRating: course.avgRating ?? 0,
          totalRatings: course.totalRatings ?? 0,
          isFree: !!(
            course.pricingType === "free" ||
            !course.price ||
            (course.price.sale == null && course.price.original == null) ||
            (course.price &&
              (course.price.sale === 0 || course.price.original === 0))
          ),
          price: course.price ?? {
            original: booking.price ?? 0,
            sale: booking.price ?? 0,
          },
          overview: course.overview ?? "",
          lectures: course.lectures ?? [],
          rawCourse: course,
          rawBooking: booking,
        }));
        setCourses(uiCourses);

        // fetch user's per-course rating
        if (isSignedIn && uiCourses.length > 0) {
          const ratingPromises = uiCourses.map(async (c) => {
            if (!c.id) return null;
            try {
              const res = await fetch(
                `${API_BASE}/api/course/${c.id}/my-rating`,
                {
                  method: "GET",
                  headers,
                  // CORRECTED: Removed credentials: "include"
                }
              );
              const data = await res.json().catch(() => null);
              if (res.ok && data && data.success && data.myRating) {
                return { courseId: c.id, myRating: data.myRating.rating };
              }
            } catch (err) {}
            return null;
          });

          const results = await Promise.all(ratingPromises);
          const ratingsMap = {};
          results.forEach((r) => {
            if (r && r.courseId) ratingsMap[r.courseId] = r.myRating;
          });
          if (mounted && Object.keys(ratingsMap).length) {
            setUserRatings((prev) => ({ ...prev, ...ratingsMap }));
          }
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load your courses");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMyCourses();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [isSignedIn]);

  // Optimistic submit rating to server
  const submitRatingToServer = async (courseId, ratingValue) => {
    try {
      const token = await getToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };

      const res = await fetch(`${API_BASE}/api/course/${courseId}/rate`, {
        method: "POST",
        headers,
        // CORRECTED: Removed credentials: "include"
        body: JSON.stringify({ rating: ratingValue }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok && !data.success) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to rate (${res.status})`;
        throw new Error(msg);
      }

      const avg = data.avgRating ?? data.course?.avgRating ?? null;
      const total = data.totalRatings ?? data.course?.ratingCount ?? null;

      if (avg !== null || total !== null) {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  avgRating: typeof avg === "number" ? avg : c.avgRating,
                  totalRatings:
                    typeof total === "number" ? total : c.totalRatings,
                }
              : c
          )
        );
      }
      setUserRatings((prev) => ({ ...prev, [courseId]: ratingValue }));
      toast.success("Thanks for rating!");
      return { success: true };
    } catch (err) {
      console.error("submitRatingToServer:", err);
      toast.error(err.message || "Failed to submit rating");
      return { success: false, error: err };
    }
  };

  const handleSetRating = async (e, courseId, rating) => {
    e.stopPropagation();
    if (!isSignedIn) {
      toast("Please sign in to submit a rating", { icon: "⭐" });
      return;
    }

    // Update locally immediately for better UX
    setUserRatings((prev) => ({
      ...prev,
      [courseId]: rating,
    }));
    await submitRatingToServer(courseId, rating);
  };

  const handleViewCourse = (courseId) => {
    if (!courseId) return;
    navigate(`/course/${courseId}`);
  };

  // Star rendering logic
  const renderInteractiveStars = (c) => {
    const userRating = userRatings[c.id] || 0;
    const hover = hoverRatings[c.id] || 0;
    const baseDisplay = userRating || Math.round(c.avgRating || 0);
    const displayRating = hover || baseDisplay;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ display: "flex", gap: 4, alignItems: "center" }}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const idx = i + 1;
            const filled = idx <= displayRating;
            return (
              <button
                key={i}
                aria-label={`Rate ${idx} stars`}
                onClick={(e) => handleSetRating(e, c.id, idx)}
                onMouseEnter={() =>
                  setHoverRatings((s) => ({ ...s, [c.id]: idx }))
                }
                onMouseLeave={() =>
                  setHoverRatings((s) => ({ ...s, [c.id]: 0 }))
                }
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 2,
                  cursor: "pointer",
                }}
              >
                <Star
                  size={16}
                  fill={filled ? "currentColor" : "none"}
                  stroke="currentColor"
                  style={{
                    color: filled ? "#f59e0b" : "#d1d5db",
                  }}
                />
              </button>
            );
          })}
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", marginLeft: 6 }}
        >
          <div style={{ fontWeight: 700, fontSize: 13 }}>
            {(c.avgRating || 0).toFixed(1)}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            ({c.totalRatings || 0})
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={myCoursesStyles.pageContainer}>
        <div className={myCoursesStyles.mainContainer}>
          <h1 className={myCoursesStyles.header}>My Courses...</h1>
          <p className={myCoursesStyles.emptyText}>Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={myCoursesStyles.pageContainer}>
        <div className={myCoursesStyles.mainContainer}>
          <h1 className={myCoursesStyles.header}>My Courses...</h1>
          <p className={myCoursesStyles.emptyText} style={{ color: "red" }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className={myCoursesStyles.pageContainer}>
        <div className={myCoursesStyles.mainContainer}>
          <h1 className={myCoursesStyles.header}>My Courses</h1>
          <p className={myCoursesStyles.emptyText}>
            You haven't purchased any courses yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={myCoursesStyles.pageContainer}>
      <div className={myCoursesStyles.mainContainer}>
        <h1 className={myCoursesStyles.header}>My Courses</h1>

        <div className={myCoursesStyles.grid}>
          {courses.map((course, index) => (
            <div
              key={course.id ?? index}
              className={myCoursesStyles.courseCard}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`,
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleViewCourse(course.id);
              }}
              onClick={() => handleViewCourse(course.id)}
            >
              <div className={myCoursesStyles.imageContainer}>
                <img
                  src={course.image || undefined}
                  alt={course.name}
                  className={myCoursesStyles.courseImage}
                />
              </div>

              <div className={myCoursesStyles.courseContent}>
                <h3 className={myCoursesStyles.courseName}>{course.name}</h3>

                <div className={myCoursesStyles.infoContainer}>
                  <div className={myCoursesStyles.ratingContainer}>
                    {renderInteractiveStars(course)}
                  </div>
                  <div className={myCoursesStyles.teacherContainer}>
                    <User className={myCoursesStyles.teacherIcon} />
                    <span className={myCoursesStyles.teacherText}>
                      {course.teacher}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewCourse(course.id);
                  }}
                  className={myCoursesStyles.viewButton}
                >
                  <Play className={myCoursesStyles.buttonIcon} />
                  <span>View Course</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{myCoursesCustomStyles}</style>
    </div>
  );
};

export default MyCourses;