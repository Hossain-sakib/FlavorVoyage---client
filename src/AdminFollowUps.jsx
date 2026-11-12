import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "./ui/Select";
import { marketApi, send } from "./marketApi";
const field =
  "min-h-11 w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm";
export default function AdminFollowUps({ contacts }) {
  const [tasks, setTasks] = useState([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [filter, setFilter] = useState("open");
  useEffect(() => {
    let active = true;
    marketApi("/admin/tasks")
      .then((x) => {
        if (active) setTasks(x);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  const today = new Date(Date.now() + 6 * 3600000).toISOString().slice(0, 10);
  async function mutate(path, body, method) {
    setBusy(true);
    setError("");
    try {
      const task = await send("/admin/tasks" + path, body, method);
      setTasks((old) =>
        old.some((t) => t.id === task.id)
          ? old.map((t) => (t.id === task.id ? task : t))
          : [task, ...old],
      );
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  const visible = tasks
    .filter(
      (t) =>
        filter === "all" ||
        (filter === "overdue"
          ? t.status === "open" && t.dueDate < today
          : t.status === filter),
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return (
    <section aria-label="CRM follow-ups" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Follow-ups & tasks</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          Track calls, dealer checks, delivery follow-ups and customer
          commitments. Due dates use Bangladesh time.
        </p>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-danger-soft p-4 text-sm text-danger"
        >
          {error}
        </p>
      )}
      <details className="rounded-2xl border border-line bg-surface">
        <summary className="min-h-11 cursor-pointer p-5 text-sm font-semibold">
          Add a follow-up task
        </summary>
        <form
          className="grid gap-4 border-t border-line p-5 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            if (
              await mutate("", Object.fromEntries(new FormData(form)), "POST")
            )
              form.reset();
          }}
        >
          <label className="grid gap-2 text-xs">
            Task title
            <input className={field} name="title" required maxLength={200} />
          </label>
          <label className="grid gap-2 text-xs">
            Due date
            <input type="date" name="dueDate" className={field} required />
          </label>
          <label className="grid gap-2 text-xs">
            Related contact
            <Select aria-label="Related contact" name="userId">
              <option value="">General task</option>
              {contacts
                .filter((u) => !u.demo)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.business || u.name}
                  </option>
                ))}
            </Select>
          </label>
          <label className="grid gap-2 text-xs">
            Task notes
            <textarea name="note" className={field} maxLength={2000} rows={3} />
          </label>
          <button
            disabled={busy}
            className="min-h-11 rounded-xl bg-action px-5 py-3 text-sm font-semibold text-on-action sm:col-span-2"
          >
            Create follow-up
          </button>
        </form>
      </details>
      <div className="max-w-xs">
        <label className="grid gap-2 text-xs">
          Task view
          <Select
            aria-label="Task view"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="open">Open tasks</option>
            <option value="overdue">Overdue</option>
            <option value="done">Completed</option>
            <option value="all">All tasks</option>
          </Select>
        </label>
      </div>
      {visible.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {visible.map((task) => (
            <article
              key={task.id}
              className="min-w-0 rounded-2xl border border-line bg-surface p-5"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <h3 className="break-words font-semibold">{task.title}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${task.status === "done" ? "bg-success-soft text-success" : task.dueDate < today ? "bg-danger-soft text-danger" : "bg-info-soft text-info"}`}
                >
                  {task.status === "done"
                    ? "Completed"
                    : task.dueDate < today
                      ? "Overdue"
                      : "Open"}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted">
                Due {task.dueDate} ·{" "}
                {contacts.find((u) => u.id === task.userId)?.business ||
                  "General task"}
              </p>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-muted">
                {task.note}
              </p>
              <button
                disabled={busy}
                onClick={() =>
                  mutate(
                    "/" + task.id,
                    { status: task.status === "done" ? "open" : "done" },
                    "PATCH",
                  )
                }
                className="mt-4 min-h-11 rounded-xl border border-line px-4 py-3 text-xs font-semibold"
              >
                {task.status === "done" ? "Reopen task" : "Mark complete"}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
          No tasks in this view.
        </p>
      )}
    </section>
  );
}
AdminFollowUps.propTypes = { contacts: PropTypes.array.isRequired };
