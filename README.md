# ai-skills

Reusable thinking frameworks and evaluation patterns for GitHub Copilot and OpenCode.

## What This Is

This repository contains **skills**: frameworks that define how thinking should be performed and how output should be judged. Each skill provides:

- A conceptual framework (Mental Model)
- Ordered reasoning steps (Thinking Steps)
- Quality criteria and success indicators (Quality Bar)
- Common pitfalls to avoid (Common Failure Modes)
- Practical application example (Example Use)

## Using Skills

### With GitHub Copilot

Skills are discoverable in `.claude/skills/` and can be referenced:

```text
@copilot Use the api-platform-design-review skill to evaluate this API design
```

### With OpenCode

Skills are discoverable in `.opencode/skills/` and can be loaded:

```text
/skill api-platform-design-review
```

## Available Skills (14 total)

All skills are located in `skills/`:

- **api-platform-design-review** - Evaluate API Platform applications
- **css-design-review** - Review CSS design patterns
- **github-cicd-review** - Assess GitHub Actions workflows
- **go-design-review** - Review Go codebases
- **html5-accessibility-review** - Evaluate HTML5 accessibility
- **php-design-review** - Review PHP code quality
- **supply-chain-verification** - Verify software supply chain security
- **symfony-design-review** - Review Symfony applications
- **terraform-design-review** - Evaluate Infrastructure-as-Code
- **twig-template-review** - Review Twig templates
- **avoid-checkbox-participation** - Prevent performative participation
- **define-quality-bar** - Establish quality standards
- **jip-en-janneke-explanation** - Explain complex concepts
- **translate-technical-to-nontechnical** - Translate for diverse audiences

## Repository Structure

```text
skills/                    # Source of truth (14 SKILL.md files)
├── api-platform-design-review/
│   └── SKILL.md
├── ...
.claude/skills/            # Symlinks → GitHub Copilot
.opencode/skills/          # Symlinks → OpenCode
```

See `SKILLS_SETUP.md` for architecture and maintenance details.

## Documentation

- `SKILLS_SETUP.md` - Setup architecture and usage guide
- `SKILL_USAGE.md` - Detailed guidance for applying skills
- `AGENT_INSTRUCTIONS.md` - Binding requirements for agents using this repository
