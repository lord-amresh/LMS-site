import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  topic: {
    type: String,
    required: true
  },
  duration: {
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
  },
  totalMinutes: { type: Number, default: 0 },
  videoUrl: {
    type: String,
    required: true
  },
}, { _id: true });

// lecture Schema
const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: {
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
  },
  totalMinutes: { type: Number, default: 0 },
  chapters: [chapterSchema],
}, { _id: true });

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    teacher: { type: String, required: true },
    image: { type: String },
    ratings: [
      {
        userId: { type: String, required: true },
        rating: { type: Number, required: true, min: 0, max: 5 },
        comment: { type: String, default: "" },
        updatedAt: { type: Date, default: null },
      },
    ],
    avgRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },

    pricingType: { type: String, enum: ["free", "paid"], default: "free" },
    price: {
      original: { type: Number, default: 0 },
      sale: { type: Number, default: 0 },
    },
    overview: { type: String },
    totalDuration: {
      hours: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
    },
    totalLectures: { type: Number, default: 0 },
    lectures: [lectureSchema],
    courseType: { type: String, enum: ["regular", "top"], default: "regular" },
  },
  { timestamps: true }
);


// for getting the total time and pre save that
courseSchema.pre("save", async function () {
  if (!Array.isArray(this.lectures)) this.lectures = [];

  let courseTotalMinutes = 0;

  this.lectures = this.lectures.map((lecture) => {
    lecture = lecture || {};
    lecture.duration = lecture.duration || {};
    lecture.chapters = Array.isArray(lecture.chapters) ? lecture.chapters : [];

    // calculate each chapter total and normalize
    let chaptersSum = 0;
    lecture.chapters = lecture.chapters.map((chapter) => {
      chapter = chapter || {};
      chapter.duration = chapter.duration || {};
      const chHours = Number(chapter.duration.hours) || 0;
      const chMins = Number(chapter.duration.minutes) || 0;
      const chTotal = Math.max(0, chHours * 60 + chMins);
      chapter.totalMinutes = chTotal;
      chapter.duration.hours = Math.floor(chHours);
      chapter.duration.minutes = Math.floor(chMins);
      chapter.name = chapter.name || "";
      chapter.topic = chapter.topic || "";
      chapter.videoUrl = chapter.videoUrl || "";
      chaptersSum += chTotal;
      return chapter;
    });

    const lecHours = Number(lecture.duration.hours) || 0;
    const lecMins = Number(lecture.duration.minutes) || 0;
    const lectureOwnMinutes = Math.max(0, lecHours * 60 + lecMins);

    const lectureTotalMinutes = lecture.chapters.length > 0 ? chaptersSum : lectureOwnMinutes;

    lecture.totalMinutes = lectureTotalMinutes;
    lecture.duration.hours = Math.floor(lectureTotalMinutes / 60);
    lecture.duration.minutes = lectureTotalMinutes % 60;

    lecture.title = lecture.title || "Untitled lecture";

    courseTotalMinutes += lectureTotalMinutes;
    return lecture;
  });

  this.totalDuration = this.totalDuration || {};
  this.totalDuration.hours = Math.floor(courseTotalMinutes / 60);
  this.totalDuration.minutes = courseTotalMinutes % 60;

  this.totalLectures = Array.isArray(this.lectures) ? this.lectures.length : 0;
});
// for timing it will calculate the time and save it for future.

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default Course;