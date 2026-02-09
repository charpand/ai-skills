# Copilot Instructions for ai-skills

This repository contains agent skills: reusable thinking frameworks that define how reasoning should be performed and how output should be judged.

## What This Repository Contains

**Skills** - Not tasks, templates, or prompts. Each skill defines:
- A thinking framework or evaluation approach
- Quality criteria and mental models
- Common reasoning pitfalls to avoid

See `SKILL_USAGE.md` for detailed guidance on applying skills, and `AGENT_INSTRUCTIONS.md` for binding requirements when using this repository as context.

## Skill Domains

- **engineering/** - Infrastructure design, system architecture evaluation, and technical decision frameworks
- **explaining/** - Communication and translation frameworks for diverse audiences
- **governance/** - Decision quality, participation authenticity, and standards enforcement
- **meta/** - Meta-frameworks that apply to skill definition and quality itself

## Creating New Skills

Each skill MUST contain exactly these seven sections in order:

1. **Name** - Concise, descriptive title
2. **Intent** - What cognitive challenge this addresses and when to apply it
3. **Mental Model** - Core conceptual framework and underlying principles
4. **Thinking Steps** - Ordered reasoning steps and decision points
5. **Quality Bar** - Criteria distinguishing excellent from poor outcomes
6. **Common Failure Modes** - Typical reasoning errors and anti-patterns
7. **Example Use** - Abstract scenario demonstrating the thinking process

All skills must be agent-agnostic, domain-reusable, and time-stable. See `SKILL_USAGE.md` for validation requirements.

## Writing Style

- Third-person, declarative statements ("The agent evaluates..." not "You should...")
- Technical, precise, neutral tone
- No first/second-person pronouns, emojis, rhetorical questions, or exclamation points
- Bullet points for lists; numbered lists for sequences
- Concrete criteria over vague guidance

## Contributing

When adding new skills:
1. Ensure the skill describes thinking/evaluation, not task execution
2. Verify it applies across multiple unrelated domains
3. Include no references to specific projects, organizations, tools, or platforms
4. Validate all seven sections are present and complete
5. Use concrete examples, not real project names or proprietary data
6. Commit with message format: `skill(<domain>): <skill-name>`
