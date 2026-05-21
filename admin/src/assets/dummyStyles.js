// assets/dummyStyles.js
export const dashboardStyles = {
  // Layout styles
  pageContainer: "min-h-screen pt-25 bg-gradient-to-br from-gray-50 to-gray-100 font-serif relative",
  backgroundPattern: "absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.05)_25%,rgba(68,68,68,0.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,0.05)_75%)] bg-[length:10px_10px] opacity-20",
  contentContainer: "relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 py-10",

  // Header styles
  headerContainer: "mb-8 text-center sm:text-left animate-fade-in",
  headerTitle: "text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 tracking-tight",
  headerSubtitle: "text-gray-600 text-base sm:text-lg",

  // Stats section
  statsGrid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10",
  statCard: "bg-gradient-to-br from-sky-50 to-sky-300 rounded-full md:p-3 lg:p-5 xl:p-5 shadow-lg p-3 sm:p-6 transform transition-all duration-300 animate-slide-up",
  statTitle: "text-gray-600 text-sm sm:text-base font-medium mb-1",
  statValue: "text-2xl sm:text-3xl font-bold text-gray-800",
  statIconContainer: (color) => `${color} p-3 rounded-full text-white`,
  statIcon: "w-5 h-5 sm:w-6 sm:h-6",

  // Courses section
  coursesContainer: "bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in",
  coursesHeader: "px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
  coursesTitleContainer: "flex items-center",
  coursesIcon: "w-6 h-6 mr-2 text-purple-600",
  coursesTitle: "text-xl sm:text-2xl font-bold text-gray-800",

  // Search bar
  searchContainer: "relative w-full sm:w-auto",
  searchIcon: "w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2",
  searchInput: "pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64",

  // Table styles
  tableContainer: "overflow-x-auto",
  table: "min-w-full",
  tableHead: "bg-gray-50",
  tableHeader: "px-4 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-700",
  tableBody: "divide-y divide-gray-200",
  tableRow: "hover:bg-gray-50 transition-colors duration-200 animate-fade-in",

  // Course item styles
  courseImage: "w-10 h-8 sm:w-12 sm:h-10 rounded-lg object-cover mr-3 sm:mr-4 shadow-sm",
  courseName: "font-medium px-3 md:px-0 lg:px-0 xl:px-0 text-gray-900 text-sm sm:text-base",
  courseInstructor: "text-xs px-3 md:px-0 lg:px-0 xl:px-0 sm:text-sm text-gray-500",
  studentsCell: "px-9 sm:px-6 py-3 sm:py-4",
  studentsText: "font-medium text-sm sm:text-base",
  priceCell: "px-4 sm:px-6 py-3 sm:py-4 text-gray-900 font-semibold text-sm sm:text-base",
  purchasesContainer: "flex items-center text-gray-700",
  purchasesIcon: "w-4 h-4 mr-2 text-green-600",
  purchasesText: "text-sm sm:text-base",
  earningsCell: "px-4 sm:px-6 py-3 sm:py-4 text-green-600 font-semibold text-sm sm:text-base",

  // Empty state
  emptyState: "text-center py-12",
  emptyIcon: "w-12 h-12 text-gray-300 mx-auto mb-4",
  emptyText: "text-gray-500 text-base sm:text-lg",
  clearButton: "mt-2 text-purple-600 hover:text-purple-700 font-medium"
};

