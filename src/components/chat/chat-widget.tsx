"use client";

import * as React from "react";
import Image from "next/image";
import {
  X,
  Send,
  ShieldAlert,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  MAX_MESSAGE_LENGTH,
  COPY,
  type ChatResponse,
  type Source,
} from "@/lib/chat-contract";

/**
 * Project-owned static welcome copy introducing Fauzi's AI Assistant.
 * Answers strictly from verified portfolio records (DS-06, AC-7).
 */
export const WELCOME_MESSAGE =
  "Hello! I am Fauzi's AI Assistant. I can answer questions about Fauzi Budikusuma's software development, network engineering projects, verified credentials, and professional background strictly using verified portfolio records.";

/**
 * Starter prompt chips guaranteed to be answerable from the 26 verified records.
 */
export const STARTER_PROMPT_CHIPS = [
  "What is Fauzi's professional background?",
  "What technical skills and tools does Fauzi use?",
  "Tell me about Fauzi's selected projects.",
  "What certifications and internship experience does Fauzi have?",
  "How can I contact Fauzi directly?",
] as const;

export interface MessageItem {
  id: string;
  role: "user" | "assistant";
  text: string;
  status?:
    | "answered"
    | "ok"
    | "no_data"
    | "out_of_scope"
    | "rate_limited"
    | "unavailable"
    | "error";
  sources?: Source[];
  retryAfterSeconds?: number;
}

let messageIdCounter = 0;
function generateMessageId(prefix: "usr" | "ast"): string {
  messageIdCounter += 1;
  return `${prefix}_${Date.now()}_${messageIdCounter}`;
}

const subscribeStorage = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getStorageSnapshot = () => {
  try {
    return typeof window !== "undefined" && sessionStorage.getItem("fauzi_chat_opened") === "1";
  } catch {
    return true;
  }
};

const getServerStorageSnapshot = () => true;

