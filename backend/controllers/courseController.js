import Course from '../models/courseModel.js';
import Booking from '../models/bookingModel.js'; // <-- Added Booking model import
import { getAuth } from '@clerk/express';
import fs from 'fs';
import path from 'path';

// HELPER FUNCTION
const toNumber = (v, fallback = 0) => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string' && v.trim() === "") return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

const parseJSONSafe = (maybe) => {
    if(!maybe) return null;
    if(typeof maybe === 'object') return maybe;
    try {
        return JSON.parse(maybe);
    } catch {
        return null;
    }
}

//  compute fields for totallecture, course, duration
//  mutate them and return an OBJ
const computeDerivedFields = (courseObj) => {
  let totalCourseMinutes = 0;
  if (!Array.isArray(courseObj.lectures)) courseObj.lectures = [];

  courseObj.lectures = courseObj.lectures.map((lec) => {
    lec = { ...lec };
    lec.duration = lec.duration || {};
    lec.chapters = Array.isArray(lec.chapters) ? lec.chapters : [];

    // normalize chapter totals
    lec.chapters = lec.chapters.map((ch) => {
      ch = { ...ch };
      ch.duration = ch.duration || {};
      const chHours = toNumber(ch.duration.hours);
      const chMins = toNumber(ch.duration.minutes);
      ch.totalMinutes = ch.totalMinutes ? toNumber(ch.totalMinutes) : chHours * 60 + chMins;

      ch.duration.hours = chHours;
      ch.duration.minutes = chMins;
      ch.name = ch.name || "";
      ch.topic = ch.topic || "";
      ch.videoUrl = ch.videoUrl || "";

      return ch;
    });

    const lecHours = toNumber(lec.duration.hours);
    const lecMins = toNumber(lec.duration.minutes);
    const lectureOwnMinutes = lecHours * 60 + lecMins;
    const chaptersMinutes = lec.chapters.reduce((s, c) => s + toNumber(c.totalMinutes, 0), 0);

    lec.totalMinutes = lectureOwnMinutes + chaptersMinutes;

    lec.duration.hours = lecHours;
    lec.duration.minutes = lecMins;

    totalCourseMinutes += lec.totalMinutes;
    lec.title = lec.title || "Untitled lecture";

    return lec;
  });

  courseObj.totalDuration = courseObj.totalDuration || {};
  courseObj.totalDuration.hours = Math.floor(totalCourseMinutes / 60);
  courseObj.totalDuration.minutes = totalCourseMinutes % 60;
  courseObj.totalLectures = Array.isArray(courseObj.lectures) ? courseObj.lectures.length : 0;

  return courseObj;
};

// create image url from stored value;
const makeImageAbsolute = (rawImage, req) => {
  if (!rawImage) return "";
  const image = String(rawImage || "");
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) {
    return `${req.protocol}://${req.get("host")}${image}`;
  }
  // if file stored as "uploads/filename" or just "filename"
  if (image.startsWith("uploads/")) {
    return `${req.protocol}://${req.get("host")}/${image}`;
  }
  return `${req.protocol}://${req.get("host")}/uploads/${image}`;
};

