import API from "../utils/api";

export const getExpenses = async (month) =>{
    const response = await API.get("/expenses", {
        params: { month, limit: 1000 },
    });
    return response.data;
}

export const getExpense = async (id) => {
    const response = await API.get(`/expenses/${id}`);
    return response.data;
}


export const addExpense = async (expenseData) => {
    const response = await API.post("/expenses", expenseData);
    return response.data;
};

export const updateExpense = async (id , expenseData) => {
    const response = await API.put(`/expenses/${id}`, expenseData);
    return response.data;
}

// export const addExpense = async(expenseData)=>{
//     const response = await API.post("/expenses",expenseData);
//     return response.data;
// }

export const deleteExpense = async (id) =>{
    const response = await API.delete(`/expenses/${id}`);
    return response.data;
}
