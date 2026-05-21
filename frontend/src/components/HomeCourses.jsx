import React, { useEffect, useState } from 'react'
import { homeCoursesStyles } from '../assets/dummyStyles'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Star, User } from 'lucide-react'
import { Slide, toast, ToastContainer } from 'react-toastify';
import { useAuth, useUser } from '@clerk/react';

const API_BASE = "http://localhost:4000";
const HomeCourses = () => {
    const navigate = useNavigate();
    const { title, course: courseFont, detail } = homeCoursesStyles.fonts;
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Clerk
    const { isSignedIn, user } = useUser();  // user is null if not signed in.
    const {getToken} = useAuth();

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


  //  fetch
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/course/public?home=true&limit=8`).then(
        async (res) => {
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "failed to fetch courses from server");
            }
            return res.json();
        }
    )
          .then((json) => {
        if (!mounted) return;
        const items = (json && (json.items || json.courses || [])) || [];
        const mapped = items.map((c) => ({
          id: c._id || c.id,
          name: c.name,
          teacher: c.teacher,
          image: c.image,
          price: c.price || {
            original: c.price?.original,
            sale: c.price?.sale,
          },
          isFree:
            c.pricingType === "free" ||
            !c.price ||
            (c.price && !c.price.sale && !c.price.original),
          // prefer avgRating / totalRatings from backend if available
          avgRating:
            typeof c.avgRating !== "undefined" ? c.avgRating : c.rating || 0,
          totalRatings:
            typeof c.totalRatings !== "undefined"
              ? c.totalRatings
              : c.ratingCount || 0,
          courseType: c.courseType || "regular",
        }));
        setCourses(mapped)
  })
  .catch ((err) => {
    console.error('Failed to load courses', err);
    if(mounted) setError('Failed to load server');
  })
  .finally (() => mounted && setLoading(false));
  
  return () => {
    mounted = false;
  };
}, []);


    const showLoginToast = () => {
    toast.error("Please login to access this course", {
      position: "top-right",
      transition: Slide,
      autoClose: 3000,
      theme: "dark",
    });
  };

  const handleCourseClick = (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
        showLoginToast();
        return;
    }
    navigate(`/course/${id}`);
    };

  const handleBrowseClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        toast.error("Please login to access courses", {
        position: "top-right",
        transition: Slide,
        autoClose: 3000,
        theme: "dark",
        });
        return;
    }

    navigate("/courses");
    };

          const submitRatingToServer = async (courseId, ratingValue) => {
    try {
      const headers = { "Content-Type": "application/json" };
      // try to get Clerk JWT token if available (works with Clerk)
      try {
        if (getToken) {
          const token = await getToken().catch(() => null);
          if (token) headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        // ignore token errors and fall back to credentials include
      }

      const res = await fetch(`${API_BASE}/api/course/${courseId}/rate`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ rating: ratingValue }),
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (!res.ok && !data.success) {
        const msg =
          (data && (data.message || data.error)) ||
          `Failed to rate (${res.status})`;
        throw new Error(msg);
      }

      // Expect server to return new avg & total (controller examples above do)
      // Some servers return { success: true, avgRating, totalRatings }
      const avg =
        data.avgRating ??
        data.course?.avgRating ??
        data.course?.avgRating ??
        data.course?.avgRating ??
        data.course?.avgRating;
      const total =
        data.totalRatings ??
        data.course?.ratingCount ??
        data.course?.ratingCount ??
        data.course?.ratingCount;

      // update UI with returned aggregates (fallback to previous if missing)
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

      // store user's rating locally so UI reflects selection
      setUserRatings((prev) => ({ ...prev, [courseId]: ratingValue }));

      toast.success("Thanks for your rating!");
      return { success: true, avg, total };
    } catch (err) {
      console.error("submitRatingToServer:", err);
      toast.error(err.message || "Failed to submit rating");
      return { success: false, error: err };
    }
  };

    // for rating to set by user also show average rating given by all the users.
    const handleSetRating = async (e, courseId, rating) => {
        e.stopPropagation();
        if (!isSignedIn) {
            toast("Please sign in to submit a rating...", {icon: "⭐"});
            return;
        }
        setUserRatings((prev) => ({ ...prev, [courseId]: rating }));
        await submitRatingToServer(courseId, rating);
    };

  const renderInteractiveStars = (course) => {
    // if signed in and user rated, show their rating; otherwise show rounded avg
    const userRating = userRatings[course.id] || 0;
    const hover = hoverRatings[course.id] || 0;
    // when logged in prefer user's rating for filled stars, else show rounded avg
    const baseDisplay = userRating || Math.round(course.avgRating || 0);
    const displayRating = hover || baseDisplay;

    return (
      <div
        className={homeCoursesStyles.starsContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={homeCoursesStyles.interactiveStars}>
          {Array.from({ length: 5 }).map((_, i) => {
            const idx = i + 1;
            const filled = idx <= displayRating;
            return (
              <button
                key={i}
                aria-label={`Rate ${idx} star${idx > 1 ? "s" : ""}`}
                onClick={(e) => handleSetRating(e, course.id, idx)}
                onMouseEnter={() =>
                  setHoverRatings((s) => ({ ...s, [course.id]: idx }))
                }
                onMouseLeave={() =>
                  setHoverRatings((s) => ({ ...s, [course.id]: 0 }))
                }
                className={`${homeCoursesStyles.starButton} ${
                  filled
                    ? homeCoursesStyles.starButtonActive
                    : homeCoursesStyles.starButtonInactive
                }`}
                style={{ background: "transparent" }}
              >
                <Star
                  size={16}
                  fill={filled ? "currentColor" : "none"}
                  stroke="currentColor"
                  className={homeCoursesStyles.starIcon}
                />
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginLeft: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontWeight: 600 }}>
            {(course.avgRating || 0).toFixed(1)}
          </span>
          <span style={{ color: "#6b7280", fontSize: 12 }}>
            ({course.totalRatings || 0})
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={homeCoursesStyles.container}>
        <div className={homeCoursesStyles.mainContainer}>
            <div className={homeCoursesStyles.header}>
            <h2 className={`${title} ${homeCoursesStyles.title}`}>
                <Star className={homeCoursesStyles.titleIcon} />
                Explore Top Courses
                 <Star className={homeCoursesStyles.titleIcon} />
            </h2>
        </div>

        {loading ? (
            <div className="p-6 text-center">Loading courses...</div>
        ) : error ? (
            <div className= "p-6 text-center text-red-500">{error}</div>
        ) : (

            <>
                <div className={homeCoursesStyles.coursesGrid}>
            {courses.map((course) => {
                const isFree = !!course.isFree || !course.price;

                return (
                <div
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className={homeCoursesStyles.coursesCard}
                >
                    <div className={homeCoursesStyles.imageContainer}>
                        <img
                            src={course.image}
                            alt={course.name}
                            className={homeCoursesStyles.courseImage}
                            loading="lazy"
                        />
                        </div>

                        <div className={homeCoursesStyles.courseInfo}>
                        <h3 className={`${courseFont} ${homeCoursesStyles.courseName}`}>
                            {course.name}
                        </h3>

                        <div className={`${detail} ${homeCoursesStyles.teacherInfo}`}>
                            <User size={15} className={homeCoursesStyles.teacherIcon} />
                            <span className={homeCoursesStyles.teacherName}>
                                {course.teacher}
                            </span>
                        </div>
                        <div className={homeCoursesStyles.ratingContainer}>
                            {renderInteractiveStars(course)}
                        </div>

                        <div className={homeCoursesStyles.pricingContainer}>
                            {isFree ? (
                                <span className={homeCoursesStyles.freePrice}>Free</span>
                            ) : (
                                <>
                                    <span className={homeCoursesStyles.salePrice}>
                                        ₹{course.price?.sale ?? "-"}
                                    </span>
                                    {course.price?.original && (
                                        <span className={homeCoursesStyles.originalPrice}>
                                        ₹{course.price.original}
                                        </span>
                                    )}
                                </>
                            )}
                            //
                        </div>
                    </div>
                </div>
                );
            })}
            </div>
            </>
        )}

    

            {/* CTA BTN */}
            <div className={homeCoursesStyles.ctaContainer}>
                <div className={homeCoursesStyles.ctaWrapper}>
                    <span 
                        className={homeCoursesStyles.ctaGlow}
                        style={{
                            zIndex: 0,
                            background:
                            "conic-gradient(from 0deg, rgba(236,72,153,0.9), rgba(99,102,241,0.9), rgba(139,92,246,0.9), rgba(236,72,153,0.9))",
                            filter: "blur(5px)",
                            opacity: 0.8,
                        }}
                    />
                    <button
                        onClick={handleBrowseClick}
                        className={homeCoursesStyles.ctaButton}
                        style={{
                            background:
                            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                        }}>
                        <span className={homeCoursesStyles.ctaButtonContent}>
                            <span className={homeCoursesStyles.ctaText}>
                                Discover Courses
                            </span>
                            <ArrowRight  className={homeCoursesStyles.ctaIcon} />
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <ToastContainer position='top-right' autoClose={3000} theme='dark' transition={Slide} />
        <style jsx>{homeCoursesStyles.animations}</style>
    </div>
  );
};

export default HomeCourses 