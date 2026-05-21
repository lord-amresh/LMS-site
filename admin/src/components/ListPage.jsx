import React, { useEffect, useState } from "react";
import { listStyles } from "../assets/dummyStyles";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, Star, BookOpen, Clock, EyeClosed, Trash2, Eye, Video, PenLine } from "lucide-react";

const ListPage = () => {
  const navigate = useNavigate(); // Added navigate hook
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedLectures, setExpandedLectures] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://lms-site-8cyh.onrender.com";

  //  build image URL for fetching
    const getImageUrl = (imagePath) => {
      if (!imagePath) return "";
      if (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
        return imagePath;
      // If the server sends path like "/uploads/..." or "uploads/..."
      if (imagePath.startsWith("/")) return `${API_BASE}${imagePath}`;
      if (imagePath.includes("/uploads/"))
        return `${API_BASE}/${imagePath}`.replace(/\/\/+/g, "/");
      return `${API_BASE}/uploads/${imagePath}`;
    };

    //  parse duration into total minutes (helper)
      const parseDuration = (v) => {
    if (v == null) return 0;

    // number -> assume minutes
    if (typeof v === "number" && Number.isFinite(v))
      return Math.max(0, Math.floor(v));

    // String -> try "1h 20m" or "80m" or plain number string
    if (typeof v === "string") {
      const s = v.trim();
      // match hours and minutes like "1h 20m" or "1 h 20 m"
      const hMatch = s.match(/(\d+)\s*h/i);
      const mMatch = s.match(/(\d+)\s*m/i);
      let total = 0;
      if (hMatch) total += parseInt(hMatch[1], 10) * 60;
      if (mMatch) total += parseInt(mMatch[1], 10);
      if (total > 0) return total;
      // maybe it's just a plain number in minutes
      const plain = parseInt(s.replace(/[^\d-]/g, ""), 10);
      if (Number.isFinite(plain)) return Math.max(0, plain);
      // ISO-ish fallback: try PT#M / PT#H#M
      const isoHM = s.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
      if (isoHM) {
        const h = Number(isoHM[1] || 0);
        const m = Number(isoHM[2] || 0);
        return h * 60 + m;
      }
      return 0;
    }

    // Object -> check known fields
    if (typeof v === "object") {
      // nested duration: { duration: { hours, minutes } }
      if (v.duration) return parseDuration(v.duration);

      if ("totalMinutes" in v && Number.isFinite(Number(v.totalMinutes))) {
        return Math.max(0, Math.floor(Number(v.totalMinutes)));
      }
      if ("minutes" in v && "hours" in v) {
        const hrs = Number(v.hours) || 0;
        const mins = Number(v.minutes) || 0;
        return Math.max(0, Math.floor(hrs * 60 + mins));
      }
      if ("hours" in v || "mins" in v || "min" in v) {
        const hrs = Number(v.hours) || 0;
        const mins = Number(v.minutes || v.mins || v.min) || 0;
        return Math.max(0, Math.floor(hrs * 60 + mins));
      }
      if ("minutes" in v) {
        return Math.max(0, Math.floor(Number(v.minutes) || 0));
      }
      // sometimes backend may send { length: 80 } or { durationMin: 80 }
      if ("durationMin" in v && Number.isFinite(Number(v.durationMin))) {
        return Math.max(0, Math.floor(Number(v.durationMin)));
      }
      if ("length" in v && Number.isFinite(Number(v.length))) {
        return Math.max(0, Math.floor(Number(v.length)));
      }
    }

    return 0;
  };

  // Format minutes into consistent string like "1h 20m" or "45m"
  const formatMinutes = (mins) => {
    const m = Math.max(0, Math.floor(Number(mins) || 0));
    const h = Math.floor(m / 60);
    const rem = m % 60;
    if (h === 0) return `${rem}m`;
    if (rem === 0) return `${h}h`;
    return `${h}h ${rem}m`;
  };

  // normalize ID (not strictly required but handy)
  const getId = (c) => (c && (c._id ? c._id : c.id)) || null;

  // Robust fetch that handles variations: array | { items: [...] } | { courses: [...] }
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/course/public`);
      let raw = res.data;
      if (raw && raw.data) raw = raw.data;

      let arr = Array.isArray(raw)
        ? raw
        : Array.isArray(raw.items)
        ? raw.items
        : Array.isArray(raw.courses)
        ? raw.courses
        : [];

      // Defensive nested case
      if (!Array.isArray(arr) && raw.items && Array.isArray(raw.items.items)) {
        arr = raw.items.items;
      }

      if (!Array.isArray(arr)) arr = [];

      const mapped = arr.map((c) => {
        const id = c._id || c.id;
        const imageUrl = c.image || c.img || c.thumbnail || "";
        const finalImage = getImageUrl(imageUrl);

        // lectures array variations
        const lecturesArr = c.courseLectures || c.lectures || c.contents || [];

        // price could be object or primitive
        const isPriceObject = typeof c.price === "object" && c.price !== null;
        const salePrice = isPriceObject ? c.price.sale : c.price;
        const originalPrice = isPriceObject
          ? c.price.original
          : c.originalPrice;

        // totalDuration variations -> compute minutes
        const totalDurationRaw =
          c.totalDuration || c.duration || c.totalDurationObj || null;
        const totalDurationMinutes = parseDuration(totalDurationRaw);

        // ensure each lecture/chapter durations normalized too (not altering original shape but helpful)
        const normalizedLectures = Array.isArray(lecturesArr)
          ? lecturesArr.map((lec) => ({
              ...lec,
              _parsedDurationMinutes:
                lec.durationMin ??
                lec.totalMinutes ??
                parseDuration(lec.duration) ??
                0,
              chapters: Array.isArray(lec.chapters)
                ? lec.chapters.map((ch) => ({
                    ...ch,
                    _parsedDurationMinutes:
                      ch.durationMin ??
                      ch.totalMinutes ??
                      parseDuration(ch.duration) ??
                      0,
                  }))
                : [],
            }))
          : [];

        return {
          ...c,
          id,
          name: c.name || c.title || "Untitled Course",
          instructor: c.teacher || c.instructor || "Unknown Instructor",
          image: finalImage,
          rating: typeof c.rating !== "undefined" ? c.rating : 0,
          lectures: Array.isArray(lecturesArr) ? lecturesArr.length : 0,
          courseLectures: normalizedLectures,
          description:
            c.description || c.desc || c.overview || "No description provided.",
          courseType: c.courseType || c.type || "regular",
          price: salePrice ?? 0,
          originalPrice: originalPrice ?? salePrice ?? 0,
          isFree:
            !!c.isFree ||
            salePrice === 0 ||
            salePrice === "0" ||
            (typeof salePrice === "string" &&
              salePrice.toLowerCase() === "free"),
          totalDurationMinutes,
        };
      });   // this is the output we will get

      setCourses(mapped);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      toast.error("Failed to load courses. Check server or network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // filter the course (by name, instructor, category)
    const filteredCourses = courses.filter((course) => {
    const t = searchTerm.trim().toLowerCase();
    if (!t) return true;
    return (
      (course.name || "").toLowerCase().includes(t) ||
      (course.instructor || "").toLowerCase().includes(t) ||
      (course.category || "").toLowerCase().includes(t)
    );
  });
  // toggling the detail
  const toggleCourseDetails = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
    if (expandedCourse === courseId) {
      // collapsing: clear lecture expansions for this course
      setExpandedLectures((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          if (key.startsWith(`${courseId}-`)) delete newState[key];
        });
        return newState;
      });
    }
  };

  const toggleLectureDetails = (courseId, lectureId) => {
    const key = `${courseId}-${lectureId}`;
    setExpandedLectures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

   // DELETE without auth headers
  const handleRemoveCourse = async (courseId, courseName) => {
    if (
      !window.confirm(`Delete course "${courseName}"? This cannot be undone.`)
    )
      return;

    const prev = [...courses];
    setCourses((c) => c.filter((x) => x.id !== courseId));

    try {
      await axios.delete(`${API_BASE}/api/course/${courseId}`);
      toast.success(`"${courseName}" has been removed successfully!`, {
        duration: 3000,
        style: { background: "#ef4444", color: "white" },
        icon: "🗑️",
      });
    } catch (err) {
      console.error("Delete failed:", err);
      setCourses(prev); // rollback
      if (err.response && err.response.status === 401) {
        toast.error("Unauthorized: server requires authentication to delete.");
      } else {
        toast.error("Failed to delete course. Try again.");
      }
    }
  };


  //  getting the star rating
  const StarRating = ({ rating }) => {
    const rounded = Math.round((rating || 0) * 2) / 2;
    const fullStars = Math.floor(rounded);
    const hasHalf = rounded % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <div className={listStyles.starRating}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={listStyles.starFull} />
        ))}
        {hasHalf && <StarHalf className={listStyles.starHalf} />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={listStyles.starEmpty} />
        ))}
      </div>
    );
  };

  return (
    <div className={listStyles.pageContainer}>
      <Toaster position="top-right" />
      <div className={listStyles.contentContainer}>
        <div className={listStyles.headerContainer}>
          <h1 className={listStyles.headerTitle}>Course Catalog</h1>
          <p className={listStyles.headerSubtitle}>
            Manage and browse your courses - clean, light and elegant.
          </p>
        </div>

        <div className={listStyles.searchContainer}>
          <div className={listStyles.searchInputContainer}>
            <Search className={listStyles.searchIcon} />
            <input
              type="text"
              placeholder="Search courses, instructors, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={listStyles.searchInput}
            />
          </div>
        </div>

        <div className={listStyles.courseList}>
          {loading && (
            <div className={listStyles.emptyText}>Loading Courses...</div>
          )}

            {!loading &&
            filteredCourses.map((course) => (
              <div key={course.id} className={listStyles.courseCard}>
                <div className={listStyles.courseCardContent}>
                  <div className={listStyles.courseHeader}>
                    <div className={listStyles.courseImageContainer}>
                      <img
                        src={course.image}
                        alt={course.name}
                        className={listStyles.courseImage}
                      />
                      <div className={listStyles.courseInfo}>
                        <div className={listStyles.courseTitleRow}>
                          <div className="flex-1 min-w-0">
                            <h3 className={listStyles.courseTitle}>
                              {course.name}
                            </h3>
                            <p className={listStyles.courseInstructor}>
                              {course.instructor}
                            </p>
                          </div>

                          <span
                            className={listStyles.courseBadge(
                              course.courseType
                            )}
                            aria-label={`Course type: ${
                              course.courseType === "top"
                                ? "Top Course"
                                : "Regular Course"
                            }`}
                            title={
                              course.courseType === "top"
                                ? "Top Course"
                                : "Regular Course"
                            }
                          >
                            {course.courseType === "top"
                              ? "Top Course"
                              : "Regular Course"}
                          </span>
                        </div>

                        <div className={listStyles.courseMeta}>
                          <div className={listStyles.metaItem}>
                            <BookOpen className={listStyles.metaIcon} />
                            <span>{course.lectures} lectures</span>
                          </div>
                          <div className={listStyles.metaItem}>
                            <Clock className={listStyles.metaIcon} />
                            <span>
                              {formatMinutes(course.totalDurationMinutes)}
                            </span>
                          </div>
                          <StarRating rating={course.rating} />
                        </div>
                      </div>
                    </div>

                    <div className={listStyles.courseActions}>
                      <div className={listStyles.priceContainer}>
                        <div className="flex items-center gap-1 sm:gap-2">
                          {course.isFree ? (
                            <span className={listStyles.priceFree}>Free</span>
                          ) : (
                            <>
                              <span className={listStyles.priceRegular}>
                                {course.price}
                              </span>
                              {course.originalPrice && (
                                <span className={listStyles.originalPrice}>
                                  {course.originalPrice}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className={listStyles.actionButtons}>
                        <button
                          onClick={() => toggleCourseDetails(course.id)}
                          className={listStyles.toggleButton}
                          aria-label={
                            expandedCourse === course.id
                              ? "Hide course details"
                              : "Show course details"
                          }
                        >
                          {expandedCourse === course.id ? (
                            <Eye className={listStyles.actionIcon} />
                          ) : (
                            <EyeClosed className={listStyles.actionIcon} />
                          )}
                        </button>

                        {/* NEW EDIT BUTTON */}
                        <button
                          onClick={() => navigate(`/editcourse/${course.id}`)}
                          className={listStyles.toggleButton} // Reusing the same style as the Eye icon
                          aria-label={`Edit course: ${course.name}`}
                          title="Edit Course"
                        >
                          <PenLine className={listStyles.actionIcon} />
                        </button>

                        <button
                          onClick={() =>
                            handleRemoveCourse(course.id, course.name)
                          }
                          className={listStyles.deleteButton}
                          aria-label={`Remove course: ${course.name}`}
                        >
                          <Trash2 className={listStyles.actionIcon} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedCourse === course.id && (
                  <div className={listStyles.expandedCourse}>
                    <div className={listStyles.descriptionSection}>
                      <h4 className={listStyles.descriptionTitle}>
                        Course Description
                      </h4>
                      <p className={listStyles.descriptionText}>
                        {course.description}
                      </p>
                    </div>

                    <div>
                      <h4 className={listStyles.descriptionTitle}>
                        Course Content
                      </h4>
                      <div className={listStyles.contentSection}>
                        {(course.courseLectures || []).map((lecture) => (
                          <div
                            key={lecture.id || lecture._id}
                            className={listStyles.lectureCard}
                          >
                            <div className={listStyles.lectureHeader}>
                              <button
                                onClick={() =>
                                  toggleLectureDetails(
                                    course.id,
                                    lecture.id || lecture._id
                                  )
                                }
                                className={listStyles.lectureToggleButton}
                              >
                                <div className={listStyles.lectureInfo}>
                                  <div className="flex-1 min-w-0">
                                    <h5 className={listStyles.lectureTitle}>
                                      {lecture.title}
                                    </h5>
                                    <div className={listStyles.lectureMeta}>
                                      <div className={listStyles.metaItem}>
                                        <Video
                                          className={listStyles.metaIcon}
                                        />
                                        <span>
                                          {(lecture.chapters || []).length}{" "}
                                          chapters
                                        </span>
                                      </div>
                                      <div className={listStyles.metaItem}>
                                        <Clock
                                          className={listStyles.metaIcon}
                                        />
                                        <span>
                                          {formatMinutes(
                                            lecture._parsedDurationMinutes ??
                                              parseDuration(lecture.duration)
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <EyeClosed
                                  className={listStyles.lectureToggleIcon(
                                    expandedLectures[
                                      `${course.id}-${
                                        lecture.id || lecture._id
                                      }`
                                    ]
                                  )}
                                />
                              </button>
                            </div>

                            {expandedLectures[
                              `${course.id}-${lecture.id || lecture._id}`
                            ] && (
                              <div className={listStyles.expandedLecture}>
                                <div className={listStyles.chapterList}>
                                  {(lecture.chapters || []).map((chapter) => (
                                    <div
                                      key={chapter.id || chapter._id}
                                      className={listStyles.chapterCard}
                                    >
                                      <div
                                        className={listStyles.chapterContent}
                                      >
                                        <div
                                          className={listStyles.chapterHeader}
                                        >
                                          <div
                                            className={listStyles.chapterIcon}
                                          >
                                            <Eye
                                              className={
                                                listStyles.chapterIconSvg
                                              }
                                            />
                                          </div>
                                          <div
                                            className={
                                              listStyles.chapterDetails
                                            }
                                          >
                                            <a
                                              href={chapter.videoUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={
                                                listStyles.chapterTitle
                                              }
                                            >
                                              <h6>{chapter.name}</h6>
                                            </a>
                                            <p
                                              className={
                                                listStyles.chapterTopic
                                              }
                                            >
                                              {chapter.topic}
                                            </p>

                                            <div
                                              className={listStyles.chapterMeta}
                                            >
                                              <span
                                                className={
                                                  listStyles.chapterDuration
                                                }
                                              >
                                                <Clock className="w-3 h-3" />
                                                {formatMinutes(
                                                  chapter._parsedDurationMinutes ??
                                                    parseDuration(
                                                      chapter.duration
                                                    )
                                                )}
                                              </span>
                                              <a
                                                href={chapter.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={
                                                  listStyles.chapterVideoLink
                                                }
                                              >
                                                {chapter.videoUrl}
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* till is the UI */}

            {!loading && filteredCourses.length === 0 && (
              <div className={listStyles.emptyState}>
                <Search className={listStyles.emptyIcon} />
                <p className={listStyles.emptyText}>
                  No courses found matching your search
                </p>

                <button onClick={() => setSearchTerm("")} className={listStyles.clearButton}>
                  Clear search
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ListPage;