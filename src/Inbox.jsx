import { classes } from "./ui/classes";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FiSend, FiMessageCircle, FiRefreshCw } from "react-icons/fi";
import { marketApi, send } from "./marketApi";
export default function Inbox({ user, initialId, onUpdate }) {
  const [threads, setThreads] = useState([]);
  const [selected, setSelected] = useState(initialId || "");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [retry, setRetry] = useState(0);
  const messageKey = useRef(null);
  const end = useRef(null);
  useEffect(() => {
    if (initialId) setSelected(initialId);
  }, [initialId]);
  useEffect(() => {
    let active = true;
    async function load() {
      if (document.hidden) return;
      try {
        let data = await marketApi("/conversations");
        if (!active) return;
        const current = data.find((t) => t.id === selected);
        if (current?.unread) {
          const read = await send(`/conversations/${selected}/read`, {});
          data = data.map((t) => (t.id === read.id ? read : t));
        }
        if (active) {
          setThreads(data);
          onUpdate(data);
          setError("");
          setLoaded(true);
        }
      } catch (e) {
        if (active) {
          setError(e.message);
          setLoaded(true);
        }
      }
    }
    load();
    const interval = setInterval(load, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [selected, retry, onUpdate]);
  const current = threads.find((t) => t.id === selected);
  const count = current?.messages.length;
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected, count]);
  async function submit(e) {
    e.preventDefault();
    if (!draft.trim() || !current || sending) return;
    setSending(true);
    setError("");
    messageKey.current ||= crypto.randomUUID();
    try {
      const updated = await send(`/conversations/${current.id}/messages`, {
        text: draft.trim(),
        clientId: messageKey.current,
      });
      setThreads((all) => all.map((t) => (t.id === updated.id ? updated : t)));
      setDraft("");
      messageKey.current = null;
      setRetry((n) => n + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }
  return (
    <section className={classes("inbox")} aria-label="Messages inbox">
      <aside className={classes("conversation-list")}>
        <div className={classes("inbox-title")}>
          <h2>Conversations</h2>
          <button
            className={classes("icon-button")}
            aria-label="Refresh messages"
            onClick={() => setRetry((n) => n + 1)}
          >
            <FiRefreshCw />
          </button>
        </div>
        {!loaded && <p role="status">Loading messages…</p>}
        {loaded && !threads.length && (
          <p>
            No conversations yet.{" "}
            {user.role === "supplier"
              ? "Customer messages will appear here."
              : "Find a dealer and tap Message dealer to start."}
          </p>
        )}
        {threads.map((t) => (
          <button
            key={t.id}
            className={classes(
              `conversation-item ${selected === t.id ? "selected" : ""}`,
            )}
            onClick={() => {
              setSelected(t.id);
              setDraft("");
              messageKey.current = null;
            }}
          >
            <strong>
              {user.role === "supplier" ? t.buyerName : t.supplierName}
              {t.unread > 0 && (
                <span className={classes("unread-badge")}>{t.unread}</span>
              )}
            </strong>
            <span>{t.messages.at(-1)?.text || "Start a conversation"}</span>
            <small>
              {new Date(t.updatedAt).toLocaleString("en-BD", {
                timeZone: "Asia/Dhaka",
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </small>
          </button>
        ))}
      </aside>
      <div className={classes("chat-panel")}>
        {current ? (
          <>
            <header>
              <h2>
                {user.role === "supplier"
                  ? current.buyerName
                  : current.supplierName}
              </h2>
              <p>Messages refresh every 5 seconds.</p>
              {current.demoShop && (
                <p className={classes("demo-chat-note")}>
                  Demo shop: its inbox can be previewed using a demo dealer
                  account. Use sample information only.
                </p>
              )}
            </header>
            <div
              className={classes("message-history")}
              role="log"
              aria-label="Conversation messages"
              aria-live="polite"
            >
              {!current.messages.length && (
                <p>Say hello. Ask about stock, delivery or pricing.</p>
              )}
              {current.messages.map((m) => (
                <article
                  key={m.id}
                  className={classes(
                    `chat-bubble ${m.senderRole === user.role ? "mine" : ""}`,
                  )}
                >
                  <small>
                    {m.senderRole === user.role ? "You" : m.senderName}
                  </small>
                  <p>{m.text}</p>
                  <time>
                    {new Date(m.createdAt).toLocaleTimeString("en-BD", {
                      timeZone: "Asia/Dhaka",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {m.senderRole === user.role &&
                      (m.readAt ? " · Read" : " · Sent")}
                  </time>
                </article>
              ))}
              <div ref={end} />
            </div>
            <form className={classes("message-form")} onSubmit={submit}>
              <label className={classes("sr-only")} htmlFor="message-text">
                Your message
              </label>
              <textarea
                id="message-text"
                value={draft}
                maxLength={2000}
                placeholder="Write a message…"
                disabled={sending}
                onChange={(e) => {
                  setDraft(e.target.value);
                  messageKey.current = null;
                }}
                required
              />
              <button
                className={classes("button")}
                disabled={sending || !draft.trim()}
              >
                <FiSend /> {sending ? "Sending…" : "Send"}
              </button>
            </form>
          </>
        ) : (
          <div className={classes("empty-state")}>
            <FiMessageCircle />
            <h2>Keep the conversation going</h2>
            <p>Select a conversation to view messages and reply.</p>
          </div>
        )}
        {error && (
          <p className={classes("chat-error")} role="alert">
            {error}{" "}
            <button
              className={classes("text-button")}
              onClick={() => setRetry((n) => n + 1)}
            >
              Retry
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
Inbox.propTypes = {
  user: PropTypes.object.isRequired,
  initialId: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
};