// assets/listStyles.js
export const listStyles = {
  // Layout styles
  pageContainer: "min-h-screen bg-gradient-to-br from-white to-sky-50 py-6 sm:py-8 lg:py-10 px-3 sm:px-4 lg:px-6",
  contentContainer: "max-w-6xl pt-20 sm:pt-24 lg:pt-25 font-[pacifico] mx-auto",

  // Header styles
  headerContainer: "text-center mb-6 sm:mb-8",
  headerTitle: "text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sky-500 mb-1",
  headerSubtitle: "text-sky-700 text-sm sm:text-base",

  // Search styles
  searchContainer: "mb-6 sm:mb-8",
  searchInputContainer: "relative max-w-md mx-auto",
  searchIcon: "w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2",
  searchInput: "w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white shadow-sm text-sm sm:text-base",

  // Course list styles
  courseList: "space-y-3 sm:space-y-4",
  courseCard: "bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg",
  courseCardContent: "p-4 sm:p-6",

  // Course header styles
  courseHeader: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4",
  courseImageContainer: "flex items-start gap-3 sm:gap-4 flex-1",
  courseImage: "w-16 h-12 sm:w-20 sm:h-16 lg:w-24 lg:h-16 rounded-lg sm:rounded-xl object-cover shadow-sm flex-shrink-0",
  courseInfo: "flex-1 min-w-0",
  courseTitleRow: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2",
  courseTitle: "text-lg sm:text-xl font-semibold text-gray-800 mb-1 break-words",
  courseInstructor: "text-gray-500 text-sm sm:text-base mb-2",
  
  // Course badge styles
  courseBadge: (courseType) => 
    `px-2 py-0.5 mb-4 text-xs font-semibold rounded-full select-none self-start lg:mt-8 xl:mt-8 sm:self-auto ${
      courseType === 'top' 
        ? 'bg-amber-100 text-amber-800' 
        : 'bg-gray-100 text-gray-700'
    }`,

  // Course meta styles
  courseMeta: "flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500",
  metaItem: "flex items-center gap-1",
  metaIcon: "w-3 h-3 sm:w-4 sm:h-4",

  // Course actions styles
  courseActions: "flex items-center justify-between lg:justify-end gap-3 sm:gap-4 mt-2 sm:mt-0",
  priceContainer: "text-right",
  priceFree: "text-xl sm:text-2xl font-bold text-green-600",
  priceRegular: "text-xl sm:text-2xl font-bold text-gray-800",
  originalPrice: "text-xs sm:text-sm text-gray-400 line-through",
  actionButtons: "flex items-center gap-1 sm:gap-2",
  toggleButton: "p-1.5 sm:p-2 text-sky-300 hover:text-white hover:bg-sky-500 rounded-full cursor-pointer transition-colors duration-200 flex items-center",
  deleteButton: "p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200",
  actionIcon: "w-4 h-4 sm:w-5 sm:h-5",

  // Expanded course details
  expandedCourse: "border-t border-gray-100 bg-sky-50 p-4 sm:p-6 animate-fade-in",
  descriptionSection: "mb-4 sm:mb-6",
  descriptionTitle: "text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3",
  descriptionText: "text-gray-600 leading-relaxed text-sm sm:text-base",
  contentSection: "space-y-2 sm:space-y-3",

  // Lecture styles
  lectureCard: "bg-white rounded-lg border border-gray-100 overflow-hidden",
  lectureHeader: "p-3 sm:p-4",
  lectureToggleButton: "flex items-center justify-between w-full text-left gap-2 sm:gap-3",
  lectureInfo: "flex items-center gap-2 sm:gap-3 flex-1 min-w-0",
  lectureTitle: "font-semibold text-gray-800 text-sm sm:text-base break-words",
  lectureMeta: "flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mt-1",
  lectureToggleIcon: (isExpanded) => 
    `w-4 h-4 sm:w-5 sm:h-5 text-blue-400 cursor-pointer transition-transform duration-200 flex-shrink-0 ${
      isExpanded ? 'rotate-180' : ''
    }`,

  // Chapter styles
  expandedLecture: "border-t border-gray-100 bg-sky-50 p-3 sm:p-4",
  chapterList: "space-y-2 sm:space-y-3",
  chapterCard: "flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-gray-100",
  chapterContent: "flex-1 min-w-0",
  chapterHeader: "flex items-start gap-2 sm:gap-3",
  chapterIcon: "p-1.5 sm:p-2 bg-sky-100 rounded-full shadow-xs flex-shrink-0 mt-0.5",
  chapterIconSvg: "w-3 h-3 sm:w-4 sm:h-4 text-sky-500",
  chapterDetails: "flex-1 min-w-0",
  chapterTitle: "font-medium text-gray-800 text-sm sm:text-base break-words hover:underline block",
  chapterTopic: "text-xs sm:text-sm text-gray-600 mt-1 break-words",
  chapterMeta: "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-2 text-xs text-gray-500",
  chapterDuration: "flex items-center gap-1",
  chapterVideoLink: "text-sky-600 break-all hover:underline",

  // Empty state styles
  emptyState: "text-center py-8 sm:py-12",
  emptyIcon: "w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4",
  emptyText: "text-gray-500 text-base sm:text-lg mb-2",
  clearButton: "text-sky-600 hover:text-sky-700 font-medium text-sm sm:text-base",

  // Star rating styles
  starRating: "flex items-center gap-1",
  starFull: "w-3 h-3 sm:w-4 sm:h-4 text-yellow-400",
  starHalf: "w-3 h-3 sm:w-4 sm:h-4 text-yellow-400",
  starEmpty: "w-3 h-3 sm:w-4 sm:h-4 text-gray-300"
};


