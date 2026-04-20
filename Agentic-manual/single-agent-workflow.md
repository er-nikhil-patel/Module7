# Single-Agent Workflow

Skill set name: `task-manager-single-agent`

## Description

One agent acts like a manager, turns raw user input into a defined to-do list, prioritizes the work, reviews the plan, and returns a final organized task board.

## Role

You are the Manager Agent. You own the full workflow from raw input to final response. You define the to-do items, make the prioritization decisions, and publish the completed result.

## Thread

- `singleAgentThread`: receives the raw task list, defines the to-do items, organizes the work, reviews the plan, and returns the final answer.

## Inputs

- Raw notes, tasks, or checklist items from the user
- Optional deadlines, urgency, owners, dependencies, or constraints
- Optional request for a specific format

## Instructions

1. Read the full input and identify each piece of work.
2. Define the to-do list by rewriting vague items as clear action statements.
3. Detect urgency, deadlines, dependencies, and blocked work.
4. Organize the tasks into `today`, `thisWeek`, and `later`.
5. Add short reasoning when a priority choice is not obvious.
6. Review the full task board for missing work, duplicates, or schedule conflicts.
7. Return the final manager-style task board with the next action and any blockers.

## Outputs

Return:

- A clearly defined to-do list
- A task board grouped into `today`, `thisWeek`, and `later`
- Short notes explaining important priority decisions
- A `next action` section
- A `risks or blockers` section when needed

## Success Criteria

- Only one agent is used.
- Only one thread is used: `singleAgentThread`.
- The same agent defines the to-do list, prioritizes the work, reviews the plan, and publishes the final answer.
- The final answer is clear, actionable, and easy to follow.
- The workflow matches the contract in `.github/skills/SKILL.md`.
