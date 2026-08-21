import {
    Bot,
    IndianRupee,
    Loader2,
    PieChart,
    Send,
    Sparkles,
    TrendingDown,
    Wallet,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
    getChatHistory,
    sendChatMessage,
} from "../services/chatbotService";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const suggestedQuestions = [
        {
            label: "My balance",
            question: "What is my current balance?",
            icon: Wallet,
        },
        {
            label: "Total spending",
            question: "How much did I spend?",
            icon: TrendingDown,
        },
        {
            label: "Highest category",
            question: "Which category do I spend the most on?",
            icon: PieChart,
        },
        {
            label: "Total income",
            question: "How much did I earn?",
            icon: IndianRupee,
        },
    ];

    useEffect(() => {
        fetchChatHistory();
    }, []);

    // Auto-scroll whenever messages/loading changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    const fetchChatHistory = async () => {
        try {
            const response = await getChatHistory();

            const history = response?.messages || [];

            setMessages(history);
        } catch (error) {
            console.error(
                "Failed to fetch chat history:",
                error.response?.data || error
            );
        }
    };

    const handleSend = async (question = message) => {
        const trimmedMessage = question.trim();

        if (!trimmedMessage || loading) {
            return;
        }

        // Add user message immediately
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: trimmedMessage,
            },
        ]);

        // Clear input
        setMessage("");

        // Start loading
        setLoading(true);

        try {
            const response = await sendChatMessage(trimmedMessage);

            const aiMessage = response?.reply;

            // Add AI response
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        aiMessage ||
                        "Sorry, I couldn't generate a response.",
                },
            ]);
        } catch (error) {
            console.error(
                "Chatbot Error:",
                error.response?.data || error
            );

            const status = error.response?.status;

            let errorMessage =
                "Sorry, something went wrong. Please try again.";

            if (status === 429) {
                errorMessage =
                    "🤖 The AI service is temporarily busy. Please try again in a few seconds.";
            } else if (status === 503) {
                errorMessage =
                    "🤖 The AI service is temporarily unavailable. Please try again shortly.";
            } else if (status === 401) {
                errorMessage =
                    "🔐 Your session has expired. Please log in again.";
            } else if (status === 403) {
                errorMessage =
                    "🔐 You don't have permission to use the chatbot.";
            } else if (status === 400) {
                errorMessage =
                    error.response?.data?.message ||
                    "Please check your question and try again.";
            }

            // Show error as assistant message
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: errorMessage,
                },
            ]);
        } finally {
            // Always stop loading
            setLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 flex h-[560px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 transition-colors ">
                    <div className=" flex items-center justify-between bg-indigo-600 px-4 py-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 ">
                                <Bot size={22} />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    Finance Assistant
                                </h3>
                                <div className="flex items-center gap-1 text-xs text-indigo-100 ">
                                    <span className=" h-2 w-2 rounded-full bg-green-400 "></span>
                                    Online
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className=" rounded-full p-2 transition hover:bg-white/20 "
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* ================= MESSAGES ================= */}
                    <div className=" flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 transition-colors ">
                        {/* Welcome message */}
                        {messages.length === 0 && (
                            <div className="space-y-4">
                                {/* Welcome bot message */}
                                <div className="flex items-start gap-2">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                        <Sparkles size={16} />
                                    </div>

                                    <div className=" max-w-[85%] rounded-2xl rounded-tl-none bg-white dark:bg-gray-900 p-3 text-sm leading-5 text-gray-700 dark:text-gray-200 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800 " >
                                        <p>
                                            👋 Hi! I'm your Finance
                                            Assistant.
                                        </p>

                                        <p className="mt-2">
                                            I can help you understand
                                            your income, expenses,
                                            balance and spending
                                            habits.
                                        </p>

                                        <p className=" mt-2 font-medium text-gray-80 dark:text-gray-100 ">
                                            Try one of these:
                                        </p>
                                    </div>
                                </div>

                                {/* Suggested Questions */}
                                <div className="grid grid-cols-2 gap-2">
                                    {suggestedQuestions.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <button
                                                key={item.question}
                                                onClick={() =>
                                                    handleSend(
                                                        item.question
                                                    )
                                                }
                                                disabled={loading}
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    rounded-xl
                                                    border
                                                    border-gray-200
                                                    dark:border-gray-700
                                                    bg-white
                                                    dark:bg-gray-900
                                                    px-3 py-2.5
                                                    text-left
                                                    text-xs
                                                    font-medium
                                                    text-gray-700
                                                    dark:text-gray-200
                                                    shadow-sm
                                                    transition
                                                    hover:border-indigo-300
                                                    hover:bg-indigo-50
                                                    hover:text-indigo-600
                                                    dark:hover:border-indigo-700
                                                    dark:hover:bg-indigo-950
                                                    dark:hover:text-indigo-400
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50
                                                "
                                            >
                                                <Icon
                                                    size={16}
                                                    className="shrink-0"
                                                />

                                                <span>
                                                    {item.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Conversation messages */}
                        <div className="mt-3 space-y-3">
                            {messages.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex ${item.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
                                    {/* Assistant icon */}
                                    {item.role === "assistant" && (
                                        <div
                                            className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 "
                                        >
                                            <Bot size={16} />
                                        </div>
                                    )}

                                    {/* Message bubble */}
                                    <div
                                        className={`
                                            max-w-[78%]
                                            rounded-2xl
                                            px-3 py-2.5
                                            text-sm
                                            leading-5

                                            ${item.role === "user"
                                                ? `
                                                        rounded-br-none
                                                        bg-indigo-600
                                                        text-white
                                                    `
                                                : `
                                                        rounded-bl-none
                                                        bg-white
                                                        dark:bg-gray-900
                                                        text-gray-700
                                                        dark:text-gray-200
                                                        shadow-sm
                                                        ring-1
                                                        ring-gray-100
                                                        dark:ring-gray-800
                                                    `
                                            }
                                        `}
                                    >
                                        {item.role === "assistant" ? (
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ children }) => (
                                                        <h1
                                                            className=" mb-2 text-base font-bold text-gray-900 dark:text-gray-100 "
                                                        >
                                                            {children}
                                                        </h1>
                                                    ),

                                                    h2: ({ children }) => (
                                                        <h2
                                                            className=" mb-2 text-base font-semibold text-gray-900 dark:text-gray-100"
                                                        >
                                                            {children}
                                                        </h2>
                                                    ),

                                                    h3: ({ children }) => (
                                                        <h3
                                                            className=" mb-1.5 font-semibold text-gray-900 dark:text-gray-100"
                                                        >
                                                            {children}
                                                        </h3>
                                                    ),

                                                    p: ({ children }) => (
                                                        <p className="mb-2 last:mb-0">
                                                            {children}
                                                        </p>
                                                    ),

                                                    ul: ({ children }) => (
                                                        <ul
                                                            className=" mb-2 ml-4 list-disc space-y-1"
                                                        >
                                                            {children}
                                                        </ul>
                                                    ),

                                                    ol: ({ children }) => (
                                                        <ol
                                                            className=" mb-2 ml-4 list-decimal space-y-1"
                                                        >
                                                            {children}
                                                        </ol>
                                                    ),

                                                    li: ({ children }) => (
                                                        <li>{children}</li>
                                                    ),

                                                    strong: ({ children }) => (
                                                        <strong className="font-semibold">
                                                            {children}
                                                        </strong>
                                                    ),

                                                    em: ({ children }) => (
                                                        <em>{children}</em>
                                                    ),

                                                    code: ({ children }) => (
                                                        <code
                                                            className=" rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs text-gray-800 dark:text-gray-200 "
                                                        >
                                                            {children}
                                                        </code>
                                                    ),
                                                }}
                                            >
                                                {item.content}
                                            </ReactMarkdown>
                                        ) : (
                                            item.content
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* ================= THINKING ANIMATION ================= */}
                            {loading && (
                                <div className="flex items-center">
                                    <div
                                        className="
                                            mr-2
                                            flex h-8 w-8
                                            items-center justify-center
                                            rounded-full
                                            bg-indigo-100
                                            text-indigo-600
                                            dark:bg-indigo-950
                                            dark:text-indigo-400
                                        "
                                    >
                                        <Bot size={16} />
                                    </div>

                                    <div className=" flex items-center gap-1 rounded-2xl rounded-bl-none bg-white dark:bg-gray-900 px-4 py-3  shadow-s  ring-1 ring-gray-100 dark:ring-gray-800" >
                                        <span className=" text-xs text-gray-500 dark:text-gray-400 ">
                                            Thinking
                                        </span>

                                        <span className="flex gap-1">
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"></span>
                                            <span
                                                className=" h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
                                                style={{
                                                    animationDelay:
                                                        "150ms",
                                                }}
                                            ></span>

                                            <span
                                                className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500"
                                                style={{
                                                    animationDelay:
                                                        "300ms",
                                                }}
                                            ></span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Auto-scroll target */}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* ================= INPUT ================= */}
                    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 transition-colors" >
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter" &&
                                        !e.shiftKey
                                    ) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Ask about your finances..."
                                disabled={loading}
                                className="
                                    min-w-0
                                    flex-1
                                    rounded-xl
                                    border
                                    border-gray-300
                                    dark:border-gray-700
                                    bg-white
                                    dark:bg-gray-800
                                    px-3 py-2.5
                                    text-sm
                                    text-gray-900
                                    dark:text-gray-100
                                    outline-none
                                    transition
                                    placeholder:text-gray-400
                                    dark:placeholder:text-gray-500
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-100
                                    dark:focus:ring-indigo-950
                                    disabled:bg-gray-100
                                    dark:disabled:bg-gray-800
                                "
                            />

                            <button
                                onClick={() => handleSend()}
                                disabled={
                                    loading ||
                                    !message.trim()
                                }
                                className=" flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition
                                    hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>
                        </div>

                        <p className="mt-2 text-center text-[10px] text-gray-400 dark:text-gray-500">
                            AI responses are based on your
                            financial data.
                        </p>
                    </div>
                </div>
            )}

            {/* ================= FLOATING BUTTON ================= */}
            <button onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg
                    transition-all duration-200 hover:scale-105 hover:bg-indigo-700 hover:shadow-xl"
                aria-label={
                    isOpen
                        ? "Close chatbot"
                        : "Open chatbot"
                }
            >
                {isOpen ? (
                    <X size={26} />
                ) : (
                    <Bot size={26} />
                )}
            </button>
        </>
    );
};

export default Chatbot;