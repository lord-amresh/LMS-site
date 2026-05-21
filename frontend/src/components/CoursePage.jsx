import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  coursePageStyles,
  coursePageCustomStyles,
} from "../assets/dummyStyles";
import { Search, SmilePlus, Star, StarHalf, User, X } from 'lucide-react';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { useAuth, useUser } from '@clerk/react';
import { Toaster } from 'react-hot-toast';

const API_BASE = "http://localhost:4000";

const StarIcon = ({ filled = false, half = false, className = "" }) => {
  if (half) {
    return <StarHalf className={`w-4 h-4 ${className}`} fill="currentColor" />;
  }
  return (
    <Star
      className={`w-4 h-4 ${className}`}
      fill={filled ? "currentColor" : "none"}
    />
  );
};

const UserIcon = () => <User className={coursePageStyles.teacherIcon}/>
const SearchIcon = () => <Search className={coursePageStyles.searchIcon}/>

//  show 5 interactive stars (calls onRate(courseId, rating))
const RatingStars = ({
  courseId,
  userRating = 0,
  avgRating = 0,
  totalRatings = 0,
  onRate,
}) => {
  const [hover, setHover] = useState(0);
  const base = userRating || Math.round(avgRating || 0);
  const display = hover || base;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: "flex", gap: 6 }}
      >
        {Array.from({ length: 5 }).map((_, i) => {
          const idx = i + 1;
          const filled = idx <= display;
          return (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRate && onRate(courseId, idx);
              }}
              onMouseEnter={() => setHover(idx)}
              onMouseLeave={() => setHover(0)}
              aria-label={`Rate ${idx} star${idx > 1 ? "s" : ""}`}
              style={{
                background: "transparent",
                border: "none",
                padding: 2,
                cursor: "pointer",
              }}
            >
              <StarIcon
                filled={filled}
                className={filled ? "text-yellow-400" : "text-gray-300"}
              />
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginLeft: 6 }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>
          {(avgRating || 0).toFixed(1)}
        </div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          ({totalRatings || 0})
        </div>
      </div>
    </div>
  );
};