// assets/addPageStyles.js
export const addPageStyles = {
  // Layout styles
  pageContainer: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6",
  contentContainer: "max-w-4xl pt-30 font-serif mx-auto",

  // Header styles
  headerContainer: "text-center mb-8 sm:mb-10 lg:mb-12",
  headerGradient: "relative inline-block",
  headerGlow: "absolute -inset-2 sm:-inset-3 lg:-inset-4 bg-gradient-to-r from-sky-600 to-sky-500 rounded-2xl blur-lg opacity-20",
  headerTitle: "relative text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent mb-3 sm:mb-4",
  headerSubtitle: "text-base sm:text-lg lg:text-xl text-gray-600 font-light max-w-2xl mx-auto px-2",

  // Form styles
  form: "space-y-6 sm:space-y-8",

  // Card styles
  card: "bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/50 shadow-xl sm:shadow-2xl",
  courseTypeCard: "shadow-blue-100/50",
  courseInfoCard: "shadow-blue-100/50", 
  lecturesCard: "shadow-purple-100/50",

  // Card header styles
  cardHeader: "flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8",
  cardIconContainer: "p-2 sm:p-3 bg-gradient-to-br from-sky-300 to-sky-600 rounded-full shadow-lg",
  cardIcon: "text-white",
  cardTitle: "text-xl sm:text-2xl font-bold text-gray-800",
  cardSubtitle: "text-sm sm:text-base text-gray-600",

  // Course type selection
  courseTypeGrid: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6",
  courseTypeLabel: (isSelected, type) => 
    `flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-full cursor-pointer transition-all duration-300 ${
      isSelected
        ? type === 'top' 
          ? "border-orange-500 bg-orange-50 shadow-md"
          : "border-blue-500 bg-blue-50 shadow-md"
        : "border-gray-200 hover:border-gray-300"
    }`,
  courseTypeInput: "w-4 h-4 sm:w-5 sm:h-5",
  courseTypeText: "text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2",

  // Form grid
  formGrid: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6",
  formFullWidth: "lg:col-span-2",

  // Input styles
  inputContainer: "space-y-2",
  inputLabel: "text-gray-700 font-semibold flex items-center gap-2 text-sm sm:text-base",
  inputIcon: "text-blue-500",
  input: "w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-sm sm:text-base",
  textarea: "w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm resize-none text-sm sm:text-base",

  // Duration grid
  durationGrid: "grid grid-cols-2 gap-2 sm:gap-3",
  durationHelper: "text-xs text-gray-500 mt-1 block",
  durationFormatted: "text-sm text-blue-600 font-medium",

  // Star rating
  starRating: "flex gap-1",
  starButton: "text-2xl transition-colors duration-200 focus:outline-none hover:scale-110 transform",
  starFull: "text-yellow-400 fill-current",
  starEmpty: "text-gray-300 hover:text-yellow-400",

  // File upload
  uploadContainer: "flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4",
  uploadLabel: "flex-1 w-full cursor-pointer group",
  uploadInput: "hidden",
  uploadBox: "w-full px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-br from-white to-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group-hover:border-blue-400 group-hover:bg-blue-50 group-hover:text-blue-600 shadow-sm text-sm sm:text-base",
  uploadIcon: "transition-transform group-hover:scale-110",
  imagePreview: "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white shadow-lg ring-2 ring-blue-200 flex-shrink-0",

  // Select input
  select: "w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-200 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm appearance-none bg-gradient-to-b from-white to-gray-50 text-sm sm:text-base",

  // Lectures header
  lecturesHeader: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8",
  addLectureButton: "bg-gradient-to-r from-sky-300 to-sky-500 cursor-pointer hover:from-sky-400 hover:to-sky-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 transform shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center",

  // Lectures list
  lecturesList: "space-y-3 sm:space-y-4",
  lectureCard: "bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300",
  lectureHeader: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4",
  lectureContent: "flex items-center gap-3 sm:gap-4 flex-1",
  lectureToggleButton: "p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-sky-400 cursor-pointer transition-colors duration-200 flex-shrink-0",
  lectureInfo: "flex-1 min-w-0",
  lectureTitle: "text-lg sm:text-xl font-bold text-gray-800 break-words",
  lectureMeta: "text-gray-600 flex items-center gap-2 mt-1 text-sm sm:text-base",
  lectureActions: "flex items-center gap-2 justify-end sm:justify-start",
  addChapterButton: "bg-gradient-to-r from-sky-300 to-sky-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md text-xs sm:text-sm",
  deleteButton: "p-1.5 sm:p-2 text-red-400 hover:text-red-600 cursor-pointer hover:bg-red-50 rounded-full transition-colors duration-200 ml-1 sm:ml-2",

  // Chapters list
  chaptersContainer: (isExpanded) => 
    `ml-0 sm:ml-10 lg:ml-12 space-y-2 sm:space-y-3 border-l-0 sm:border-l-2 border-purple-200 pl-0 sm:pl-4 lg:pl-6 mt-3 sm:mt-0 ${
      isExpanded ? 'block' : 'hidden'
    }`,
  chapterCard: "bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-100 shadow-sm",
  chapterContent: "flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0",
  chapterInfo: "flex-1 min-w-0",
  chapterTitle: "text-gray-800 font-semibold text-sm sm:text-base break-words",
  chapterTopic: "text-gray-600 text-xs sm:text-sm mt-1 break-words",
  chapterMeta: "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2",
  chapterDuration: "text-purple-600 text-xs sm:text-sm flex items-center gap-1 font-medium",
  chapterUrl: "text-blue-600 text-xs sm:text-sm font-medium break-all max-w-full sm:max-w-xs",
  chapterDeleteButton: "p-1 text-red-400 hover:text-red-600 cursor-pointer hover:bg-red-50 rounded-full transition-colors duration-200 ml-0 sm:ml-4 self-end sm:self-auto mt-2 sm:mt-0",

  // Submit button
  submitContainer: "text-center",
  submitButton: "bg-gradient-to-r from-sky-300 to-sky-600 cursor-pointer text-white px-8 sm:px-12 lg:px-16 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform shadow-2xl hover:shadow-3xl relative overflow-hidden group w-full sm:w-auto",

  // Modal styles
  modalOverlay: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50",
  modal: "bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-md w-full border border-white/50 shadow-2xl mx-2",
  modalHeader: "flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6",
  modalIconContainer: (color) => `p-2 ${color} rounded-full`,
  modalTitle: "text-xl sm:text-2xl font-bold text-gray-800",
  modalContent: "space-y-3 sm:space-y-4",
  modalActions: "flex gap-2 sm:gap-3 pt-3 sm:pt-4",
  modalButton: "flex-1 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base",
  modalButtonPrimary: "bg-gradient-to-r from-sky-300 to-sky-600 cursor-pointer text-white",
  modalButtonSecondary: "bg-red-200 text-gray-700 cursor-pointer",
  modalButtonCompact: "flex-1 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base",
  modalButtonCompactPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:scale-105 cursor-pointer",
  modalButtonCompactSecondary: "bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer",

  // Chapters list in modal
  chaptersList: "space-y-2 max-h-24 sm:max-h-32 overflow-y-auto",
  chapterPreview: "bg-blue-50 rounded-lg p-2 sm:p-3 text-xs sm:text-sm border border-blue-100",
  chapterPreviewTitle: "font-medium text-gray-800",
  chapterPreviewDuration: "text-blue-600 text-xs"
};


