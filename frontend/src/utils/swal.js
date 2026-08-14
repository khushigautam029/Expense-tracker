import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    },
});
// Success Toast
export const successToast = (title) => {
    return Toast.fire({
        icon: "success",
        title,
    });
};

// Success
export const successAlert = (title, text = "") => {
    return Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonColor: "#2563eb",
        timer: 1800,
        showConfirmButton: false,
    });
};

// Error
export const errorAlert = (title, text = "") => {
    return Swal.fire({
        icon: "error",
        title,
        text,
        confirmButtonColor: "#dc2626",
    });
};

export const errorToast = (title, text = "") => {
    return Toast.fire({
        icon: "error",
        title,
        text,
    });
};

// Warning
export const warningAlert = (title, text = "") => {
    return Swal.fire({
        icon: "warning",
        title,
        text,
        confirmButtonColor: "#f59e0b",
    });
};

// Info
export const infoAlert = (title, text = "") => {
    return Swal.fire({
        icon: "info",
        title,
        text,
        confirmButtonColor: "#3b82f6",
    });
};

// Confirm Delete
export const confirmDelete = () => {
    return Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to undo this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Yes, Delete",
    });
};

// Loading
export const loadingAlert = () => {
    Swal.fire({
        title: "Please Wait...",
        text: "Processing...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

// Close Loading
export const closeAlert = () => {
    Swal.close();
};