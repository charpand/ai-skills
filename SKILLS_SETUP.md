# Skills Setup for GitHub Copilot & OpenCode

This repository includes skills compatible with both **GitHub Copilot** and **OpenCode** using a single source of truth with symlinks.

## Structure

- **`skills/`** - Single source of truth containing all 14 SKILL.md files
- **`.claude/skills/`** - Symlinks to `skills/` for GitHub Copilot discovery
- **`.opencode/skills/`** - Symlinks to `skills/` for OpenCode discovery

Each skill is a directory with a `SKILL.md` file containing YAML frontmatter and markdown content.

## Available Skills (14 total)

**Engineering & Design Reviews:**
api-platform-design-review, css-design-review, github-cicd-review, go-design-review, html5-accessibility-review, php-design-review, supply-chain-verification, symfony-design-review, terraform-design-review, twig-template-review

**Governance & Quality:**
avoid-checkbox-participation, define-quality-bar, jip-en-janneke-explanation, translate-technical-to-nontechnical

## How It Works

Both Copilot and OpenCode discover skills by looking in their respective directories:

- Copilot finds `.claude/skills/<name>/SKILL.md`
- OpenCode finds `.opencode/skills/<name>/SKILL.md`

Both point to the same files via symlinks, eliminating duplication.

## Skill Format

```yaml
---
name: skill-name
description: First sentence from Intent section
license: CC-BY-4.0
compatibility: claude-dev,opencode
metadata:
  version: "1.0"
  category: "engineering"
---

# Skill Title

## Intent
...

## Mental Model
...

## Thinking Steps
...

## Quality Bar
...

## Common Failure Modes
...

## Example Use
...
```

## Usage

**GitHub Copilot:**

```text
@copilot Use the api-platform-design-review skill
```

**OpenCode:**

```text
/skill api-platform-design-review
```

## Maintenance

To update a skill:

1. Edit `skills/<skill-name>/SKILL.md` directly
2. Update the description if needed (extract first sentence from Intent section)
3. Both Copilot and OpenCode automatically see the change via symlinks

The `skills/` directory is now the canonical location. Old skill directories (engineering/, explaining/, governance/, meta/) have been removed.