export function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasOpenedBefore = React.useSyncExternalStore(
    subscribeStorage,
    getStorageSnapshot,
    getServerStorageSnapshot
  );
  const [assistantStatus, setAssistantStatus] = React.useState<"live" | "unavailable">("live");
  const [messages, setMessages] = React.useState<MessageItem[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  const launcherRef = React.useRef<HTMLButtonElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Close Panel and Restore Focus (AC-5)
  const handleClosePanel = React.useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      launcherRef.current?.focus();
    }, 50);
  }, []);

  const handleOpenPanel = React.useCallback(() => {
    setIsOpen(true);
    try {
      sessionStorage.setItem("fauzi_chat_opened", "1");
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Safe fallback
    }
  }, []);

  const handleToggle = React.useCallback(() => {
    if (isOpen) {
      handleClosePanel();
    } else {
      handleOpenPanel();
    }
  }, [isOpen, handleClosePanel, handleOpenPanel]);

  // 1. Lightbox Coordination (AC-6 / DS-06 / DESIGN.md §11)
  // When a Certificate Lightbox dialog is open in the DOM, make the chatbot invisible & inert.
  React.useEffect(() => {
    const checkLightbox = () => {
      const dialogs = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
      const hasCertificateDialog = Array.from(dialogs).some(
        (el) => el.id !== "fauzi-chat-panel" && !el.closest("#fauzi-chat-panel")
      );
      setIsLightboxOpen(hasCertificateDialog);
    };

    checkLightbox();

    const observer = new MutationObserver(() => {
      checkLightbox();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["role", "aria-modal"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // 2. Focus Management on Open (AC-5)
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 3. Keyboard Escape Handling (AC-5)
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClosePanel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClosePanel]);

  // 4. Scroll to bottom on new messages
  React.useEffect(() => {
    if (isOpen && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Submit message to /api/chat
  const handleSubmitMessage = async (textToSubmit: string) => {
    const trimmed = textToSubmit.trim();
    if (!trimmed || isLoading) return;

    // Enforce 300 char maximum
    const validText = trimmed.slice(0, MAX_MESSAGE_LENGTH);

    const userMessage: MessageItem = {
      id: generateMessageId("usr"),
      role: "user",
      text: validText,
    };

    // Append user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: validText }),
      });

      const retryAfterHeader = res.headers.get("Retry-After");
      const retrySeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : undefined;

      let data: ChatResponse | null = null;
      try {
        data = (await res.json()) as ChatResponse;
      } catch {
        // Response wasn't valid JSON
      }

      if (res.status === 200 && data) {
        // Successful response (200: answered, no_data, out_of_scope)
        setAssistantStatus("live");

        if (data.status === "answered" || data.status === "ok") {
          const replyText = data.reply || data.answer;
          setMessages((prev) => [
            ...prev,
            {
              id: generateMessageId("ast"),
              role: "assistant",
              text: replyText,
              status: "answered",
              sources: data.sources,
            },
          ]);
        } else if (data.status === "no_data") {
          setMessages((prev) => [
            ...prev,
            {
              id: generateMessageId("ast"),
              role: "assistant",
              text: data.answer || COPY.no_data,
              status: "no_data",
            },
          ]);
        } else if (data.status === "out_of_scope") {
          setMessages((prev) => [
            ...prev,
            {
              id: generateMessageId("ast"),
              role: "assistant",
              text: data.answer || COPY.out_of_scope,
              status: "out_of_scope",
            },
          ]);
        } else {
          // Other 200 responses
          setMessages((prev) => [
            ...prev,
            {
              id: generateMessageId("ast"),
              role: "assistant",
              text: (data && data.answer) || COPY.error,
              status: "error",
            },
          ]);
        }
      } else if (res.status === 429) {
        // Rate limited — explicit cooldown seconds (AC-2)
        setAssistantStatus("unavailable");
        const effectiveRetry =
          retrySeconds || (data && "retryAfterSeconds" in data ? data.retryAfterSeconds : 60);

        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("ast"),
            role: "assistant",
            text: (data && data.answer) || COPY.rate_limited,
            status: "rate_limited",
            retryAfterSeconds: effectiveRetry,
          },
        ]);
      } else if (res.status === 503) {
        // Unavailable (database / Gemini offline)
        setAssistantStatus("unavailable");
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("ast"),
            role: "assistant",
            text: (data && data.answer) || COPY.unavailable,
            status: "unavailable",
          },
        ]);
      } else if (res.status === 400 || res.status === 413 || res.status === 415) {
        // Invalid request
        setAssistantStatus("unavailable");
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("ast"),
            role: "assistant",
            text: (data && data.answer) || COPY.invalid_request,
            status: "error",
          },
        ]);
      } else {
        // Catch-all server failure (500, etc.)
        setAssistantStatus("unavailable");
        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId("ast"),
            role: "assistant",
            text: (data && data.answer) || COPY.error,
            status: "error",
          },
        ]);
      }
    } catch {
      // Network failure / fetch rejection (AC-2)
      setAssistantStatus("unavailable");
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId("ast"),
          role: "assistant",
          text: COPY.unavailable,
          status: "unavailable",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitMessage(inputValue);
  };

  return (
    <div
      className={`fixed z-40 transition-opacity duration-200 ${
        isLightboxOpen ? "opacity-0 pointer-events-none invisible" : "opacity-100"
      }`}
      aria-hidden={isLightboxOpen}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. OPEN CHATBOT PANEL (2 MASTER DESIGN + CHATBOT AI.png)
         ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <section
          id="fauzi-chat-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Fauzi's AI Assistant"
          className="fixed bottom-20 right-3 sm:bottom-24 sm:right-6 z-40 w-[calc(100vw-1.5rem)] sm:w-[410px] md:w-[430px] max-h-[calc(100dvh-5.5rem)] sm:max-h-[min(620px,calc(100dvh-7rem))] flex flex-col rounded-2xl border border-border-default bg-surface-card/95 backdrop-blur-md shadow-2xl overflow-hidden pb-[env(safe-area-inset-bottom,0px)] animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-raised/80 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Bot Icon Badge */}
              <div className="relative w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 border border-border-default shadow-xs">
                <Image
                  src="/assets/brand/chatbot-icon.png"
                  alt="Assistant Avatar"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>

              {/* Title & Status */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-semibold text-sm text-text-strong truncate">
                    Fauzi&apos;s AI Assistant
                  </h2>

                  {/* Honest Status Badge (C-09 / AC-2) */}
                  {assistantStatus === "live" ? (
                    <span
                      data-testid="chat-status-badge"
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-mono text-[9px] font-semibold tracking-wider uppercase border border-accent/40 bg-accent-chip-bg text-accent-text shrink-0"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span
                      data-testid="chat-status-badge"
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-mono text-[9px] font-semibold tracking-wider uppercase border border-border-default bg-surface-raised text-text-muted shrink-0"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                      Unavailable
                    </span>
                  )}
                </div>

                {/* Subtitle */}
                <p className="font-mono text-[10px] text-text-muted truncate">
                  Answers strictly from verified profile data
                </p>
              </div>
            </div>

            {/* Accessible Close Button (≥ 44x44px target) */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClosePanel}
              aria-label="Close AI Assistant"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message Stream & Conversation Container */}
          <div
            role="log"
            aria-live="polite"
            aria-atomic="false"
            className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3.5 text-xs sm:text-sm"
          >
            {/* Welcome Message (DS-06 / AC-7) */}
            <div className="flex items-start gap-2.5 mr-auto max-w-[92%]">
              <div className="w-6 h-6 rounded-md bg-white p-0.5 flex items-center justify-center shrink-0 border border-border-default mt-0.5">
                <Image
                  src="/assets/brand/chatbot-icon.png"
                  alt=""
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <div className="rounded-2xl rounded-tl-xs px-3.5 py-2.5 border border-border-default bg-surface-raised/90 text-text-secondary leading-relaxed shadow-xs">
                {WELCOME_MESSAGE}
              </div>
            </div>

            {/* Interactive Starter Prompt Chips */}
            <div className="pt-1 pb-2">
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2 px-1">
                Suggested questions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPT_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSubmitMessage(chip)}
                    className="inline-flex items-center gap-1 text-left px-2.5 py-1.5 rounded-xl font-mono text-[11px] border border-border-default bg-surface-raised/70 text-text-secondary hover:text-text-primary hover:border-accent hover:bg-surface-raised transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <Sparkles className="w-3 h-3 text-accent shrink-0" />
                    <span>{chip}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Conversation Messages */}
            {messages.map((msg) => {
              if (msg.role === "user") {
                return (
                  <div key={msg.id} className="flex justify-end ml-auto max-w-[85%]">
                    <div className="rounded-2xl rounded-tr-xs px-3.5 py-2.5 border border-border-default bg-surface-raised text-text-primary leading-relaxed shadow-xs">
                      {/* Strict plain text rendering (AC-4) */}
                      {msg.text}
                    </div>
                  </div>
                );
              }

              // Assistant message variations
              const isGuardrail =
                msg.status === "no_data" || msg.status === "out_of_scope";
              const isRateLimited = msg.status === "rate_limited";
              const isUnavailable = msg.status === "unavailable";
              const isError = msg.status === "error";

              return (
                <div key={msg.id} className="flex items-start gap-2.5 mr-auto max-w-[92%]">
                  <div className="w-6 h-6 rounded-md bg-white p-0.5 flex items-center justify-center shrink-0 border border-border-default mt-0.5">
                    <Image
                      src="/assets/brand/chatbot-icon.png"
                      alt=""
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* 1. Guardrail Bubble (no_data / out_of_scope) */}
                    {isGuardrail && (
                      <div className="rounded-2xl rounded-tl-xs p-3.5 border border-accent/40 bg-accent-chip-bg/30 text-text-secondary leading-relaxed shadow-xs">
                        <div className="flex items-center gap-1.5 text-accent-text font-mono text-[10px] font-semibold tracking-wider uppercase mb-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {msg.status === "out_of_scope"
                              ? "SCOPE GUARDRAIL ENFORCED"
                              : "PORTFOLIO GUARDRAIL"}
                          </span>
                        </div>
                        {/* Plain text rendering */}
                        <p>{msg.text}</p>
                      </div>
                    )}

                    {/* 2. Rate Limited Bubble */}
                    {isRateLimited && (
                      <div className="rounded-2xl rounded-tl-xs p-3.5 border border-accent/30 bg-accent-chip-bg/20 text-text-secondary leading-relaxed shadow-xs">
                        <div className="flex items-center gap-1.5 text-accent-text font-mono text-[10px] font-semibold tracking-wider uppercase mb-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>RATE LIMIT EXCEEDED</span>
                        </div>
                        <p>{msg.text}</p>
                        {msg.retryAfterSeconds ? (
                          <p className="font-mono text-[11px] text-accent-text mt-2 font-medium">
                            Please wait {msg.retryAfterSeconds} seconds before sending another message.
                          </p>
                        ) : null}
                      </div>
                    )}

                    {/* 3. Unavailable / Service Notice Bubble */}
                    {(isUnavailable || isError) && (
                      <div className="rounded-2xl rounded-tl-xs p-3.5 border border-border-default bg-surface-raised text-text-secondary leading-relaxed shadow-xs">
                        <div className="flex items-center gap-1.5 text-text-muted font-mono text-[10px] font-semibold tracking-wider uppercase mb-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>SERVICE NOTICE</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    )}

                    {/* 4. Standard Grounded Answer Bubble */}
                    {!isGuardrail && !isRateLimited && !isUnavailable && !isError && (
                      <div className="rounded-2xl rounded-tl-xs px-3.5 py-2.5 border border-border-default bg-surface-card text-text-secondary leading-relaxed shadow-xs">
                        {/* Strict plain text rendering (AC-4) */}
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Verified Source Citations */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-border-default/60 flex flex-col gap-1.5">
                            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                              Verified Portfolio Sources:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.sources.map((src) => (
                                <span
                                  key={src.slug}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[10px] border border-border-default bg-surface-raised text-text-secondary"
                                >
                                  {src.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Accessible Loading Indicator */}
            {isLoading && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-start gap-2.5 mr-auto max-w-[92%]"
              >
                <div className="w-6 h-6 rounded-md bg-white p-0.5 flex items-center justify-center shrink-0 border border-border-default mt-0.5">
                  <Image
                    src="/assets/brand/chatbot-icon.png"
                    alt=""
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <div className="rounded-2xl rounded-tl-xs px-3.5 py-2.5 border border-border-default bg-surface-card text-text-muted flex items-center gap-2 shadow-xs">
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
                  </span>
                  <span className="font-mono text-[11px]">
                    Retrieving verified portfolio records…
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 border-t border-border-default bg-surface-raised/80 shrink-0">
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-1.5">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  maxLength={MAX_MESSAGE_LENGTH}
                  disabled={isLoading}
                  placeholder="Ask a question about Fauzi…"
                  aria-label="Ask a question about Fauzi"
                  className="w-full h-11 pl-3.5 pr-12 rounded-xl border border-border-default bg-surface-card text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 transition-colors"
                />

                <button
                  type="submit"
                  disabled={isLoading || inputValue.trim().length === 0}
                  aria-label="Send question"
                  className="absolute right-1.5 w-8 h-8 rounded-lg bg-accent hover:bg-accent-hover text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Character Counter */}
              <div className="flex justify-between items-center px-1">
                <span className="font-mono text-[10px] text-text-muted">
                  Plain text only · Grounded in PostgreSQL records
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  {inputValue.length}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING LAUNCHER (3 MASTER DESIGN.png / C-09)
         ───────────────────────────────────────────────────────────── */}
      <button
        ref={launcherRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="fauzi-chat-panel"
        aria-label={isOpen ? "Close Fauzi's AI Assistant" : "Open Fauzi's AI Assistant"}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-accent bg-surface-card shadow-lg hover:shadow-accent/20 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {/* Inner high-contrast tile */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center p-1 shadow-xs">
          <Image
            src="/assets/brand/chatbot-icon.png"
            alt="Fauzi's AI Assistant Icon"
            width={36}
            height={36}
            className="object-contain"
            priority
          />
        </div>

        {/* Subtle accent notification dot (C-09: shown only until first open) */}
        {!hasOpenedBefore && !isOpen && (
          <span
            data-testid="chat-notification-dot"
            className="absolute -top-1 -right-1 flex h-3.5 w-3.5"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-accent border-2 border-surface-card" />
          </span>
        )}
      </button>
    </div>
  );
}
