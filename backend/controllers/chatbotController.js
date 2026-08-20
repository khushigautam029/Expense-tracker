import asyncHandler from "../utils/asyncHandler.js";
import { detectQueryType } from "../utils/chatbotQuery.js";
import { getFinancialSummary } from "../utils/financialSummary.js";
import gemini from "../utils/gemini.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import { STATUS_CODES } from "../utils/setConstants.js";

export const chatWithBot = asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (!message?.trim()) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            "Message is required."
        );
    }

    const userId = req.user.id;
    console.log("👤 Chatbot user:", userId);
    console.log("💬 User message:", message);

    // Detect user query
    const queryType = detectQueryType(message);
    console.log("🔍 Query type:", queryType);

    // Get financial data
    const financialData = await getFinancialSummary(
        userId
    );

    let relevantData = financialData;
    // Only provide relevant information for specific queries
    switch (queryType) {
        case "TOTAL_EXPENSE":
            relevantData = {
                totalExpense:
                    financialData.totalExpense,
            };
            break;

        case "TOTAL_INCOME":
            relevantData = {
                totalIncome:
                    financialData.totalIncome,
            };
            break;

        case "BALANCE":
            relevantData = {
                totalIncome:
                    financialData.totalIncome,
                totalExpense:
                    financialData.totalExpense,
                balance:
                    financialData.balance,
            };
            break;

        case "SAVINGS":
            relevantData = {
                totalIncome:
                    financialData.totalIncome,
                totalExpense:
                    financialData.totalExpense,
                savings:
                    financialData.balance,
            };
            break;

        case "HIGHEST_CATEGORY":
            relevantData = {
                categorySpending:
                    financialData.categorySpending,
            };
            break;

        case "BIGGEST_EXPENSE":
            relevantData = {
                biggestExpense:
                    financialData.biggestExpense,
            };
            break;
        default:
            relevantData = financialData;
    }

    const prompt = `
You are a helpful AI financial assistant inside an expense tracker application.
You are answering questions using the logged-in user's actual financial data.

IMPORTANT RULES:
1. Only use the financial data provided below.
2. Never invent transactions or amounts.
3. Never guess financial information.
4. Use Indian Rupee (₹).
5. Keep the answer simple and clear.
6. Use backend-calculated values exactly as provided.
7. If the requested information is unavailable, say so.
8. Give practical advice when appropriate.

USER QUESTION:
${message}
QUERY TYPE:
${queryType}
RELEVANT FINANCIAL DATA:
${JSON.stringify(
        relevantData,
        null,
        2
    )}
`;
    console.log("🤖 Sending relevant data to Gemini...");
    try {
        const response =
            await gemini.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: prompt,
            });
        console.log(
            "✅ Gemini response received"
        );
        return sendSuccess(
            res,
            STATUS_CODES.OK,
            "AI response generated successfully.",
            {
                reply: response.text,
            }
        );
    } catch (error) {
        console.error(
            "❌ Gemini API Error:",
            error
        );
        const status =
            error?.status ||
            error?.response?.status;

        if (status === 429) {
            return sendError(
                res,
                STATUS_CODES.TOO_MANY_REQUESTS,
                "The AI service is temporarily busy. Please try again in a few seconds."
            );
        }

        if (status === 503) {
            return sendError(
                res,
                STATUS_CODES.SERVICE_UNAVAILABLE,
                "The AI service is temporarily unavailable. Please try again shortly."
            );
        }

        if (status === 401 || status === 403) {
            return sendError(
                res,
                STATUS_CODES.UNAUTHORIZED,
                "The AI service authentication failed. Please contact the administrator."
            );
        }

        return sendError(
            res,
            STATUS_CODES.INTERNAL_SERVER_ERROR,
            "Unable to generate an AI response. Please try again."
        );
    }
});