// assets/navbarStyles.js
export const navbarStyles = {
  // Main navbar styles
  nav: (isVisible) => 
    `fixed top-6 left-0 right-0 z-50 pointer-events-auto transition-transform duration-500 ease-in-out ${
      isVisible ? "translate-y-0" : "-translate-y-24"
    }`,
  navContainer: "w-full flex justify-center",
  navInner: (isMenuOpen) => 
    `relative w-[90%] rounded-xl xl:rounded-full md:rounded-full sm:w-[90%] md:w-[95%] lg:w-[70%] xl:w-[90%] max-w-6xl mx-auto lg:rounded-full px-4 py-1 md:py-3 lg:py-3 xl:py-3 sm:py-3 backdrop-blur-md bg-white/60 border border-white/30 shadow-xl shadow-sky-600/8 transition-all duration-500`,

  // Glow effect
  glowEffect: "pointer-events-none absolute -inset-1 rounded-3xl blur-[18px] opacity-30 bg-gradient-to-r from-blue-400 to-cyan-300 mix-blend-screen",

  // Navbar content
  navbarContent: "flex items-center justify-between gap-4 relative z-10",

  // Logo section
  logoContainer: "flex items-center gap-3 select-none",
  logoImage: "w-12 h-12 object-contain",
  logoText: "text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-700 to-cyan-600",

  // Desktop navigation
  desktopNav: "hidden md:flex items-center justify-center flex-1",
  desktopNavInner: "inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full p-1 shadow-sm",
  desktopNavItem: (isActive) => 
    `relative flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full font-medium transition-all duration-300 transform group overflow-hidden ${
      isActive
        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
        : 'text-slate-700 hover:text-sky-700'
    }`,
  desktopNavIcon: "w-4 h-4",
  desktopNavText: "text-sm",
  desktopActiveGlow: "absolute -inset-px rounded-full pointer-events-none blur-sm opacity-80 bg-gradient-to-r from-blue-400 to-cyan-300 mix-blend-screen",

  // Mobile menu toggle
  mobileToggleContainer: "flex items-center gap-3 md:hidden",
  mobileToggleButton: "w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-sm",
  mobileToggleIcon: "w-5 h-5 text-slate-700",

  // Mobile menu
  mobileMenu: (isMenuOpen) => 
    `md:hidden mt-3 transition-[max-height,opacity,padding] duration-350 ease-in-out overflow-hidden ${
      isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
    }`,
  mobileMenuInner: "flex flex-col gap-2",
  mobileMenuItem: (isActive) => 
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow'
        : 'bg-white/60 hover:bg-white/80 text-slate-700'
    }`,
  mobileMenuIcon: "w-5 h-5",
  mobileMenuText: "font-medium"
};

// assets/bookingsStyles.js
export const bookingsStyles = {
  // Layout styles
  pageContainer: "min-h-screen pt-35 bg-sky-50 font-serif p-6",
  contentContainer: "max-w-6xl mx-auto",

  // Header styles
  headerContainer: "mb-8",
  headerTitle: "text-3xl font-bold text-sky-500 mb-2",
  headerSubtitle: "text-sky-700",

  // Search styles
  searchContainer: "p-4 mb-8",
  searchInputContainer: "relative max-w-md",
  searchIcon: "absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 h-5 w-5",
  searchInput: "w-full pl-10 pr-4 py-2 border border-sky-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 bg-sky-50 text-sky-900",

  // Bookings grid
  bookingsGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",

  // Booking card
  bookingCard: "bg-white rounded-xl shadow-sm border border-sky-200 p-6 hover:shadow-md transition",

  // Student section
  studentSection: "flex items-center mb-4",
  studentIconContainer: "bg-sky-100 p-2 rounded-full",
  studentIcon: "h-6 w-6 text-sky-600",
  studentInfo: "ml-3",
  studentName: "font-semibold text-sky-900 text-lg",
  purchaseDate: "text-sm text-sky-600",

  // Course details
  courseDetails: "space-y-3",
  detailItem: "flex items-center",
  detailIcon: "h-4 w-4 text-sky-500 mr-2",
  detailLabel: "text-sky-800 font-medium",
  detailValue: "ml-2 text-sky-900 truncate",
  priceValue: "ml-2 text-green-600 font-semibold",

  // Status
  statusContainer: "mt-4 pt-4 border-t border-sky-100",
  statusBadge: "inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800",

  // Empty state
  emptyState: "text-center py-12",
  emptyContainer: "bg-white rounded-lg p-8 max-w-md mx-auto",
  emptyIcon: "h-12 w-12 text-sky-400 mx-auto mb-4",
  emptyTitle: "text-lg font-semibold text-sky-900 mb-2",
  emptyText: "text-sky-600"
};