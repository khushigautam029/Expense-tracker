export const STATUS_CODES = {

    // Success
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    // Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,

    // Server Errors
    INTERNAL_SERVER_ERROR: 500
};

export const MESSAGES = {

    // Authentication
    USER_REGISTERED: "User registered successfully.",
    LOGIN_SUCCESSFUL: "Login successful.",
    LOGOUT_SUCCESSFUL: "Logout successful.",
    PROFILE_FETCHED: "Profile fetched successfully.",
    REGISTRATION_SUCCESSFUL_VERIFY_EMAIL: "Registration successful. Please verify your email using the OTP.",
    USERS_FETCHED: "User Fetched",

    // User Errors
    USER_ALREADY_EXISTS: "User already exists.",
    USER_NOT_FOUND: "User not found.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    INVALID_PASSWORD: "Invalid password.",
    ACCESS_DENIED: "Access denied.",
    INVALID_TOKEN: "Invalid or expired token.",
    TOKEN_REQUIRED: "Authorization token is required.",
    USER_DELETED: "User deleted",

    // Income
    INCOME_ADDED: "Income added successfully.",
    INCOME_UPDATED: "Income updated successfully.",
    INCOME_DELETED: "Income deleted successfully.",
    INCOME_FETCHED: "Income fetched successfully.",
    INCOME_NOT_FOUND: "Income not found.",

    // Expense
    EXPENSE_ADDED: "Expense added successfully.",
    EXPENSE_UPDATED: "Expense updated successfully.",
    EXPENSE_DELETED: "Expense deleted successfully.",
    EXPENSE_FETCHED: "Expense fetched successfully.",
    EXPENSE_NOT_FOUND: "Expense not found.",

    // Dashboard
    DASHBOARD_FETCHED: "Dashboard data fetched successfully.",

    // Reports
    PDF_GENERATED: "PDF report generated successfully.",
    EXCEL_GENERATED: "Excel report generated successfully.",

    // Validation
    VALIDATION_ERROR: "Validation failed.",

    // Name Validation
    NAME_REQUIRED: "Name is required.",
    NAME_MIN_LENGTH: "Name must be at least 3 characters long.",
    NAME_MAX_LENGTH: "Name cannot exceed 50 characters.",

    // Email Validation
    EMAIL_REQUIRED: "Email is required.",
    INVALID_EMAIL: "Please enter a valid email address.",
    EMAIL_ALREADY_VERIFIED: "Email already verified.",
    INVALID_OTP: "Invalid OTP",
    OTP_EXPIRED: "OTP has expired",
    EMAIL_VERIFIED_SUCCESSFULLY: "Email verified successfully",
    UNABLE_TO_SEND_OTP: "Unable to send OTP email.",
    NEW_OTP_SENT: "A new verification OTP has been sent to your email.",
    VERIFY_EMAIL_FIRST: "Please verify your email first.",

    // Password Validation
    PASSWORD_REQUIRED: "Password is required.",
    PASSWORD_MIN_LENGTH: "Password must be at least 6 characters long.",
    PASSWORD_PATTERN:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",

    // Income Validation
    INCOME_TITLE_REQUIRED: "Income title is required.",
    INCOME_AMOUNT_REQUIRED: "Income amount is required.",
    INVALID_INCOME_AMOUNT: "Income amount must be greater than zero.",
    SOURCE_REQUIRED: "Income source is required.",
    DATE_REQUIRED: "Date is required.",
    INCOME_FETCHED_SUCCESSFULLY:"Income fetched successfully",

    // Expense Validation
    EXPENSE_TITLE_REQUIRED: "Expense title is required.",
    EXPENSE_AMOUNT_REQUIRED: "Expense amount is required.",
    INVALID_EXPENSE_AMOUNT: "Expense amount must be greater than zero.",
    CATEGORY_REQUIRED: "Expense category is required.",
    INVALID_CATEGORY: "Invalid expense category.",
    EXPENSE_TACKER_API_RUNNING: "Expense tracker api running.",
    EXPENSE_TITLE_MUST_BE_AT_LEAST_3_CHAR: "Expense title must be at least 3 characters.",
    EXPENSE_TITLE_CANNOT_EXCEED_100_CHARACTER: "Expense title cannot exceed 100 characters.",

    // Common
    INTERNAL_SERVER_ERROR: "Internal server error.",
    SOMETHING_WENT_WRONG: "Something went wrong. Please try again later.",

    SOURCE_ALREADY_EXIST: "Source already exists.",
    SOURCE_ADDED_SUCCESSFULLY: "Source added successfully",
    SOURCE_NOT_FOUND: "Source not found",
    SELECTED_SOURCE_DOES_NOT_EXIST: "Selected source does not exist.",

    ALL_NOTIFICATION_DELETED_SUCCESSFULLY: "All notifications deleted successfully",
    NOTIFICATION_NOT_FOUND: "Notification not found.",
    NOTIFICATION_MARKED_AS_READ: "Notification marked as read.",
    ALL_NOTIFICATION_MARKED_AS_READ: "All notifications marked as read.",
    NOTIFICATION_DELETED_SUCCESSFULLY: "Notification deleted successfully.",

    TOO_MANY_REQUEST: "Too many requests. Please try again later.",
    TOO_MANY_LOGIN_ATTEMPT: "Too many login attempts. Please try again after 15 minute.",
    TOO_MANY_OTP_REQUESTS: "Too many OTP requests. Please try again later.",
    YOUR_SESSION_IS_INVALID_OR_EXPIRED: "Your session is invalid or has expired. Please sign in again.",

    PASSWORD_DOES_NOT_MATCH: "Passwords do not match.",
    CONFIRM_PASSWORD_IS_REQUIRED: "Confirm password is required.",
    CURRENT_PASSWORD_IS_REQUIRED: "Current password is required.",

    AMOUNT_MUST_BE_A_VALID_NUMBER: "Amount must be a valid number.",
    AMOUNT_CANNOT_BE_NEGATIVE: "Amount cannot be negative.",
    AMOUNT_IS_REQUIRED: "Amount is required.",

    INVALID_DATE: "Please enter a valid date.",
    EXPENSE_DATE_IS_REQUIRED: "Expense date is required.",

    INCOME_TITLE_REQUIRED: "Income title is required.",
    INCOME_TITLE_MUST_BE_AT_LEAST_3_CHAR: "Income title must be at least 3 characters.",
    INCOME_TITLE_CANNOT_EXCEED_100_CHARACTER: "Income title cannot exceed 100 characters.",

    SOURCE_REQUIRED: "Source is required.",
    SOURCE_MUST_BE_VALID: "Please select a valid source.",
    SOURCES_FETCHED :"Sources fetched successfully.",

    INCOME_DATE_IS_REQUIRED: "Income date is required.",
    INVALID_CATEGORY:"Category must be one of [Food, Travel, Shopping, Bills, Health, Education, Entertainment, Investment, Others"

};