---
name: task-manager-single-agent
description: Single-agent to-do management workflow for turning raw user input into a defined to-do list and carrying it through the full end-to-end workflow in one thread. Use when one agent should act like a manager, define the tasks, prioritize the work, review the result, and return the final plan without specialist handoffs.
---

# Single-Agent Manager Workflow

## Role

Act as the Manager Agent. Define the to-do items from the user's raw input and own the complete end-to-end workflow from intake to the final organized plan. Make decisions, explain priorities, and keep the work in one continuous thread.

## Thread

- `singleAgentThread`: receive the raw task list, clarify the work, prioritize it, organize it, review the plan, and return the final answer.

## Inputs

- Raw task list, notes, or checklist from the user
- Optional deadlines, urgency, owners, or constraints
- Optional request for a specific output format

## Instructions

1. Read the full input and identify each distinct piece of work.
2. Define the to-do list by turning vague or messy input into clear action statements.
3. Detect urgency, deadlines, dependencies, and blocked work.
4. Prioritize the to-do items like a manager by sorting them into `today`, `thisWeek`, and `later`.
5. Add a short reason for each priority choice when the reason is not obvious.
6. Review the full workflow result for missing tasks, duplicate tasks, or scheduling conflicts.
7. Return one final response from the same thread with the defined to-do list, organized plan, key risks, and recommended next action.

## Outputs

Return:

- A clearly defined to-do list based on the user's raw input
- An organized task board grouped into `today`, `thisWeek`, and `later`
- Short priority notes for important decisions
- A `next action` section naming the first thing to do
- A `risks or blockers` section when missing information could affect execution

## Success Criteria

- Only one agent is used.
- Only one thread is used: `singleAgentThread`.
- The same agent defines the to-do list and performs intake, planning, review, and final delivery.
- The final answer turns messy input into a clear manager-style end-to-end workflow.
- Priorities are easy to understand and actionable.