// to get public courses
export const getPublicCourses = async (req, res) => {
    try {
        const { home, type = 'all', limit } = req.query;
        let filter = {};

        if (home === 'true') {
            filter.courseType = 'top';
        }
        else if (type === 'top') {
            filter.courseType = 'top';
        }
        else if (type === 'regular') {
            filter.courseType = 'regular'
        }

        // CORRECTED: Use Mongoose .sort() instead of JS .toSorted()
        // and build the query object to allow .limit() chaining
        let query = Course.find(filter).sort({ createdAt: -1 });

        if (home === 'true') {
            query = query.limit(Number(limit || 8));
        }
        else if (limit) {
            query = query.limit(Number(limit));
        }

        const courses = await query.lean();

        const mapped = courses.map((c) => {
            const imageUrl = makeImageAbsolute(c.image || "", req);
            
            // Grab the overview
            let cleanOverview = c.overview || c.description || "";
            
            // 1. Strip ALL HTML tags (this instantly removes images, bold tags, etc.)
            cleanOverview = cleanOverview.replace(/<[^>]+>/g, ' ').trim();
            
            // 2. Truncate to 150 characters for a clean, fast list preview
            if (cleanOverview.length > 150) {
                cleanOverview = cleanOverview.substring(0, 150) + '...';
            }

            return {
                ...c,
                image: imageUrl,
                overview: cleanOverview,
                description: cleanOverview 
            }
        });
        return res.json({
            success: true,
            items: mapped
        });
    }

    catch (err) {
        console.error('GetPublicCourses error:', err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

// get Courses
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 }).lean();
        const mapped = courses.map((c) => {
            let cleanOverview = c.overview || c.description || "";
            
            cleanOverview = cleanOverview.replace(/<[^>]+>/g, ' ').trim();
            
            if (cleanOverview.length > 150) {
                cleanOverview = cleanOverview.substring(0, 150) + '...';
            }

            return {
                ...c,
                image: makeImageAbsolute(c.image || "", req),
                overview: cleanOverview,
                description: cleanOverview
            }
        });
        return res.json({
            success: true,
            courses: mapped
        });
    }

    catch (err) {
        console.error('GetCourses error:', err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

// get course by id
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id).lean();
        if (!course) return res.status(404).json({
            success: false,
            error: 'Not found'
        });

        course.image = makeImageAbsolute(course.image || "", req);
        return res.json({
            success: true,
            course
        });
    }

      catch (err) {
        console.error('GetCoursesById error:', err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

//  to create a course
export const createCourse = async (req,res) => {
    try {
    const body = req.body || {};

    // image handling: store relative path so static serving works consistently
    const imagePath = req.file ? `/uploads/${req.file.filename}` : (body.image || "");

    // parse price
    const priceParsed = parseJSONSafe(body.price) ?? (body.price || {});
    const price = {
      original: toNumber(priceParsed.original ?? body["price.original"] ?? 0),
      sale: toNumber(priceParsed.sale ?? body["price.sale"] ?? 0),
    };

    // lectures
    let lectures = parseJSONSafe(body.lectures) ?? body.lectures ?? [];
    if (!Array.isArray(lectures)) lectures = [];

    // normalize lectures & chapters
    lectures = lectures.map((lec) => {
      const lecture = { ...lec };
      lecture.duration = lecture.duration || {};
      lecture.duration.hours = toNumber(lecture.duration.hours);
      lecture.duration.minutes = toNumber(lecture.duration.minutes);

      lecture.chapters = Array.isArray(lecture.chapters) ? lecture.chapters : [];
      lecture.chapters = lecture.chapters.map((ch) => ({
        ...ch,
        duration: {
          hours: toNumber(ch.duration?.hours),
          minutes: toNumber(ch.duration?.minutes),
        },
        totalMinutes: toNumber(ch.totalMinutes, 0),
        videoUrl: ch.videoUrl || "",
        name: ch.name || "",
        topic: ch.topic || "",
      }));

      return {
        ...lecture,
        title: lecture.title || "Untitled lecture",
        totalMinutes: toNumber(lecture.totalMinutes, 0),
      };
    });

    const courseObj = {
      name: body.name || "",
      teacher: body.teacher || "",
      image: imagePath,
      rating: toNumber(body.rating, 0),
      pricingType: body.pricingType || "free",
      price,
      overview: body.overview || body.description || "",
      totalDuration:
        parseJSONSafe(body.totalDuration) ??
        { hours: toNumber(body["totalDuration.hours"]), minutes: toNumber(body["totalDuration.minutes"]) },
      totalLectures: toNumber(body.totalLectures, lectures.length),
      lectures,
      courseType: body.courseType || "regular",
      category: body.category || null,
      createdBy: body.createdBy || null,
    };
    
    computeDerivedFields(courseObj);
    const course = new Course(courseObj);
    await course.save();

    const returned = course.toObject();
    returned.image = makeImageAbsolute(returned.image || "", req);
    return res.status(201).json({
        success: true,
        course: returned
    });

    } 
    
      catch (err) {
        console.error('createCourse error:', err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

// to delete a course by id
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) return res.status(404).json({
            success: false,
            error: 'Not found'
        });

        // remove upload file from the local uploads folder
        try {
            if (course.image && !course.image.startsWith('http')) {
                const filePath = path.join(process.cwd(), course.image.startsWith("/") ? course.image.slice(1) : course.image);

                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        } catch (e) {
            // ignore any errors
        }
        
        await course.deleteOne();
        
        // <-- ADDED THIS: Also delete associated bookings when a course is deleted -->
        await Booking.deleteMany({ course: id });

        return res.json({
            success: true,
            message: 'Course Deleted.'
        });
    }

         catch (err) {
        console.error('deleteCourse error:', err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

    // for rate course by user
    // for rate course by user
export const rateCourse = async (req, res) => {
    try {
        const { userId } = getAuth(req) || {};
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }
        const { courseId } = req.params;
        const { rating: rawRating, comment = "" } = req.body;
        const rating = Number(rawRating);

        if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be a number between 1 and 5'
            });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found.'
            });
        }

           // Find existing rating by this Clerk userId (ratings store userId as string)
    const idx = (course.ratings || []).findIndex(r => String(r.userId) === String(userId));

    if (idx >= 0) {
      // update existing rating
      course.ratings[idx].rating = rating;
      if (typeof comment === "string" && comment.trim().length) {
        course.ratings[idx].comment = comment.trim();
      }
      course.ratings[idx].updatedAt = new Date();
    } else {
      // push new rating object — ensure userId present
      course.ratings.push({
        userId,
        rating,
        comment: typeof comment === "string" ? comment.trim() : ""
      });
    }
    // here if rating is given by user it will update else it will  create a new rating

    // Recompute aggregates (avgRating, totalRatings)
    const ratingsArr = course.ratings || [];
    const totalRatings = ratingsArr.length;
    const sum = ratingsArr.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    const avgRating = totalRatings === 0 ? 0 : Number((sum / totalRatings).toFixed(2));

    course.totalRatings = totalRatings;
    course.avgRating = avgRating; //if a particular course has multi user rating then it will compute

        await course.save();
        return res.json({
            success: true,
            avgRating: course.avgRating,
            totalRatings: course.totalRatings,
            myRating: { userId, rating }
        });
    }

        catch (err) {
        console.error("rateCourse error:", err);
        // if a mongoose validation error includes path ratings.0.userId you can surface it
        if (err && err.name === "ValidationError") {
        return res.status(400).json({ success: false, message: err.message });
        }
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

// get myRating
export const getMyRating = async (req, res) => {
    try {
        const { userId } = getAuth(req) || {};
        if (!userId) return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });

        const { courseId } = req.params;
        const course = await Course.findById(courseId).lean();
        if (!course) return res.status(404).json({
            success: false,
            message: "Course not found"
        });

        const my = (course.ratings || []).find(r => String(r.userId) === String(userId)) || null;
        return res.json({
            success: true,
            myRating: my ? { rating: my.rating, comment: my.comment } : null
        });
    }

         catch (err) {
        console.error('getMyRating error:', err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

// to update an existing course
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};

        // 1. Check if course exists
        const existingCourse = await Course.findById(id);
        if (!existingCourse) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }

        // 2. Handle Image (If new file uploaded, use it. Otherwise, keep existing)
        const imagePath = req.file ? `/uploads/${req.file.filename}` : (body.image || existingCourse.image);

        // 3. Parse Price (Using your existing helpers)
        const priceParsed = parseJSONSafe(body.price) ?? (body.price || {});
        const price = {
            original: toNumber(priceParsed.original ?? body["price.original"] ?? existingCourse.price?.original ?? 0),
            sale: toNumber(priceParsed.sale ?? body["price.sale"] ?? existingCourse.price?.sale ?? 0),
        };

        // 4. Parse Lectures & Chapters
        let lectures = parseJSONSafe(body.lectures) ?? body.lectures ?? [];
        if (!Array.isArray(lectures)) lectures = [];

        lectures = lectures.map((lec) => {
            const lecture = { ...lec };
            lecture.duration = lecture.duration || {};
            lecture.duration.hours = toNumber(lecture.duration.hours);
            lecture.duration.minutes = toNumber(lecture.duration.minutes);

            lecture.chapters = Array.isArray(lecture.chapters) ? lecture.chapters : [];
            lecture.chapters = lecture.chapters.map((ch) => ({
                ...ch,
                duration: {
                    hours: toNumber(ch.duration?.hours),
                    minutes: toNumber(ch.duration?.minutes),
                },
                totalMinutes: toNumber(ch.totalMinutes, 0),
                videoUrl: ch.videoUrl || "",
                name: ch.name || "",
                topic: ch.topic || "",
            }));

            return {
                ...lecture,
                title: lecture.title || "Untitled lecture",
                totalMinutes: toNumber(lecture.totalMinutes, 0),
            };
        });

        // 5. Build the updated object
        const courseObj = {
            name: body.name || "",
            teacher: body.teacher || "",
            image: imagePath,
            rating: toNumber(body.rating, existingCourse.rating),
            pricingType: body.pricingType || "free",
            price,
            overview: body.overview || body.description || "",
            totalDuration: parseJSONSafe(body.totalDuration) ?? { 
                hours: toNumber(body["totalDuration.hours"]), 
                minutes: toNumber(body["totalDuration.minutes"]) 
            },
            totalLectures: toNumber(body.totalLectures, lectures.length),
            lectures,
            courseType: body.courseType || "regular",
            category: body.category || existingCourse.category,
        };

        // 6. Calculate totals safely
        computeDerivedFields(courseObj);

        // 7. Update in MongoDB
        const updatedCourse = await Course.findByIdAndUpdate(id, courseObj, { new: true });

        const returned = updatedCourse.toObject();
        returned.image = makeImageAbsolute(returned.image || "", req);

        return res.status(200).json({
            success: true,
            course: returned,
            message: "Course updated successfully!"
        });

    } catch (err) {
        console.error('updateCourse error:', err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};