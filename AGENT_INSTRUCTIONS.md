# Agent Instructions for ai-skills Repository

This document defines binding requirements for agents using this repository as context.

## Purpose of This Repository

This repository contains **skills**: frameworks that define how thinking should be performed and how output should be judged. Skills are not tasks, templates, prompts, or execution procedures.

A skill answers: **"What does good thinking look like here?"**

## What a Skill Is

A skill:

- Describes a thinking framework or evaluation approach
- Defines quality criteria and mental models
- Encodes reasoning discipline
- Is agent-agnostic (no references to specific AI systems, tools, or platforms)
- Is time-stable (valid across technology changes)

## What a Skill Is NOT

Skills do not:

- Execute tasks or generate final deliverables
- Contain prompts, templates, or copy-paste content
- Reference specific projects, organizations, codebases, or documents
- Depend on prior conversation context
- Define workflows, procedures, or step-by-step instructions

If something describes what to produce rather than how to think, it does not belong in this repository.

## Guaranteed Skill Structure

Every skill contains exactly seven sections, in this order:

1. **Name** - Concise title
2. **Intent** - What cognitive challenge this skill addresses; when to apply it
3. **Mental Model** - Core conceptual framework and underlying principles
4. **Thinking Steps** - Ordered internal reasoning steps and decision points
5. **Quality Bar** - Explicit criteria distinguishing excellent from poor outcomes
6. **Common Failure Modes** - Reasoning errors, anti-patterns, and pitfalls this skill prevents
7. **Example Use** - Abstract scenario demonstrating the thinking process

Agents may rely on this structure. Additional sections are not standard and should not be assumed.

## How Agents MUST Use This Repository

### Requirement 1: Explicit Selection

Before reasoning, the agent MUST:

- Identify which skills apply to the situation
- State them explicitly rather than implying their application
- Acknowledge skills that could apply but do not

### Requirement 2: Skills as Reasoning Constraints

The agent MUST:

- Use each skill's Mental Model to frame the problem
- Follow the Thinking Steps internally during reasoning
- Apply the Quality Bar to evaluate work before presenting it
- Actively work to avoid Common Failure Modes

Skills are not suggestions or guidelines. They define how reasoning must be performed.

### Requirement 3: Respect Skill Boundaries

The agent MUST NOT:

- Paraphrase or reinterpret skills
- Merge multiple skills into vague "best practices"
- Override or selectively apply parts of a skill
- Treat skills as optional
- Invent new skills during execution

### Requirement 4: Task Execution Deference

If this repository is provided alongside task definitions (e.g., in project-specific documentation):

- Follow the task definition for what to produce
- Use skills only for how to think about and judge that output
- Do not let skill application prevent task execution

## Skill Combination Rules

Multiple skills may be applied together. When combining skills:

- **Reinforcement**: If multiple skills point toward the same reasoning, apply all of them
- **Layering**: Different skills may address different aspects of a problem; apply each to its domain
- **Conflict resolution**: If skills create conflicting recommendations, the agent MUST:
  1. Surface the conflict explicitly
  2. Identify which aspects each skill applies to
  3. Resolve by deferring to meta-skills (skills about skill definition take precedence over domain-specific skills)
  4. State the resolution clearly

## Quality Expectations

When applying skills from this repository, agent output MUST:

- Reflect the Mental Model of each applied skill
- Follow the Thinking Steps internally
- Meet or exceed the Quality Bar of each applied skill
- Actively demonstrate awareness of and avoidance of Common Failure Modes

If output cannot meet the specified Quality Bar, the agent MUST state this explicitly and explain why, rather than presenting substandard work as if it meets the bar.

## Prohibited Behaviors

Agents MUST NOT:

- Paraphrase skills instead of applying their logic
- Collapse multiple distinct skills into vague "best practices" language
- Treat skill requirements as aspirational or optional
- Reference this document, the repository structure, or meta-instructions in user-facing output unless explicitly requested
- Invent new skills or extensions to skills
- Treat skill application as performative (going through motions rather than genuine application)

## Transparency Requirement

If the agent believes:

- A skill does not apply, state why
- A skill creates ambiguity, surface the ambiguity explicitly
- Skills conflict in a way that prevents execution, escalate this to the user
- Output cannot meet the Quality Bar, state this clearly

Explicit reasoning about skill application is preferable to silence or implicit behavior.

## Summary

- **Skills define thinking discipline, not procedures**
- **Task definitions define what to produce; skills define how to think about it**
- **Quality is non-negotiable once a Quality Bar is defined**
- **Explicit reasoning and transparent skill application beats implicit behavior**

Follow skills strictly. If something feels ambiguous, surface the ambiguity instead of guessing.

## Commit Message Standard

This repository requires all commits to follow the Conventional Commits specification. See the full standard and guidelines in the `knowledge-work` repository at `advisory/conventional-commits-standard.md`.

When committing changes to this repository:

- Use the proper commit type (`feat`, `fix`, `docs`, etc.)
- Include optional scope in parentheses if relevant
- Write clear, imperative subject lines (max 50 characters)
