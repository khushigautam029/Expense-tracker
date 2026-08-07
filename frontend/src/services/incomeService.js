import API from "../utils/api.js";

export const getAllIncome = async (month) => {
    const response = await API.get("/income", {
        params: { ...(month ? { month } : {}), limit: 1000 },
    });
    return response.data;
}

export const getIncomeById = async (id) => {
    const response = await API.get(`/income/${id}`);
    return response.data;
}

export const addIncome = async (incomeData) => {
    const response = await API.post("/income", incomeData);
    return response.data;
}

export const updateIncome = async (id , incomeData)=> {
    const response = await API.put(`/income/${id}`, incomeData);
    return response.data;
}

export const deleteIncome = async(id) => {
    const response = await API.delete(`/income/${id}`);
    return response.data;
}