const CoursePage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
    const [ratings, setRatings] = useState(() => {
    try {
      const raw = localStorage.getItem("userCourseRatings");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // persist rating when changed
  useEffect(() => {
    try {
      localStorage.setItem("userCourseRatings", JSON.stringify(ratings));
    } catch {
      // ignore
    }
  }, [ratings]);

  //  fetch
  // Fetch public courses
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/course/public`)
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || "Failed to fetch courses");
        }
        return res.json();
      })
      .then(async (json) => {
        if (!mounted) return;
        const raw = json.items || json.courses || [];
        // filter non-top (existing behavior)
        const regular = raw.filter((c) =>
          c.courseType ? c.courseType !== "top" : true
        );

        const mapped = regular.map((c) => ({
          id: String(c._id || c.id || ""),
          name: c.name,
          teacher: c.teacher || c.instructor || "",
          category: c.category || "",
          image: c.image || "",
          isFree:
            c.pricingType === "free" ||
            !c.price ||
            (!c.price.sale && !c.price.original),
          price:
            c.price ||
            (c.originalPrice
              ? { original: c.originalPrice, sale: c.price }
              : {}),
          avgRating:
            typeof c.avgRating === "number"
              ? c.avgRating
              : typeof c.rating === "number"
              ? c.rating
              : parseFloat(c.rating) || 0,
          totalRatings:
            typeof c.totalRatings === "number"
              ? c.totalRatings
              : c.ratingCount ?? 0,
          raw: c,
        }));

        setCourses(mapped);

        // if signed in, try to fetch my-rating per course (parallel)
        if (isSignedIn && mapped.length) {
          const promises = mapped.map(async (course) => {
            if (!course.id) return null;
            try {
              const headers = { "Content-Type": "application/json" };
              try {
                const token = await getToken().catch(() => null);
                if (token) headers.Authorization = `Bearer ${token}`;
              } catch (e) {}
              const r = await fetch(
                `${API_BASE}/api/course/${encodeURIComponent(
                  course.id
                )}/my-rating`,
                {
                  method: "GET",
                  headers,
                  credentials: "include",
                }
              );
              if (!r.ok) return null;
              const d = await r.json().catch(() => null);
              if (d && d.success && d.myRating)
                return { courseId: course.id, rating: d.myRating.rating };
            } catch (err) {
              return null;
            }
            return null;
          });

          const results = await Promise.all(promises);
          const map = {};
          results.forEach((it) => {
            if (it && it.courseId) map[it.courseId] = it.rating;
          });
          if (mounted && Object.keys(map).length) {
            setRatings((prev) => ({ ...prev, ...map }));
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load courses:", err);
        if (mounted) setError(err.message || "Failed to load courses");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  // to send the rating to server
const submitRatingToServer = async (courseId, ratingValue) => {
  try {
    const headers = { "Content-Type": "application/json" };
    try {
      const token = await getToken().catch(() => null);
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      // ignore any error
    }

    const res = await fetch(
  `${API_BASE}/api/course/${encodeURIComponent(courseId)}/rate`,
  {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ rating: ratingValue }),
  }
);

const data = await res.json().catch(() => ({}));
if (!res.ok && !data.success) {
  const msg =
    (data && (data.message || data.error)) ||
    `Failed to rate (${res.status})`;
  if (res.status === 401)
    toast.error("Please sign in to submit the rating");
  throw new Error(msg);
}

// update course aggregates from server response if provided
      const avg = data.avgRating ?? data.course?.avgRating ?? data.avg ?? null;
      const total =
        data.totalRatings ?? data.course?.totalRatings ?? data.count ?? null;

      if (avg !== null || total !== null) {
        setCourses((prev) =>
          prev.map((c) =>
            String(c.id) === String(courseId)
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

      // persist user's rating locally
      setRatings((prev) => ({ ...prev, [courseId]: ratingValue }));
      toast.success("Thanks for rating!");
      return true;
  } catch (err) {
    console.error("SubmitRating Error:", err);
    toast.error(err.message || "Failed to submit rating");
    return false;
  }
};

  const handleRating = async (courseId, newRating, e) => {
    if (e && e.stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    if(!isSignedIn) {
      toast('Please sign in to submit the rating', {icon: "⭐"});
      return;
    }
    setRatings((prev) => ({
      ...prev,
      [courseId]: newRating,
    }));
    await submitRatingToServer(courseId, newRating);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

    // Decide which courses to show (8 by default)
  const VISIBLE_COUNT = 8;
  const visibleCourses = showAll
    ? filteredCourses
    : filteredCourses.slice(0, VISIBLE_COUNT);
  const remainingCount = Math.max(0, filteredCourses.length - VISIBLE_COUNT);

  // Small, animated top-right toast — only shown when user clicks a course and token missing
  const showLoginToast = () => {
    toast.error("Please login to access this course", {
      position: "top-right",
      transition: Slide,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  // navigate to course details if logged in else
  const openCourse = (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showLoginToast();
      return;
    }
    navigate(`/courses/${courseId}`);
  };

  const isCourseFree = (course) => {
    return course.isFree || !course.price;
  };

    // Helper function to get price display
    const getPriceDisplay = (course) => {
      if (isCourseFree(course)) {
        return "Free";
      }
      const price = course.price || {};

      if (price.sale != null && price.sale !== 0) {
        return {
          current: `₹${price.sale}`,
          original:
            price.original && price.original > course.price.sale
              ? `₹${price.original}`
              : null,
        };
      }

      if (price.original != null) {
        return {
          current: `₹${price.original}`,
          original: null,
        };
      }

      return "Free";
    };

    if (loading)
      return <div className="p-6 text-center">Loading courses...</div>;
    if (error)
      return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className={coursePageStyles.pageContainer}>
      <Toaster position="top-right" />
      <div className={coursePageStyles.headerContainer}>
        <div className={coursePageStyles.headerTransform}>
          <h1 className={coursePageStyles.headerTitle}>LEARN & GROW</h1>
        </div>
        <p className={coursePageStyles.headerSubtitle}>
          Master New Skills with Expert-Led Courses
        </p>

        <div className={coursePageStyles.searchContainer}>
          <div className={coursePageStyles.searchGradient} />
          <div className={coursePageStyles.searchInputContainer}>
            <div className={coursePageStyles.searchIconContainer}>
              <SearchIcon />
            </div>

            <input
              type="text"
              placeholder="Search courses by name, instructor, or category..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAll(false);
              }}
              className={coursePageStyles.searchInput}
            />

            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowAll(false);
                }}
                className={coursePageStyles.clearButton}
              >
                <X className=" w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* results count */}
        {searchQuery && (
          <div className=" text-center">
            <p className={coursePageStyles.resultsCount}>
              Found {filteredCourses.length} course
              {filteredCourses.length !== 1 ? "s" : ""} matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* Courses Grid */}
      <div className={coursePageStyles.coursesGrid}>
        {filteredCourses.length === 0 ? (
          <div className={coursePageStyles.noCoursesContainer}>
            <div className="text-gray-400 mb-4">
              <SmilePlus className={coursePageStyles.noCoursesIcon} />
            </div>
            <h3 className={coursePageStyles.noCoursesTitle}>
              No courses found
            </h3>
            <button
              onClick={() => {
                setSearchQuery("");
                setShowAll(false);
              }}
              className={coursePageStyles.noCoursesButton}
            >
              Show All Courses
            </button>
          </div>
        ) : (
          <>
            <div className={coursePageStyles.coursesGridContainer}>
              {visibleCourses.map((course, index) => {
                const userRating = ratings[course.id] || 0;
                const isFree = isCourseFree(course);
                const priceDisplay = getPriceDisplay(course);

                return (
                  <div
                    key={course.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openCourse(course.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") openCourse(course.id);
                    }}
                    className={coursePageStyles.courseCard}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className={coursePageStyles.courseCardInner}>
                      <div className={coursePageStyles.courseCardContent}>
                        {/* Image */}
                        <div className={coursePageStyles.courseImageContainer}>
                          <img
                            src={course.image}
                            alt={course.name}
                            className={coursePageStyles.courseImage}
                          />
                        </div>

                        <div className={coursePageStyles.courseInfo}>
                          <h3 className={coursePageStyles.courseName}>
                            {course.name}
                          </h3>

                          <div className={coursePageStyles.teacherContainer}>
                            <UserIcon />
                            <span className={coursePageStyles.teacherName}>
                              {course.teacher}
                            </span>
                          </div>

                          {/* Interactive rating (user) */}
                          <div className={coursePageStyles.ratingContainer}>
                            <div className={coursePageStyles.ratingStars}>
                              <div
                                className={coursePageStyles.ratingStarsInner}
                              >
                              <RatingStars
                              courseId={course.id}
                              userRating={userRating}
                              avgRating={course.avgRating}
                              totalRatings={course.totalRatings}
                              onRate={handleRating}
                              />
                              </div>
                            </div>
                          </div>

                          <div className={coursePageStyles.priceContainer}>
                            <div className="flex items-center space-x-2">
                              {isFree ? (
                                <span className={coursePageStyles.priceFree}>
                                  Free
                                </span>
                              ) : (
                                <>
                                  <span
                                    className={coursePageStyles.priceCurrent}
                                  >
                                    {typeof priceDisplay === "object"
                                      ? priceDisplay.current
                                      : priceDisplay}
                                  </span>
                                  {typeof priceDisplay === "object" &&
                                    priceDisplay.original && (
                                      <span
                                        className={
                                          coursePageStyles.priceOriginal
                                        }
                                      >
                                        {priceDisplay.original}
                                      </span>
                                    )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <ToastContainer
      position="top-right"
      autoClose={3000}
      transition={Slide}
      theme="dark"
      />

      <style>{coursePageCustomStyles}</style>
    </div>
  );
};

export default CoursePage;