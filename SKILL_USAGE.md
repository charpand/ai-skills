# Skill Usage Reference

This document provides detailed guidance for agents on applying skills from the ai-skills repository.

## Quick Start: Applying a Skill

1. **Identify the situation**: What thinking or evaluation is required?
2. **Select relevant skills**: Which skills address this thinking task?
3. **Read the Mental Model**: Understand the framework
4. **Execute Thinking Steps**: Use the ordered steps to structure reasoning
5. **Validate against Quality Bar**: Does the output meet the stated criteria?
6. **Avoid Common Failure Modes**: Actively prevent known reasoning errors
7. **Reference the Example**: If unclear, see how the skill was meant to be applied

## Reading a Skill File

Each skill has a predictable structure:

### Name

The skill's title. Use this when referencing the skill explicitly.

### Intent

- What cognitive challenge this skill addresses
- When to apply it
- What types of reasoning it enables

Read Intent to verify the skill is relevant before investing time.

### Mental Model

The core framework. This is not procedural—it is conceptual.

It answers: "What is the underlying structure or principle at work here?"

The Mental Model provides the lens through which Thinking Steps should be executed.

### Thinking Steps

Ordered internal reasoning steps. These are not execution steps; they are evaluation or decision-making steps.

Apply Thinking Steps in sequence. Each step builds on prior ones.

Thinking Steps may include branches (e.g., "if X is true, proceed to step N; otherwise continue here"). Follow those branches.

### Quality Bar

**Two parts**:

1. **Excellent design exhibits** - Observable characteristics of work that meets the standard
2. **Poor design exhibits** - Observable characteristics of work that fails the standard

Before presenting output, verify it exhibits the characteristics of excellent design and does not exhibit the characteristics of poor design.

The Quality Bar is objective. If output does not meet it, do not present it as meeting the bar.

### Common Failure Modes

Typical reasoning errors, anti-patterns, and pitfalls this skill prevents.

After applying the skill, check your reasoning against these modes. If your reasoning exhibits a failure mode, reconsider.

### Example Use

An abstract scenario demonstrating the skill in practice.

The example shows:

- The initial situation or question
- How Thinking Steps apply
- How the framework shaped reasoning
- The conclusion or recommendation (not the final output)

Do not treat the example as a template to imitate. It illustrates the *type* of reasoning, not the specific output.

## Combining Multiple Skills

### When Multiple Skills Apply

If multiple skills address different aspects of a problem, apply each to its domain.

Example:

- Use "Define and Enforce a Quality Bar" when establishing what acceptable output looks like
- Use "Terraform Design Review" when evaluating whether a specific design meets that bar

### When Skills Reinforce

If multiple skills point toward the same reasoning, apply all of them to build confidence.

Example:

- Both "Translate Technical Concepts to Non-Technical Audiences" and "Jip-en-Janneke Explanation Mode" may apply to simplification tasks
- Use both: first skill addresses general translation, second addresses extreme simplification
- Output should meet the Quality Bar of both

### When Skills Conflict

If two skills recommend different approaches:

1. **Read both Mental Models carefully**: Is the conflict real or apparent?
2. **Check the Intent sections**: Do both skills actually apply to your situation?
3. **Identify which applies first**: Meta-skills (those about standards, process, or skill definition itself) take precedence over domain-specific skills
4. **Surface the conflict explicitly**: Explain to the user that applying skill A contradicts applying skill B, and state which you prioritized and why

Example conflict:

- "Avoid Checkbox Participation" says decisions should have multiple genuinely-possible outcomes
- "Define and Enforce a Quality Bar" says standards should be consistently applied
- These can conflict: consistent standards can feel constraining to participation
- Meta-skill resolution: "Define and Enforce" takes precedence when non-negotiable quality is required

### Layers of Application

Skills can be layered without conflict:

- "Terraform Design Review" evaluates *infrastructure code specifically*
- "Define and Enforce a Quality Bar" applies to *standards across any domain*
- Both apply to infrastructure: first skill is the lens, second skill is the standard-setting framework

## Identifying When a Skill Applies

### Read the Intent First

The Intent section explicitly states when the skill should be applied. If your situation matches the Intent, the skill applies.

### Negative Test: When a Skill Does NOT Apply

- A skill addresses technical reasoning; your situation is about human interpersonal dynamics → skill does not apply
- A skill addresses communication; your situation requires evaluation of code → skill may not apply (check Intent carefully)
- A skill addresses infrastructure design; you are designing authentication systems → skill likely does not apply, though elements might

Do not force skills into situations where they do not belong.

## Validation: Does Output Meet the Quality Bar?

Before presenting work, check **both** aspects of the Quality Bar:

1. **Does output exhibit characteristics of excellent design?**
   - Check each characteristic listed
   - If any is missing, consider why

2. **Does output exhibit any characteristics of poor design?**
   - Check each anti-characteristic listed
   - If any is present, revise the work

If output meets all "excellent" characteristics and exhibits none of the "poor" characteristics, it meets the bar.

If output cannot meet the bar, state this explicitly rather than presenting substandard work.

## Preventing Common Failure Modes

After applying a skill and developing output:

1. **Read Common Failure Modes**
2. **Self-audit**: Does my reasoning or output exhibit any of these modes?
3. **If yes**: Reconsider the reasoning or output to eliminate the failure mode

Example audit:

- Skill: "Jip-en-Janneke Explanation Mode"
- Failure mode: "Vocabulary substitution: replacing technical terms with everyday ones without simplifying"
- Self-audit: "Did I just swap 'algorithm' for 'process' without actually explaining what the process is?"
- If yes: revise the explanation to actually convey the mechanism

## When to Escalate

Tell the user explicitly if:

- A skill does not clearly apply to the situation
- Skills create a genuine conflict that you cannot resolve
- Output cannot meet the Quality Bar despite applying the skill correctly
- You are uncertain how to apply a step in Thinking Steps
- The situation reveals a limitation or gap in the skill's framework

Explicit reasoning beats silent assumption.

## Using Example Use Sections

The Example Use section is not a template. It demonstrates:

- The *type* of reasoning the skill enables
- How the Mental Model shaped that reasoning
- Where the Thinking Steps led
- What the conclusion looks like

Do not:

- Copy the example's structure for your output
- Assume your situation should follow the example's path exactly
- Treat the example as a "correct answer" rather than one application of the framework

Do:

- Understand the shape of reasoning the example demonstrates
- Apply the framework to your specific situation
- Let the Mental Model guide your reasoning, not the example's conclusion

## Reference: Skill Domains

### engineering/

Frameworks for infrastructure design, system architecture, and technical decision evaluation.

Example skills: infrastructure modularity, design review, system complexity assessment.

### explaining/

Frameworks for communication, translation, and exposition to diverse audiences.

Example skills: simplification, translation, clarity.

### governance/

Frameworks for decision quality, participation authenticity, and standards enforcement.

Example skills: participation authenticity, standards definition, quality consistency.

### meta/

Frameworks about frameworks: skill definition, quality bar establishment, and meta-reasoning.

Example skills: quality bar definition, skill architecture itself.

Meta-skills take precedence when they conflict with domain-specific skills.
