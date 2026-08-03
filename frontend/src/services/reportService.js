import API from "../utils/api";

export const getReport = async (month) => {
    const response = await API.get(`/reports?month=${month}`);
    return response.data;
};


const downloadReport = async (format, month) => {
    const response = await API.get(`/reports/${format}`, {
        params: { month },
        responseType: "blob",
    });

    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Expense_Report_${month}.${format === "pdf" ? "pdf" : "xlsx"}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

export const downloadPDF = (month) => downloadReport("pdf", month);
export const downloadExcel = (month) => downloadReport("excel", month);
