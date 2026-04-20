import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const SAMPLE_INPUT = `Submit capstone update today
Email mentor about feedback
Prepare Friday demo slides
Waiting on dataset approval
Plan workshop outline for next week
Read more about agentic workflows later`;

const THREAD_CONTRACT = {
  purpose: "Represent the full work history for the single Manager Agent in the task-manager-single-agent workflow.",
  agent: "Manager Agent",
  input: [
    "Raw notes, tasks, or checklist items from the user",
    "Optional deadlines, urgency, owners, dependencies, or constraints",
    "Optional formatting request for the final answer"
  ],
  decisions: [
    "Define what each raw item means as a concrete to-do",
    "Choose whether work belongs in today, thisWeek, or later",
    "Flag blocked, duplicate, or underspecified tasks",
    "Recommend the most useful next action"
  ],
  output: [
    "A clearly defined to-do list",
    "A manager-style task board grouped into today, thisWeek, and later",
    "Short reasoning for important priority choices",
    "A next action section",
    "A risks or blockers section when needed"
  ],
  nextHandoff: "No specialist handoff. The Manager Agent publishes the final answer from singleAgentThread."
};

function App() {
  const [text, setText] = useState(SAMPLE_INPUT);
  const [result, setResult] = useState(() => buildWorkflow(SAMPLE_INPUT));
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  async function runWorkflow(event) {
    event.preventDefault();

    if (!text.trim()) {
      setError("Add a few task notes before running the workflow.");
      return;
    }

    setError("");
    setIsRunning(true);

    await wait(280);
    setResult(buildWorkflow(text));
    setIsRunning(false);
  }

  return (
    <main className="app-shell">
      <section className="hero panel">
        <div className="hero-copy">
          <p className="kicker">Agentic Manual</p>
          <h1>Single-Agent Manager Workflow</h1>
          <p className="lede">
            One manager agent defines the to-do list, prioritizes the work, reviews the plan,
            and publishes the final answer inside one visible thread.
          </p>
        </div>
        <div className="hero-stats">
          <StatCard label="Skill name" value="task-manager-single-agent" />
          <StatCard label="Thread" value="singleAgentThread" />
          <StatCard label="Workflow type" value="Single agent" />
        </div>
      </section>

      <section className="workspace">
        <form className="panel composer" onSubmit={runWorkflow}>
          <div className="section-heading">
            <div>
              <p className="section-label">Input</p>
              <h2>Raw task intake</h2>
            </div>
            <button className="ghost-button" type="button" onClick={() => setText(SAMPLE_INPUT)}>
              Load sample
            </button>
          </div>
          <p className="muted">
            Paste rough notes, checklist items, or mixed task text. The manager agent will define
            the to-do list before organizing it.
          </p>
          <textarea
            aria-label="Raw task input"
            rows={14}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          {error ? <p className="error">{error}</p> : null}
          <div className="button-row">
            <button className="primary-button" type="submit" disabled={isRunning}>
              {isRunning ? "Running workflow..." : "Run single-agent workflow"}
            </button>
          </div>
        </form>

        <section className="panel skill-panel">
          <div className="section-heading">
            <div>
              <p className="section-label">Skill contract</p>
              <h2>What this app demonstrates</h2>
            </div>
          </div>
          <div className="contract-grid">
            <ContractBlock
              title="Role"
              items={[
                "Manager Agent",
                "Defines the to-do items from raw input",
                "Owns intake, prioritization, review, and final delivery"
              ]}
            />
            <ContractBlock
              title="Outputs"
              items={[
                "Defined to-do list",
                "Task board grouped into today, thisWeek, and later",
                "Priority notes, next action, and blockers"
              ]}
            />
            <ContractBlock
              title="Success criteria"
              items={[
                "Only one agent is used",
                "Only one thread is used",
                "The final answer is clear and actionable"
              ]}
            />
          </div>
        </section>
      </section>

      <section className="main-grid">
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="section-label">Thread</p>
              <h2>singleAgentThread</h2>
            </div>
            <span className="thread-pill">{THREAD_CONTRACT.agent}</span>
          </div>
          <p className="muted">{THREAD_CONTRACT.purpose}</p>
          <div className="thread-grid">
            <ThreadList title="Input" items={THREAD_CONTRACT.input} />
            <ThreadList title="Decisions" items={THREAD_CONTRACT.decisions} />
            <ThreadList title="Output" items={THREAD_CONTRACT.output} />
            <ThreadList title="Next handoff" items={[THREAD_CONTRACT.nextHandoff]} />
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="section-label">Stages</p>
              <h2>End-to-end workflow</h2>
            </div>
          </div>
          <div className="timeline">
            {result.stages.map((stage) => (
              <article className="timeline-card" key={stage.id}>
                <div className="timeline-top">
                  <span className={`status-badge ${stage.tone}`}>{stage.status}</span>
                  <h3>{stage.title}</h3>
                </div>
                <p>{stage.message}</p>
                <dl>
                  <DetailRow label="Input" value={stage.details.input} />
                  <DetailRow label="Decision" value={stage.details.decision} />
                  <DetailRow label="Output" value={stage.details.output} />
                  <DetailRow label="Handoff" value={stage.details.handoff} />
                </dl>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="main-grid bottom-grid">
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="section-label">Final response</p>
              <h2>Defined to-do list</h2>
            </div>
          </div>
          <ul className="defined-list">
            {result.definedTasks.map((task) => (
              <li key={task.id}>
                <strong>{task.title}</strong>
                <span>{task.reason}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="section-label">Manager notes</p>
              <h2>Next action and blockers</h2>
            </div>
          </div>
          <div className="note-stack">
            <article className="note-card note-highlight">
              <h3>Next action</h3>
              <p>{result.nextAction}</p>
            </article>
            <article className="note-card">
              <h3>Risks or blockers</h3>
              {result.blockers.length ? (
                <ul className="plain-list">
                  {result.blockers.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No blockers detected in the current input.</p>
              )}
            </article>
          </div>
        </section>
      </section>

      <section className="board">
        <div className="section-heading">
          <div>
            <p className="section-label">Board</p>
            <h2>Manager-style prioritized plan</h2>
          </div>
        </div>
        <div className="board-grid">
          <BoardLane title="Today" tasks={result.board.today} accent="today" />
          <BoardLane title="This Week" tasks={result.board.thisWeek} accent="week" />
          <BoardLane title="Later" tasks={result.board.later} accent="later" />
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ContractBlock({ title, items }) {
  return (
    <article className="contract-block">
      <h3>{title}</h3>
      <ul className="plain-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function ThreadList({ title, items }) {
  return (
    <article className="thread-list">
      <h3>{title}</h3>
      <ul className="plain-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function BoardLane({ title, tasks, accent }) {
  return (
    <article className={`lane lane-${accent}`}>
      <h3>{title}</h3>
      {tasks.length ? (
        <ul className="plain-list">
          {tasks.map((task) => (
            <li className="task-card" key={task.id}>
              <div className="task-top">
                <strong>{task.title}</strong>
                <span>P{task.priority}</span>
              </div>
              <p>{task.reason}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No tasks in this lane.</p>
      )}
    </article>
  );
}

function buildWorkflow(text) {
  const rawItems = splitInput(text);
  const counts = { today: 0, thisWeek: 0, later: 0 };
  const seen = new Set();
  const blockers = [];

  const definedTasks = rawItems.map((item, index) => {
    const title = normalizeTask(item);
    const key = title.toLowerCase();
    const duplicate = seen.has(key);
    seen.add(key);

    const bucket = classifyTask(title, index);
    counts[bucket] += 1;

    const reason = describePriority(title, bucket, duplicate);
    const blocked = isBlocked(title);

    if (blocked) {
      blockers.push(`${title}: waiting on an external dependency or approval.`);
    }

    if (duplicate) {
      blockers.push(`${title}: duplicate wording detected, confirm whether this is one task or two.`);
    }

    return {
      id: `${bucket}-${index}`,
      title,
      bucket,
      priority: bucket === "today" ? 1 : bucket === "thisWeek" ? 2 : 3,
      reason
    };
  });

  const board = {
    today: definedTasks.filter((task) => task.bucket === "today"),
    thisWeek: definedTasks.filter((task) => task.bucket === "thisWeek"),
    later: definedTasks.filter((task) => task.bucket === "later")
  };

  const nextAction = board.today[0]?.title || board.thisWeek[0]?.title || board.later[0]?.title || "Add at least one task.";

  return {
    definedTasks,
    board,
    blockers,
    nextAction,
    stages: [
      {
        id: "intake",
        title: "Read raw input",
        status: "Completed",
        tone: "done",
        message: "The Manager Agent reads the incoming notes and identifies each piece of work that needs attention.",
        details: {
          input: `${rawItems.length} raw task lines`,
          decision: "Separate the intake into distinct work items",
          output: `${definedTasks.length} task candidates`,
          handoff: "Stay in singleAgentThread"
        }
      },
      {
        id: "define",
        title: "Define the to-do list",
        status: "Completed",
        tone: "done",
        message: "Vague wording is rewritten into clearer action statements so the user gets an executable to-do list.",
        details: {
          input: "Raw notes and checklist items",
          decision: "Normalize wording and preserve intent",
          output: "Defined to-do list",
          handoff: "Stay in singleAgentThread"
        }
      },
      {
        id: "analyze",
        title: "Detect urgency and blockers",
        status: blockers.length ? "Review needed" : "Completed",
        tone: blockers.length ? "warning" : "done",
        message: blockers.length
          ? "The workflow found potential blockers or duplicates that should be surfaced in the final answer."
          : "The workflow checked for deadlines, urgency, dependencies, and blocked work.",
        details: {
          input: "Defined tasks",
          decision: blockers.length ? "Flag risks for the final response" : "No material blockers found",
          output: blockers.length ? `${blockers.length} risk notes` : "Clean task set",
          handoff: "Stay in singleAgentThread"
        }
      },
      {
        id: "prioritize",
        title: "Organize the task board",
        status: "Completed",
        tone: "done",
        message: "The Manager Agent sorts work into today, thisWeek, and later so the plan is easy to act on.",
        details: {
          input: "Defined tasks with urgency cues",
          decision: `Today ${counts.today}, thisWeek ${counts.thisWeek}, later ${counts.later}`,
          output: "Prioritized board",
          handoff: "Stay in singleAgentThread"
        }
      },
      {
        id: "review",
        title: "Review the full workflow",
        status: "Completed",
        tone: "done",
        message: "The final review checks for missing work, duplicate wording, and scheduling conflicts before publishing.",
        details: {
          input: "Defined list plus prioritized board",
          decision: blockers.length ? "Publish with risks or blockers" : "Publish clean final answer",
          output: "Final manager-style plan",
          handoff: "Published by Manager Agent"
        }
      }
    ]
  };
}

function splitInput(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*0-9.)]+\s*/, "").trim())
    .filter(Boolean);
}

function normalizeTask(item) {
  const cleaned = item.replace(/\s+/g, " ").trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function classifyTask(title, index) {
  const value = title.toLowerCase();

  if (/\b(today|asap|urgent|now|immediately)\b/.test(value)) {
    return "today";
  }

  if (/\b(friday|tomorrow|this week|week|meeting|demo|review|submit|email|call)\b/.test(value)) {
    return "thisWeek";
  }

  if (/\b(later|eventually|someday|next month|backlog)\b/.test(value)) {
    return "later";
  }

  if (index === 0) {
    return "today";
  }

  if (index <= 3) {
    return "thisWeek";
  }

  return "later";
}

function describePriority(title, bucket, duplicate) {
  if (duplicate) {
    return "Priority kept, but this wording looks duplicated and should be confirmed.";
  }

  if (bucket === "today") {
    return /\b(today|asap|urgent|now)\b/i.test(title)
      ? "Placed in today because the wording signals immediate urgency."
      : "Placed in today because it looks like the most immediate concrete action.";
  }

  if (bucket === "thisWeek") {
    return "Placed in thisWeek because it appears near-term but not as urgent as today's work.";
  }

  return "Placed in later because it reads like planning, background work, or a lower-urgency item.";
}

function isBlocked(title) {
  return /\b(waiting|blocked|pending|awaiting|need approval|approval)\b/i.test(title);
}

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
