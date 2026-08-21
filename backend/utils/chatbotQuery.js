export const detectQueryType = (message) => {
    const text = message.toLowerCase().trim();

    if (
        text.includes("biggest expense") ||
        text.includes("largest expense") ||
        text.includes("most expensive") ||
        text.includes("highest expense")
    ) {
        return "BIGGEST_EXPENSE";
    }

    if (
        text.includes("highest category") ||
        text.includes("most spending") ||
        text.includes("spend the most") ||
        text.includes("highest spending") ||
        text.includes("most expensive category")
    ) {
        return "HIGHEST_CATEGORY";
    }

    if (
        text.includes("how much did i spend") ||
        text.includes("total expense") ||
        text.includes("total expenses") ||
        text.includes("how much have i spent")
    ) {
        return "TOTAL_EXPENSE";
    }

    if (
        text.includes("how much did i earn") ||
        text.includes("total income") ||
        text.includes("total earnings") ||
        text.includes("how much have i earned")
    ) {
        return "TOTAL_INCOME";
    }

    if (
        text.includes("balance") ||
        text.includes("how much do i have left") ||
        text.includes("money left")
    ) {
        return "BALANCE";
    }

    if (
        text.includes("saved") ||
        text.includes("saving") ||
        text.includes("savings")
    ) {
        return "SAVINGS";
    }

    return "GENERAL";
};


export const detectMonth = (message) => {
    const text = message.toLowerCase().trim();

    const months = {
        january: "01",
        february: "02",
        march: "03",
        april: "04",
        may: "05",
        june: "06",
        july: "07",
        august: "08",
        september: "09",
        october: "10",
        november: "11",
        december: "12",
    };

    const currentYear = new Date().getFullYear();

    for (const [monthName, monthNumber] of Object.entries(months)) {
        if (text.includes(monthName)) {
            return `${currentYear}-${monthNumber}`;
        }
    }

    return null;
};