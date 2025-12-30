import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    welcomeBack: 'Welcome Back',
    signInToAccount: 'Sign in to your Saudi Arabia Olympics account',
    emailAddress: 'Email Address',
    enterEmail: 'Enter your email',
    password: 'Password',
    enterPassword: 'Enter your password',
    signIn: 'Sign In',
    signingIn: 'Signing In...',
    dontHaveAccount: "Don't have an account?",
    signUp: 'Sign up',
    demoAccounts: 'Demo Accounts:',
    superAdmin: 'Super Admin',
    entityAdmin: 'Entity Admin',
    joinOlympics: 'Join Saudi Arabia Olympics',
    createAccount: 'Create your entity account',
    yourName: 'Your Name',
    enterFullName: 'Enter your full name',
    entityName: 'Entity Name',
    enterEntityName: 'Enter entity name',
    phoneNumber: 'Phone Number',
    enterPhone: 'Enter phone number',
    entityAddress: 'Entity Address',
    enterEntityAddress: 'Enter entity address',
    confirmPassword: 'Confirm Password',
    confirmYourPassword: 'Confirm your password',
    createAccountBtn: 'Create Account',
    creatingAccount: 'Creating Account...',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    invalidCredentials: 'Invalid credentials. Please try again.',
    passwordsDoNotMatch: 'Passwords do not match',
    passwordMinLength: 'Password must be at least 6 characters',
    accountCreationFailed: 'Failed to create account. Please try again.',
    saudiOlympicsSystem: 'Saudi Arabia Olympics System',
    forEntityManagement: 'For Entity Management Platform',
    loadingSystem: 'Loading Saudi Arabia Olympics System...',

    // admin dashboard
    title: 'Super Admin Dashboard',
    subtitle: 'Overview of the Saudi Arabia Olympics management system',
    recentActivities: 'Recent Activities',
    upcomingCompetitions: 'Upcoming Competitions',
    topEntities: 'Top Participating Entity',
    participants: 'Participants',
    competitions: 'Competitions',
    revenue: 'Revenue',
    status: 'Status',
    active: 'Active',
    participantsLabel: 'participants',
    registeredEntity: 'Registered Entity',
    totalParticipants: 'Total Participants',
    activeCompetitions: 'Active Competitions',
    revenueGenerated: 'Revenue Generated',

    // sidenav
    appTitle: 'Saudi Arabia Olympics',
    adminPanel: 'Admin Panel',
    entityPanel: 'Entity Panel',
    logout: 'Logout',

    Dashboard: 'Dashboard',
    Competitions: 'Competitions',
    'Competition Draws': 'Competition Draws',
    Participants: 'Participants',
    'All Participants': 'All Participants',
    Payments: 'Payments',
    Results: 'Results',
    Profile: 'Profile',
    Entities: 'Entities',
    Schedule: 'Schedule',
    Notifications: 'Notifications',

    // NOTIFICATION CENTER ADMIN
    // Page
    notificationCenter: 'Notification Center',
    notificationSubtitle: 'Send announcements and notifications to entities',

    // Header
    communicationCenter: 'Communication Center',
    manageCommunication: 'Manage announcements and notifications',
    createAnnouncement: 'Create Announcement',

    // Quick cards
    allEntities: 'All Entity',
    sendToAll: 'Send to All',
    competitionUpdates: 'Competition Updates',
    pendingEntities: 'Pending Entities',
    sendReminders: 'Send Reminders',

    // List
    recentAnnouncements: 'Recent Announcements',
    filter: 'Filter',
    export: 'Export',

    // Announcement meta
    by: 'By',
    sentTo: 'Sent to',
    entities: 'entities',
    more: 'more',

    // Buttons
    resend: 'Resend',
    resending: 'Resending...',
    edit: 'Edit',
    delete: 'Delete',

    // Errors & loading
    errorLoading: 'Error loading announcements',
    tryAgain: 'Try Again',

    // Modal – Create
    createTitle: 'Create Announcement',
    announcementTitle: 'Announcement Title',
    message: 'Message',
    announcementType: 'Announcement Type',
    targetAudience: 'Target Audience',
    selectEntity: 'Select Entity (Optional)',
    information: 'Information',
    warning: 'Warning / Alert',
    success: 'Success / Achievement',
    allEntity: 'All Entity',
    specificEntity: 'Specific Entity',
    competitionParticipants: 'Competition Participants',

    // Form
    sendEmail: 'Send email notification',
    sendSms: 'Send SMS notification',
    cancel: 'Cancel',
    saveDraft: 'Save as Draft',
    sendAnnouncement: 'Send Announcement',
    sending: 'Sending...',

    // Details modal
    details: 'Details',
    recipients: 'Recipients',
    createdBy: 'Created by',
    date: 'Date',
    type: 'Type',
    allRegisteredEntities: 'All registered entities',

    // NOTIFICATION CENTER END

    // SHEDULED NOTIFICATION 
    scheduleTitle: 'Schedule Management',
    scheduleSubtitle: 'Manage event schedules, venues, and time slots',
    scheduleCompetition: 'Schedule Competition',
    selectDate: 'Select Date',
    sendNotifications: 'Send Notifications',
    noEvents: 'No Competitions Scheduled',
    upcoming: 'Upcoming Competitions',
    venueStatus: 'Venue Status',
    available: 'Available',
    occupied: 'Occupied',
    scheduling: 'Scheduling...',
    competionName: 'Competition Name',
    selectEvent: 'Select an event',
    selectVenue: 'Select venue',
    startTime: 'Start Time',
    endTime: 'End Time',
    specialInstructions: 'Special Instructions',
    errorLoadingSchedule: 'Error loading schedule',
    Occupied: 'Occupied',
    Available: 'Available',
    venue: 'Venue',
    allDayCompetition: 'All Day competition',
    noEventScheduled: 'No events are scheduled for this date',

    // END 

    // Entity management 

    entityTitle: 'Entity Management',
    entitySubtitle: 'Manage entity registrations and approvals',
    entityApproved: 'Approved',
    entityPending: 'Pending',
    entityRejected: 'Rejected',
    entityTotal: 'Total',

    entityEntity: 'Entity',
    entityContact: 'Contact',
    entityLocation: 'Location',
    entityParticipants: 'Participants',
    entityStatus: 'Status',
    entityActions: 'Actions',
    entityParticipating: 'participating',
    entityViewDetails: 'View Details',
    entityApprove: 'Approve',
    entityReject: 'Reject',

    entityNoEntitiesFound: 'No entities found',
    entityTryAdjustingSearch: 'Try adjusting your search or filters',
    entityNoRegisteredEntities: 'No entities have registered yet',

    entityDetails: 'Entity Details',           // AR: 'تفاصيل الكيان'
    entityContactInfo: 'Contact Information', // AR: 'معلومات الاتصال'
    entityStatistics: 'Statistics',           // AR: 'الإحصاءات'
    entityTotalParticipants: 'Total Participants', // AR: 'إجمالي المشاركين'
    entityCompetitions: 'Competitions',       // AR: 'المسابقات'
    entityPayments: 'Payments',               // AR: 'المدفوعات'

    // END

    //RESULT MANAGEMENT

    resultManagementTitle: 'Result Management',                     // AR: 'إدارة النتائج'
    resultManagementSubtitle: 'Create and manage event results and rankings', // AR: 'إنشاء وإدارة نتائج وترتيب المسابقات'
    resultManagementBulkUpload: 'Bulk Upload',                     // AR: 'رفع جماعي'
    resultManagementExportResults: 'Export Results',              // AR: 'تصدير النتائج'
    resultManagementCreateResults: 'Create Results',              // AR: 'إنشاء النتائج'
    resultManagementResultsPublished: 'Results published and available for download', // AR: 'النتائج منشورة ومتاحة للتحميل'
    resultManagementEdit: 'Edit',                                  // AR: 'تعديل'
    resultManagementExport: 'Export',                              // AR: 'تصدير'
    resultManagementPosition: 'Position',                          // AR: 'المركز'
    resultManagementParticipant: 'Participant',                    // AR: 'المشارك'
    resultManagementEntity: 'Entity',                              // AR: 'الكيان'
    resultManagementScore: 'Score',                                // AR: 'النتيجة'
    resultManagementCertificate: 'Certificate',                    // AR: 'الشهادة'
    resultManagementActions: 'Actions',                            // AR: 'إجراءات'
    resultManagementGenerated: 'Generated',                        // AR: 'تم إنشاءها'
    resultManagementNotGenerated: 'Not Generated',                 // AR: 'لم يتم إنشاؤها'
    resultManagementCertificateGeneration: 'Certificate Generation', // AR: 'إنشاء الشهادات'
    resultManagementGenerateTop3: 'Generate certificates for top 3 positions', // AR: 'إنشاء الشهادات لأفضل 3 مراكز'
    resultManagementGenerating: 'Generating...',                   // AR: 'جارٍ الإنشاء...'
    resultManagementGenerateCertificates: 'Generate Certificates', // AR: 'إنشاء الشهادات'
    resultManagementPendingResults: 'Competitions Pending Results', // AR: 'المسابقات التي تنتظر النتائج'
    resultManagementPendingResultsBadge: 'Pending Results',       // AR: 'نتائج معلقة'
    resultManagementCompetitionDate: 'Competition Date',            // AR: 'تاريخ المسابقة'

    resultManagementCreateCompetitionResults: 'Create Competition Results',
    resultManagementSelectCompetition: 'Select Competition',
    resultManagementChooseEvent: 'Choose an event',
    resultManagementResultType: 'Result Type',
    resultManagementRanking: 'Position Ranking',
    resultManagementScoreBased: 'Score Based',
    resultManagementTimeBased: 'Time Based',
    resultManagementPointsBased: 'Points Based',
    resultManagementUploadFile: 'Upload Results File',
    resultManagementUploadHint: 'Click to upload or drag and drop file',
    resultManagementUploadFormats: 'Excel (.xlsx) or CSV files only',
    resultManagementManualEntry: 'Manual Entry',
    resultManagementScoreTime: 'Score / Time',
    resultManagementParticipantPlaceholder: 'Participant name',
    resultManagementEntityPlaceholder: 'Entity name',
    resultManagementScoreTimePlaceholder: 'Score or time',
    resultManagementAddMore: 'Add More Positions',
    resultManagementCancel: 'Cancel',
    resultManagementSaveDraft: 'Save as Draft',
    resultManagementPublishing: 'Publishing...',
    resultManagementPublish: 'Publish Results',

    certificateBackToResults: 'Back to Results',
    certificateGeneratingPdf: 'Generating PDF...',
    certificateDownload: 'Download Certificate',

    certificateTitle: 'CERTIFICATE OF ACHIEVEMENT',
    certificateSystemName: 'Saudi Arabia Olympics System for Entity',

    certificateCertifyText: 'This is to certify that',
    certificateFromEntity: 'from',
    certificateHasAchieved: 'has achieved',
    certificateInThe: 'in the',

    certificateScoreLabel: 'Score',
    certificateTimeLabel: 'Time',
    certificateDateLabel: 'Date',

    certificateCoordinator: 'Competition Coordinator',
    certificatePrincipal: 'Entity Principal',
    certificateIdLabel: 'Certificate ID',

    certificateDetailsTitle: 'Certificate Details',
    certificateParticipant: 'Participant',
    certificateEntity: 'Entity',
    certificateCompetition: 'Competition',
    certificateAchievement: 'Achievement',
    certificateDateIssued: 'Date Issued',

    // END

    // competition management
    competitionManagementTitle: "Competition Management",
    competitionManagementSubtitle: "Create and manage academic and sporting events",
    competitionSearchPlaceholder: "Search events...",
    competitionFiltersAllCategories: "All Categories",
    competitionFiltersAcademic: "Academic",
    competitionFiltersSports: "Sports",
    competitionFiltersAllStatus: "All Status",
    competitionFiltersDraft: "Draft",
    competitionFiltersActive: "Active",
    competitionFiltersCompleted: "Completed",
    competitionCreateButton: "Create Competition",
    competitionTotalCompetitions: "Total Competitions",
    competitionActiveCompetitions: "Active Competitions",
    competitionTotalParticipants: "Total Participants",
    competitionRevenue: "Revenue",
    competitionSpotsRemaining: "spots remaining",
    competitionViewButton: "View",
    competitionNoCompetitionFound: "No Competition found",
    competitionTryAdjustSearchFilters: "Try adjusting your search or filters",
    competitionCreateFirstEvent: "Create your first event to get started",


    competitionCreateTitle: "Create New Competition",
    competitionEditTitle: "Edit Competition",
    competitionName: "Competition Name",
    competitionNamePlaceholder: "Enter event name",
    competitionCategory: "Category",
    competitionType: "Competition Type",
    competitionSelectType: "Select Type",
    competitionTypeIndividual: "Individual",
    competitionTypeTeam: "Team",
    competitionTypeIndividualTeam: "Individual/Team",
    competitionDate: "Competition Date",
    competitionVenue: "Venue",
    competitionVenuePlaceholder: "Enter venue location",
    competitionFee: "Registration Fee",
    competitionFeePlaceholder: "Enter fee amount",
    competitionMaxParticipants: "Max Participants",
    competitionMaxParticipantsPlaceholder: "Enter maximum participants",
    competitionAgeGroups: "Age Groups",
    competitionYears: "years",
    competitionDescription: "Competition Description",
    competitionDescriptionPlaceholder: "Describe the event, its objectives, and what participants can expect",
    competitionCancelButton: "Cancel",
    competitionCreatePublishButton: "Create & Publish",
    competitionUpdateButton: "Update Competition",
    competitionSaving: "Saving...",

    // DRAW MANAGEMENT

    drawManagementTitle: "Draw Management",
    drawManagementSubtitle: "Create and manage tournament brackets",
    createDrawButton: "Create Draw",
    drawSearchPlaceholder: "Search draws...",
    drawFilterAllStatus: "All Status",
    drawFilterUpcoming: "Upcoming",
    drawFilterLive: "Live",
    drawFilterCompleted: "Completed",
    drawParticipants: "participants",
    drawMatches: "matches",
    viewBracket: "View Bracket",
    backToDraws: "Back to draws",
    noDrawsFound: "No draws found",
    tryAdjustingFilters: "Try adjusting your search or filters",
    createFirstDraw: "Create your first tournament draw to get started",
    editDrawTitle: "Edit Draw",
    createDrawTitle: "Create New Draw",
    selectCompetition: "Select competition",
    selectCompetitionPlaceholder: "Select competition",
    tournamentType: "Tournament Type",
    singleElimination: "Single Elimination",
    doubleElimination: "Double Elimination",
    roundRobin: "Round Robin",
    groupStage: "Group Stage",
    startDate: "Start Date",
    venuePlaceholder: "Enter venue",
    updateDrawButton: "Update Draw",

    // END

    // Participants Management
    "participantsTitle": "Participants Overview",
    "participantsSubtitle": "View and manage all participants",
    "academicParticipants": "Academic Participants",
    "sportsParticipants": "Sports Participants",
    "withResults": "Participants with Results",
    "searchParticipantsPlaceholder": "Search participants...",
    "filterAllEntities": "All Schools",
    "filterAllCategories": "All Categories",
    "categoryAcademic": "Academic",
    "categorySports": "Sporting",
    "exportDataButton": "Export Data",
    "tableParticipant": "Participant",
    "tableEntity": "School",
    "tableGrade": "Grade",
    "tableCategory": "Category",
    "tableCompetitions": "Competition",
    "tableResults": "Results",
    "tableActions": "Actions",
    "viewButton": "View",
    "participantModalRegistrations": "Registrations",
    "participantModalStatusRegistered": "Registered",
    "participantModalDocuments": "Documents",
    "participantModalNoDocuments": "No documents uploaded",
    "participantModalResults": "Results",
    "participantModalNoResults": "No results available",
    "downloadCertificate": "Download Certificate",
    "result1st": "1st",
    "result2nd": "2nd",
    "result3rd": "3rd",
    "scoreLabel": "Score",
    "timeLabel": "Time",
    "ageLabel": "Age",
    "noParticipantsFound": "No participants found",

    // END


    "paymentTitle": "Payment Management",
    "paymentSubtitle": "Monitor and manage all entity payments",
    "totalRevenue": "Total Revenue",
    "completed": "Completed",
    "pendingAmount": "Pending Amount",
    "failed": "Failed",
    "searchPlaceholder": "Search entities or invoice numbers...",
    "allStatus": "All Status",
    "allMethods": "All Methods",
    "cardPayment": "Card Payment",
    "bankTransfer": "Bank Transfer",
    "cashPayment": "Cash Payment",
    "exportReport": "Export Report",
    "invoice": "Invoice",
    "entity": "Entity",
    "amount": "Amount",
    "method": "Method",
    "actions": "Actions",
    "noPaymentsFound": "No Payments Found",
    "paymentDetails": "Payment Details",
    "paymentInformation": "Payment Information",
    "statusDetails": "Status & Details",
    "competitionsIncluded": "Competitions Included",
    "downloadInvoice": "Download Invoice",
    "markAsCompleted": "Mark as Completed",

    // END

    // SCHOOL DASHBOARD

    overviewSAOlympics: "Here's an overview of {{schoolName}}'s Saudi Arabia Olympics participation",
    fromLastMonth: "from last month",
    recentResults: "Recent Results",
    quickActions: "Quick Actions",
    addParticipants: "Add Participants",
    registerNewParticipants: "Register new participants",
    browseCompetitions: "Browse Competitions",
    findNewCompetitions: "Find new competitions",
    viewResults: "View Results",
    checkLatestScores: "Check latest scores",
    Registered: "Registered",
    Pending: "Pending",
    Completed: "Completed",
    Failed: "Failed",
    CardPayment: "Card Payment",
    BankTransfer: "Bank Transfer",
    CashPayment: "Cash Payment",

    competitionSelection: "Competition Selection",
    chooseEvents: "Choose events for your entity to participate in",
    selectedCompetitions: "Selected Competitions",
    totalCost: "Total Cost",
    searchEvents: "Search events...",
    allCategories: "All Categories",
    academic: "Academic",
    sporting: "Sporting",
    showAll: "Show All",
    showSelected: "Show Selected",
    maxParticipants: "max participants",
    registered: "registered",
    noEventsFound: "No events found",
    tryAdjusting: "Try adjusting your search or filters",
    noEventsAvailable: "No events are currently available for registration",
    proceedToPayment: "Proceed to Payment",


    competitionDraws: "Competition Draws",
    viewTournamentBrackets: "View tournament brackets and match schedules",
    tournaments: "tournaments",
    searchTournaments: "Search tournaments...",
    allCompetitions: "All Competitions",
    academicCompetitions: "Academic Competitions",
    sportingCompetitions: "Sporting Competitions",
    matchesCompleted: "matches completed",
    backToTournaments: "Back to tournaments",
    noTournamentsFound: "No tournaments found",
    tryAdjustingSearch: "Try adjusting your search or filters",
    tournamentDrawsWillAppear: "Tournament draws will appear here once created by administrators",
    pending: "Pending",

    live: "Live",
    final: "Final",
    semiFinal: "Semi-Final",
    round: "Round",
    match: "Match",
    tbd: "TBD",
    vs: "vs",
    ongoing: "Ongoing",

    participantManagement: "Participant Management",
    participantManagementDesc: "Manage participant registrations and event assignments",
    import: "Import",
    addParticipant: "Add Participant",
    searchParticipants: "Search participants...",
    allGrades: "All Grades",
    grade9: "Grade 9",
    grade10: "Grade 10",
    grade11: "Grade 11",
    grade12: "Grade 12",
    participant: "Participant",
    grade: "Grade",
    category: "Category",
    age: "Age",
    events: "events",
    noParticipants: "No participants found",
    adjustSearch: "Try adjusting your search or filters",

    editParticipant: "Edit Participant",
    addNewParticipant: "Add New Participant",
    participantName: "Participant Name",
    selectGrade: "Select Grade",
    selectCategory: "Select Category",
    selectCompetitions: "Select Competitions",
    participantPhoto: "Participant Photo",
    uploadPhoto: "Upload Photo",
    documentsOptional: "Documents (Optional)",
    uploadDocuments: "Upload Documents",
    documentsSelected: "document(s) selected",
    saving: "Saving...",
    update: "Update",
    add: "Add",


    payment: "Payment",
    paymentDescription: "Complete your payment for selected events",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    processingFee: "Processing Fee",
    total: "Total",
    paymentMethod: "Payment Method",
    card: "Credit / Debit Card",
    mobilePayment: "Mobile Payment",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    cvv: "CVV",
    cardholderName: "Cardholder Name",
    bankDetails: "Bank Transfer Details",
    bankName: "Bank Name",
    accountNumber: "Account Number",
    routingNumber: "Routing Number",
    reference: "Reference",
    bankNote: "Please include the reference number in your transfer description.",
    mobileNumber: "Mobile Number",
    mobileProvider: "Mobile Payment Provider",
    pay: "Pay",


    processingPayment: "Processing Payment",
    processingPaymentDescription: "Please wait while we process your payment...",


    paymentSuccessTitle: "Payment Successful!",
    paymentSuccessDescription: "Your payment of {amount} has been processed successfully.",
    transactionId: "Transaction ID",
    paymentDate: "Date",
    paymentStatus: "Status",
    paymentCompleted: "Completed",

    profileSettingsTitle: "Profile Settings",
    profileSettingsSubtitle: "Manage your entity's profile information",

    changePassword: "Change Password",

    entityInformation: "Entity Information",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",

    contactPerson: "Contact Person",
    website: "Website",
    establishedYear: "Established Year",
    principalName: "Principal Name",
    entityDescription: "Entity Description",

    accountStatistics: "Account Statistics",
    competitionsJoined: "Competitions Joined",
    certificates: "Certificates",



    currentPassword: "Current Password",
    currentPasswordPlaceholder: "Enter current password",

    newPassword: "New Password",
    newPasswordPlaceholder: "Enter new password",

    confirmNewPassword: "Confirm New Password",
    confirmNewPasswordPlaceholder: "Confirm new password",

    updatePassword: "Update Password",


    resultsAchievements: "Results & Achievements",
    resultsSubtitle: "View your entity's performance and download certificates",

    totalResults: "Total Results",
    medalsWon: "Medals Won",

    mathCompetition: "Mathematics Competition",
    sprint100m: "100m Sprint",
    scienceFair: "Science Fair",
    basketball: "Basketball Championship",
    debate: "Debate Championship",


    noResultsFound: "No Results Found",
    adjustFilters: "Try adjusting your search or filter criteria",

    achievementSummary: "Achievement Summary",
    goldMedals: "Gold Medals",
    silverMedals: "Silver Medals",
    bronzeMedals: "Bronze Medals",


    score: "Score:",
    time: "Time:",

    resultSheet: "Result Sheet",
    certificate: "Certificate",

    resultsPending: "Results will be published soon",

    // Position texts (used from positionInfo.text)
    firstPlace: "First Place",
    secondPlace: "Second Place",
    thirdPlace: "Third Place",


  },
  ar: {
    welcomeBack: 'مرحباً بعودتك',
    signInToAccount: 'تسجيل الدخول إلى حساب أولمبياد السعودية',
    emailAddress: 'البريد الإلكتروني',
    enterEmail: 'أدخل بريدك الإلكتروني',
    password: 'كلمة المرور',
    enterPassword: 'أدخل كلمة المرور',
    signIn: 'تسجيل الدخول',
    signingIn: 'جاري تسجيل الدخول...',
    dontHaveAccount: 'ليس لديك حساب؟',
    signUp: 'إنشاء حساب',
    demoAccounts: 'حسابات تجريبية:',
    superAdmin: 'مدير النظام',
    entityAdmin: 'مدير الجهة',
    joinOlympics: 'انضم إلى أولمبياد السعودية',
    createAccount: 'إنشاء حساب الجهة الخاصة بك',
    yourName: 'اسمك',
    enterFullName: 'أدخل اسمك الكامل',
    entityName: 'اسم الجهة',
    enterEntityName: 'أدخل اسم الجهة',
    phoneNumber: 'رقم الهاتف',
    enterPhone: 'أدخل رقم الهاتف',
    entityAddress: 'عنوان الجهة',
    enterEntityAddress: 'أدخل عنوان الجهة',
    confirmPassword: 'تأكيد كلمة المرور',
    confirmYourPassword: 'أكد كلمة المرور',
    createAccountBtn: 'إنشاء الحساب',
    creatingAccount: 'جاري إنشاء الحساب...',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    signInLink: 'تسجيل الدخول',
    invalidCredentials: 'بيانات الاعتماد غير صالحة. يرجى المحاولة مرة أخرى.',
    passwordsDoNotMatch: 'كلمات المرور غير متطابقة',
    passwordMinLength: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    accountCreationFailed: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
    saudiOlympicsSystem: 'نظام أولمبياد السعودية',
    forEntityManagement: 'منصة إدارة الجهات',
    loadingSystem: 'جاري تحميل نظام أولمبياد السعودية...',

    // admin dashboard
    title: 'لوحة تحكم المشرف العام',
    subtitle: 'نظرة عامة على نظام إدارة أولمبياد المملكة العربية السعودية',
    recentActivities: 'الأنشطة الأخيرة',
    upcomingCompetitions: 'المسابقات القادمة',
    topEntities: 'الجهات الأعلى مشاركة',
    participants: 'المشاركون',
    competitions: 'المسابقات',
    revenue: 'الإيرادات',
    status: 'الحالة',
    active: 'نشط',
    participantsLabel: 'مشارك',
    registeredEntity: 'الجهات المسجلة',
    totalParticipants: 'إجمالي المشاركين',
    activeCompetitions: 'المسابقات النشطة',
    revenueGenerated: 'إجمالي الإيرادات',

    // sidenav
    appTitle: 'أولمبياد المملكة العربية السعودية',
    adminPanel: 'لوحة تحكم المشرف',
    entityPanel: 'لوحة الجهة',
    logout: 'تسجيل الخروج',

    Dashboard: 'لوحة التحكم',
    Competitions: 'المسابقات',
    'Competition Draws': 'قرعة المسابقات',
    Participants: 'المشاركون',
    'All Participants': 'جميع المشاركين',
    Payments: 'المدفوعات',
    Results: 'النتائج',
    Profile: 'الملف الشخصي',
    Entities: 'الجهات',
    Schedule: 'الجدول الزمني',
    Notifications: 'الإشعارات',




    // NOTIFICATION CENTER START 


    // Page
    notificationCenter: 'مركز الإشعارات',
    notificationSubtitle: 'إرسال الإعلانات والتنبيهات إلى الجهات',

    // Header
    communicationCenter: 'مركز التواصل',
    manageCommunication: 'إدارة الإعلانات والتنبيهات',
    createAnnouncement: 'إنشاء إعلان',

    // Quick cards
    allEntities: 'جميع الجهات',
    sendToAll: 'إرسال للجميع',
    competitionUpdates: 'تحديثات المسابقات',
    pendingEntities: 'الجهات المعلقة',
    sendReminders: 'إرسال تذكير',

    // List
    recentAnnouncements: 'الإعلانات الأخيرة',
    filter: 'تصفية',
    export: 'تصدير',

    // Announcement meta
    by: 'بواسطة',
    sentTo: 'تم الإرسال إلى',
    entities: 'جهات',
    more: 'أخرى',

    // Buttons
    resend: 'إعادة الإرسال',
    resending: 'جارٍ إعادة الإرسال...',
    edit: 'تعديل',
    delete: 'حذف',

    // Errors & loading
    errorLoading: 'حدث خطأ أثناء تحميل الإعلانات',
    tryAgain: 'حاول مرة أخرى',

    // Modal – Create
    createTitle: 'إنشاء إعلان',
    announcementTitle: 'عنوان الإعلان',
    message: 'الرسالة',
    announcementType: 'نوع الإعلان',
    targetAudience: 'الفئة المستهدفة',
    selectEntity: 'اختيار جهة (اختياري)',
    information: 'معلومة',
    warning: 'تحذير / تنبيه',
    success: 'نجاح / إنجاز',
    allEntity: 'جميع الجهات',
    specificEntity: 'جهة محددة',
    competitionParticipants: 'مشاركو المسابقة',

    // Form
    sendEmail: 'إرسال إشعار عبر البريد الإلكتروني',
    sendSms: 'إرسال إشعار عبر الرسائل النصية',
    cancel: 'إلغاء',
    saveDraft: 'حفظ كمسودة',
    sendAnnouncement: 'إرسال الإعلان',
    sending: 'جارٍ الإرسال...',

    // Details modal
    details: 'التفاصيل',
    recipients: 'المستلمون',
    createdBy: 'أنشئ بواسطة',
    date: 'التاريخ',
    type: 'النوع',
    allRegisteredEntities: 'جميع الجهات المسجلة',

    // Notification center End


    // SHEDULED 
    scheduleTitle: 'إدارة الجدولة',
    scheduleSubtitle: 'إدارة جداول الفعاليات والمواقع والأوقات',
    scheduleCompetition: 'جدولة مسابقة',
    selectDate: 'اختر التاريخ',
    sendNotifications: 'إرسال الإشعارات',
    noEvents: 'لا توجد مسابقات مجدولة',
    upcoming: 'المسابقات القادمة',
    venueStatus: 'حالة المواقع',
    available: 'متاح',
    occupied: 'مشغول',
    scheduling: 'جاري الجدولة...',
    competionName: 'اسم المسابقة',
    selectEvent: 'اختر حدث',
    selectVenue: 'اختر الموقع',
    startTime: 'وقت البدء',
    endTime: 'وقت الانتهاء',
    specialInstructions: 'تعليمات خاصة',
    errorLoadingSchedule: 'حدث خطأ أثناء تحميل الجدول',
    Occupied: 'مشغول',
    Available: 'متاح',
    venue: 'الموقع',
    allDayCompetition: 'مسابقة طوال اليوم',
    noEventScheduled: 'لا توجد فعاليات مجدولة لهذا التاريخ',


    //  Entities Management

    entityTitle: 'إدارة الجهات',
    entitySubtitle: 'إدارة تسجيل الجهات والموافقات',
    entityApproved: 'معتمد',
    entityPending: 'قيد الانتظار',
    entityTotal: 'الإجمالي',

    entityEntity: 'الجهة',
    entityContact: 'معلومات التواصل',
    entityLocation: 'الموقع',
    entityParticipants: 'المشاركون',
    entityStatus: 'الحالة',
    entityActions: 'الإجراءات',
    entityParticipating: 'مشارك',
    entityViewDetails: 'عرض التفاصيل',
    entityApprove: 'موافقة',
    entityReject: 'رفض',

    entityNoEntitiesFound: 'لا توجد كيانات',
    entityTryAdjustingSearch: 'حاول تعديل البحث أو الفلاتر',
    entityNoRegisteredEntities: 'لم يتم تسجيل أي كيانات بعد',

    entityDetails: 'تفاصيل الكيان',
    entityContactInfo: 'معلومات الاتصال',
    entityStatistics: 'الإحصاءات',
    entityTotalParticipants: 'إجمالي المشاركين',
    entityCompetitions: 'المسابقات',
    entityPayments: 'المدفوعات',

    // END

    // RESULT MANAGMENT

    resultManagementTitle: 'إدارة النتائج',
    resultManagementSubtitle: 'إنشاء وإدارة نتائج وترتيب المسابقات',
    resultManagementBulkUpload: 'رفع جماعي',
    resultManagementExportResults: 'تصدير النتائج',
    resultManagementCreateResults: 'إنشاء النتائج',
    resultManagementResultsPublished: 'النتائج منشورة ومتاحة للتحميل',
    resultManagementEdit: 'تعديل',
    resultManagementExport: 'تصدير',
    resultManagementPosition: 'المركز',
    resultManagementParticipant: 'المشارك',
    resultManagementEntity: 'الكيان',
    resultManagementScore: 'النتيجة',
    resultManagementCertificate: 'الشهادة',
    resultManagementActions: 'إجراءات',
    resultManagementGenerated: 'تم إنشاءها',
    resultManagementNotGenerated: 'لم يتم إنشاؤها',
    resultManagementCertificateGeneration: 'إنشاء الشهادات',
    resultManagementGenerateTop3: 'إنشاء الشهادات لأفضل 3 مراكز',
    resultManagementGenerating: 'جارٍ الإنشاء...',
    resultManagementGenerateCertificates: 'إنشاء الشهادات',
    resultManagementPendingResults: 'المسابقات التي تنتظر النتائج',
    resultManagementPendingResultsBadge: 'نتائج معلقة',
    resultManagementCompetitionDate: 'تاريخ المسابقة',

    resultManagementCreateCompetitionResults: 'إنشاء نتائج المسابقة',
    resultManagementSelectCompetition: 'اختر المسابقة',
    resultManagementChooseEvent: 'اختر فعالية',
    resultManagementResultType: 'نوع النتيجة',
    resultManagementRanking: 'ترتيب المراكز',
    resultManagementScoreBased: 'حسب النقاط',
    resultManagementTimeBased: 'حسب الوقت',
    resultManagementPointsBased: 'حسب النقاط',
    resultManagementUploadFile: 'رفع ملف النتائج',
    resultManagementUploadHint: 'اضغط للرفع أو اسحب الملف هنا',
    resultManagementUploadFormats: 'ملفات Excel أو CSV فقط',
    resultManagementManualEntry: 'إدخال يدوي',
    resultManagementScoreTime: 'النتيجة / الوقت',
    resultManagementParticipantPlaceholder: 'اسم المشارك',
    resultManagementEntityPlaceholder: 'اسم الجهة',
    resultManagementScoreTimePlaceholder: 'النتيجة أو الوقت',
    resultManagementAddMore: 'إضافة مراكز أخرى',
    resultManagementCancel: 'إلغاء',
    resultManagementSaveDraft: 'حفظ كمسودة',
    resultManagementPublishing: 'جارٍ النشر...',
    resultManagementPublish: 'نشر النتائج',

    certificateBackToResults: 'العودة إلى النتائج',
    certificateGeneratingPdf: 'جارٍ إنشاء ملف PDF...',
    certificateDownload: 'تحميل الشهادة',

    certificateTitle: 'شهادة إنجاز',
    certificateSystemName: 'نظام الأولمبياد السعودي للجهات',

    certificateCertifyText: 'تشهد هذه الشهادة بأن',
    certificateFromEntity: 'من',
    certificateHasAchieved: 'قد حقق',
    certificateInThe: 'في',

    certificateScoreLabel: 'النتيجة',
    certificateTimeLabel: 'الوقت',
    certificateDateLabel: 'التاريخ',

    certificateCoordinator: 'منسق المسابقة',
    certificatePrincipal: 'مدير الجهة',
    certificateIdLabel: 'رقم الشهادة',

    certificateDetailsTitle: 'تفاصيل الشهادة',
    certificateParticipant: 'المشارك',
    certificateEntity: 'الجهة',
    certificateCompetition: 'المسابقة',
    certificateAchievement: 'الإنجاز',
    certificateDateIssued: 'تاريخ الإصدار',


    // END

    // competition management
    competitionManagementTitle: "إدارة المسابقات",
    competitionManagementSubtitle: "إنشاء وإدارة المسابقات الأكاديمية والرياضية",
    competitionSearchPlaceholder: "ابحث عن المسابقات...",
    competitionFiltersAllCategories: "جميع الفئات",
    competitionFiltersAcademic: "أكاديمي",
    competitionFiltersSports: "رياضة",
    competitionFiltersAllStatus: "جميع الحالات",
    competitionFiltersDraft: "مسودة",
    competitionFiltersActive: "نشط",
    competitionFiltersCompleted: "مكتمل",
    competitionCreateButton: "إنشاء مسابقة",
    competitionTotalCompetitions: "إجمالي المسابقات",
    competitionActiveCompetitions: "المسابقات النشطة",
    competitionTotalParticipants: "إجمالي المشاركين",
    competitionRevenue: "الإيرادات",
    competitionSpotsRemaining: "مقاعد متبقية",
    competitionViewButton: "عرض",
    competitionNoCompetitionFound: "لا توجد مسابقة",
    competitionTryAdjustSearchFilters: "حاول تعديل البحث أو الفلاتر",
    competitionCreateFirstEvent: "قم بإنشاء أول حدث للبدء",

    competitionCreateTitle: "إنشاء مسابقة جديدة",
    competitionEditTitle: "تعديل المسابقة",
    competitionName: "اسم المسابقة",
    competitionNamePlaceholder: "أدخل اسم الحدث",
    competitionCategory: "الفئة",
    competitionType: "نوع المسابقة",
    competitionSelectType: "اختر النوع",
    competitionTypeIndividual: "فردي",
    competitionTypeTeam: "فريق",
    competitionTypeIndividualTeam: "فردي / فريق",
    competitionDate: "تاريخ المسابقة",
    competitionVenue: "المكان",
    competitionVenuePlaceholder: "أدخل موقع الحدث",
    competitionFee: "رسوم التسجيل",
    competitionFeePlaceholder: "أدخل مبلغ الرسوم",
    competitionMaxParticipants: "الحد الأقصى للمشاركين",
    competitionMaxParticipantsPlaceholder: "أدخل الحد الأقصى للمشاركين",
    competitionAgeGroups: "الفئات العمرية",
    competitionYears: "سنوات",
    competitionDescription: "وصف المسابقة",
    competitionDescriptionPlaceholder: "صف الحدث، أهدافه، وما يمكن أن يتوقعه المشاركون",
    competitionCancelButton: "إلغاء",
    competitionCreatePublishButton: "إنشاء ونشر",
    competitionUpdateButton: "تحديث المسابقة",
    competitionSaving: "جاري الحفظ...",

    // END

    // DRAW MANAGEMENT
    drawManagementTitle: "إدارة السحب",
    drawManagementSubtitle: "إنشاء وإدارة جداول البطولة",
    createDrawButton: "إنشاء سحب",
    drawSearchPlaceholder: "ابحث عن السحوبات...",
    drawFilterAllStatus: "جميع الحالات",
    drawFilterUpcoming: "قادم",
    drawFilterLive: "مباشر",
    drawFilterCompleted: "مكتمل",
    drawParticipants: "مشارك",
    drawMatches: "مباريات",
    viewBracket: "عرض الجدول",
    backToDraws: "العودة إلى السحوبات",
    noDrawsFound: "لا توجد سحوبات",
    tryAdjustingFilters: "حاول تعديل البحث أو الفلاتر",
    createFirstDraw: "قم بإنشاء أول سحب للبطولة للبدء",
    editDrawTitle: "تعديل السحب",
    createDrawTitle: "إنشاء سحب جديد",
    selectCompetition: "اختر المسابقة",
    selectCompetitionPlaceholder: "اختر المسابقة",
    tournamentType: "نوع البطولة",
    singleElimination: "إقصاء فردي",
    doubleElimination: "إقصاء مزدوج",
    roundRobin: "دوري",
    groupStage: "مرحلة المجموعات",
    startDate: "تاريخ البدء",
    venuePlaceholder: "أدخل المكان",
    updateDrawButton: "تحديث السحب",

    // END

    // Partivipant Management 

    "participantsTitle": "نظرة عامة على المشاركين",
    "participantsSubtitle": "عرض وإدارة جميع المشاركين",
    "academicParticipants": "المشاركون الأكاديميون",
    "sportsParticipants": "المشاركون الرياضيون",
    "withResults": "المشاركون الذين لديهم نتائج",
    "searchParticipantsPlaceholder": "ابحث عن المشاركين...",
    "filterAllEntities": "جميع المدارس",
    "filterAllCategories": "جميع الفئات",
    "categoryAcademic": "أكاديمي",
    "categorySports": "رياضي",
    "exportDataButton": "تصدير البيانات",
    "tableParticipant": "المشارك",
    "tableEntity": "المدرسة",
    "tableGrade": "الصف",
    "tableCategory": "الفئة",
    "tableCompetitions": "المسابقة",
    "tableResults": "النتائج",
    "tableActions": "الإجراءات",
    "viewButton": "عرض",
    "participantModalRegistrations": "التسجيلات",
    "participantModalStatusRegistered": "مسجل",
    "participantModalDocuments": "الوثائق",
    "participantModalNoDocuments": "لا توجد وثائق مرفوعة",
    "participantModalResults": "النتائج",
    "participantModalNoResults": "لا توجد نتائج متاحة",
    "downloadCertificate": "تحميل الشهادة",
    "result1st": "الأول",
    "result2nd": "الثاني",
    "result3rd": "الثالث",
    "scoreLabel": "الدرجة",
    "timeLabel": "الوقت",
    "ageLabel": "العمر",
    "noParticipantsFound": "لم يتم العثور على مشاركين",

    // END

    // PAYMENT MANAGEMENT

    "paymentTitle": "إدارة المدفوعات",
    "paymentSubtitle": "مراقبة وإدارة جميع مدفوعات الكيانات",
    "totalRevenue": "إجمالي الإيرادات",
    "completed": "مكتملة",
    "pendingAmount": "المبلغ المعلق",
    "failed": "فاشلة",
    "searchPlaceholder": "ابحث عن الكيانات أو أرقام الفواتير...",
    "allStatus": "جميع الحالات",
    "allMethods": "جميع الطرق",
    "cardPayment": "دفع بالبطاقة",
    "bankTransfer": "تحويل بنكي",
    "cashPayment": "دفع نقدي",
    "exportReport": "تصدير التقرير",
    "invoice": "الفاتورة",
    "entity": "الكيان",
    "amount": "المبلغ",
    "method": "الطريقة",
    "actions": "الإجراءات",
    "noPaymentsFound": "لا توجد مدفوعات",
    "paymentDetails": "تفاصيل الدفع",
    "paymentInformation": "معلومات الدفع",
    "statusDetails": "الحالة والتفاصيل",
    "competitionsIncluded": "المسابقات المدرجة",
    "downloadInvoice": "تحميل الفاتورة",
    "markAsCompleted": "وضع كمكتملة",

    // END

    // SCHOOL DASHOBOARD

    overviewSAOlympics: "إليك نظرة عامة على مشاركة {{schoolName}} في أولمبياد المملكة العربية السعودية",
    fromLastMonth: "من الشهر الماضي",
    recentResults: "النتائج الأخيرة",
    quickActions: "إجراءات سريعة",
    addParticipants: "إضافة المشاركين",
    registerNewParticipants: "تسجيل مشاركين جدد",
    browseCompetitions: "تصفح المسابقات",
    findNewCompetitions: "ابحث عن مسابقات جديدة",
    viewResults: "عرض النتائج",
    checkLatestScores: "التحقق من أحدث النتائج",
    Registered: "مسجل",
    Pending: "قيد الانتظار",
    Completed: "مكتمل",
    Failed: "فشل",
    CardPayment: "دفع بالبطاقة",
    BankTransfer: "تحويل بنكي",
    CashPayment: "دفع نقدي",

    competitionSelection: "اختيار المسابقات",
    chooseEvents: "اختر الفعاليات التي ستشارك فيها كيانك",
    selectedCompetitions: "المسابقات المختارة",
    totalCost: "التكلفة الإجمالية",
    searchEvents: "ابحث عن الفعاليات...",
    allCategories: "جميع الفئات",
    academic: "أكاديمي",
    sporting: "رياضي",
    showAll: "عرض الكل",
    showSelected: "عرض المختار",
    maxParticipants: "الحد الأقصى للمشاركين",
    registered: "تم التسجيل",
    noEventsFound: "لم يتم العثور على فعاليات",
    tryAdjusting: "حاول تعديل البحث أو الفلاتر",
    noEventsAvailable: "لا توجد فعاليات متاحة حاليًا للتسجيل",
    proceedToPayment: "المتابعة إلى الدفع",

    competitionDraws: "سحوبات المسابقات",
    viewTournamentBrackets: "عرض أطر البطولة وجداول المباريات",
    tournaments: "البطولات",
    searchTournaments: "ابحث عن البطولات...",
    allCompetitions: "جميع المسابقات",
    academicCompetitions: "المسابقات الأكاديمية",
    sportingCompetitions: "المسابقات الرياضية",
    matchesCompleted: "المباريات المكتملة",
    backToTournaments: "← العودة إلى البطولات",
    noTournamentsFound: "لم يتم العثور على بطولات",
    tryAdjustingSearch: "حاول تعديل البحث أو الفلاتر",
    tournamentDrawsWillAppear: "ستظهر سحوبات البطولات هنا بمجرد إنشائها من قبل المسؤولين",
    pending: "قيد الانتظار",

    live: "مباشر",
    final: "النهائي",
    semiFinal: "نصف النهائي",
    round: "الجولة",
    match: "المباراة",
    tbd: "لم يحدد",
    vs: "مقابل",
    ongoing: "جارية",


    participantManagement: "إدارة المشاركين",
    participantManagementDesc: "إدارة تسجيل المشاركين وتوزيعهم على المسابقات",
    import: "استيراد",
    addParticipant: "إضافة مشارك",
    searchParticipants: "البحث عن مشاركين...",
    allGrades: "جميع الصفوف",
    grade9: "الصف التاسع",
    grade10: "الصف العاشر",
    grade11: "الصف الحادي عشر",
    grade12: "الصف الثاني عشر",
    participant: "المشارك",
    grade: "الصف",
    category: "الفئة",
    age: "العمر",
    events: "مسابقات",
    noParticipants: "لا يوجد مشاركون",
    adjustSearch: "حاول تعديل البحث أو الفلاتر",


    editParticipant: "تعديل المشارك",
    addNewParticipant: "إضافة مشارك جديد",
    participantName: "اسم المشارك",
    selectGrade: "اختر الصف",
    selectCategory: "اختر الفئة",
    selectCompetitions: "اختيار المسابقات",
    participantPhoto: "صورة المشارك",
    uploadPhoto: "رفع صورة",
    documentsOptional: "المستندات (اختياري)",
    uploadDocuments: "رفع المستندات",
    documentsSelected: "مستندات مختارة",
    saving: "جارٍ الحفظ...",
    update: "تحديث",
    add: "إضافة",


    payment: "الدفع",
    paymentDescription: "أكمل عملية الدفع للفعاليات المختارة",
    orderSummary: "ملخص الطلب",
    subtotal: "المجموع الفرعي",
    processingFee: "رسوم المعالجة",
    total: "الإجمالي",
    paymentMethod: "طريقة الدفع",
    card: "بطاقة ائتمان / خصم",
    mobilePayment: "الدفع عبر الجوال",
    cardNumber: "رقم البطاقة",
    expiryDate: "تاريخ الانتهاء",
    cvv: "رمز الأمان",
    cardholderName: "اسم حامل البطاقة",
    bankDetails: "تفاصيل التحويل البنكي",
    bankName: "اسم البنك",
    accountNumber: "رقم الحساب",
    routingNumber: "رقم التوجيه",
    reference: "المرجع",
    bankNote: "يرجى إدخال رقم المرجع في وصف التحويل.",
    mobileNumber: "رقم الجوال",
    mobileProvider: "مزود الدفع",
    pay: "ادفع",


    processingPayment: "جاري معالجة الدفع",
    processingPaymentDescription: "يرجى الانتظار بينما نقوم بمعالجة عملية الدفع...",

    paymentSuccessTitle: "تم الدفع بنجاح!",
    paymentSuccessDescription: "تمت معالجة دفعتك بقيمة {amount} بنجاح.",
    transactionId: "رقم المعاملة",
    paymentDate: "التاريخ",
    paymentStatus: "الحالة",
    paymentCompleted: "مكتمل",


    profileSettingsTitle: "إعدادات الملف الشخصي",
    profileSettingsSubtitle: "إدارة معلومات ملف الجهة",

    changePassword: "تغيير كلمة المرور",

    entityInformation: "معلومات الجهة",
    editProfile: "تعديل الملف",
    saveChanges: "حفظ التغييرات",

    contactPerson: "اسم المسؤول",
    website: "الموقع الإلكتروني",
    establishedYear: "سنة التأسيس",
    principalName: "اسم المدير",
    entityDescription: "وصف الجهة",

    accountStatistics: "إحصائيات الحساب",
    competitionsJoined: "المسابقات المشاركة",
    certificates: "الشهادات",


    currentPassword: "كلمة المرور الحالية",
    currentPasswordPlaceholder: "أدخل كلمة المرور الحالية",

    newPassword: "كلمة المرور الجديدة",
    newPasswordPlaceholder: "أدخل كلمة المرور الجديدة",

    confirmNewPassword: "تأكيد كلمة المرور الجديدة",
    confirmNewPasswordPlaceholder: "أكد كلمة المرور الجديدة",

    updatePassword: "تحديث كلمة المرور",


    resultsAchievements: "النتائج والإنجازات",
    resultsSubtitle: "عرض أداء الجهة وتحميل الشهادات",

    totalResults: "إجمالي النتائج",
    medalsWon: "الميداليات",

    mathCompetition: "مسابقة الرياضيات",
    sprint100m: "سباق 100 متر",
    scienceFair: "معرض العلوم",
    basketball: "بطولة كرة السلة",
    debate: "بطولة المناظرات",


    noResultsFound: "لا توجد نتائج",
    adjustFilters: "حاول تعديل البحث أو الفلاتر",

    achievementSummary: "ملخص الإنجازات",
    goldMedals: "ميداليات ذهبية",
    silverMedals: "ميداليات فضية",
    bronzeMedals: "ميداليات برونزية",
    score: "النتيجة:",
    time: "الوقت:",
    resultSheet: "كشف النتائج",
    certificate: "الشهادة",
    resultsPending: "سيتم نشر النتائج قريبًا",
    firstPlace: "المركز الأول",
    secondPlace: "المركز الثاني",
    thirdPlace: "المركز الثالث",


  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    isRTL
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
