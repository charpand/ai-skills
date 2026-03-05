# Define and Enforce a Quality Bar

## Intent

Standards and quality criteria often remain implicit, subjective, or inconsistently applied, causing work to be recycled, stakeholders to hold conflicting expectations, and teams to expend effort on invisible improvements. This framework guides the process of making quality criteria explicit, observable, and enforced consistently. The agent applies this skill when establishing standards for code, documentation, design, analysis, or any work product where consistent quality matters—situations where vague expectations create friction, rework, or unclear boundaries between acceptable and unacceptable outcomes.

## Mental Model

A quality bar is a **set of explicit, observable criteria that distinguish acceptable from unacceptable outcomes**, combined with **consistent enforcement mechanisms**. An effective quality bar: (1) states criteria in concrete, testable terms rather than vague adjectives; (2) is observable without interpretation—someone checking the bar can objectively determine whether work meets it; (3) is enforced consistently, so meeting the bar at time one predicts acceptance at time two; and (4) is proportionate—the effort required to meet the bar scales with the stakes of the decision or work.

The core principle is that **unstated or inconsistently-enforced standards create waste**: work is accepted then later rejected for unclear reasons, contributors expend effort optimizing for unstated criteria, and stakeholders hold conflicting mental models of what "acceptable" means.

## Thinking Steps

1. **Identify what quality means for this context**: What makes an acceptable outcome acceptable? What would make it unacceptable? What consequences follow from poor quality?

2. **Distinguish criteria levels**: Are there different quality expectations for different contexts (critical path versus exploratory work, production versus prototype)? How should those differences manifest?

3. **Make criteria concrete and observable**: For each quality dimension, how can it be checked objectively? What evidence demonstrates that the criterion is met? Can it be measured, tested, or verified without interpretation?

4. **Identify the enforcement point**: Where should the quality bar be checked? During creation, before integration, during review, or in production? What happens when work does not meet the bar?

5. **Examine consistency mechanisms**: How will the bar be applied consistently over time? Who is responsible for enforcement? What prevents drift where standards are enforced differently depending on timeline pressure or who created the work?

6. **Test for proportionality**: Is the effort required to meet this bar proportionate to the consequences of failure? Does the bar create waste by requiring unnecessary rigor for low-stakes work, or inadequate rigor for high-stakes work?

7. **Build in evolution**: How will the bar be updated as context changes? What process allows revision without creating instability or requiring retrospective rework of previous contributions?

8. **Examine visibility and feedback**: Can contributors see where they fall short before submitting work? Do they receive prompt feedback on whether work meets the bar?

## Quality Bar

**Effective standards exhibit**:

- Criteria are stated in concrete, testable language; no vague terms like "good," "clean," or "professional" without definition
- Acceptance can be objectively verified without interpretation or subjective judgment
- Examples and counter-examples are provided that clearly show what meets and fails the standard
- The standard is enforced consistently; work that met the bar in the past still meets it in the present
- Contributors can self-check work before submission to understand whether it meets the bar
- The standard is proportionate; effort required to meet it scales with decision stakes
- Exceptions to the standard are explicitly documented with reasoning, not silently tolerated
- The standard is regularly reviewed and updated as context changes

**Ineffective standards exhibit**:

- Criteria use vague language like "well-written," "professional," or "appropriate"
- Acceptance requires interpretation or subjective judgment by reviewer
- Unstated or inconsistent enforcement: work meeting the bar at time one is rejected at time two
- Contributors cannot determine whether work meets the bar without external review
- The standard requires excessive rigor for low-stakes work or insufficient rigor for high-stakes work
- Exceptions are tolerated silently and inconsistently
- The standard remains fixed even as context changes, becoming either obsolete or increasingly burdensome
- Enforcement depends on who created the work or timeline pressure rather than consistent application

## Common Failure Modes

**Vague aspirational standards**: Standards are stated as adjectives without concrete criteria. Example: "Code should be clean and maintainable" without defining what those terms mean, what they exclude, how to verify them, or what happens when code is not clean. Result: subjective rejection and rework.

**Unenforced standards**: Standards are defined but not consistently enforced. Some work is accepted without meeting them, creating inconsistency and undermining the standard. Result: standards become advisory rather than binding, and contributors learn to ignore them.

**Disproportionate rigor**: The bar requires effort incommensurate with stakes. Example: requiring extensive documentation and testing for low-impact exploratory work, or minimal review for critical-path decisions. Result: wasted effort or inadequate quality where it matters.

**Hidden standards**: The real acceptance criteria are implicit in reviewers' preferences but not stated. Work is rejected for reasons not mentioned in published standards. Result: uncertainty, rework, and frustration for contributors.

**Moving targets**: Standards change inconsistently without communication. Work that was acceptable last month is now rejected. Result: loss of trust in the standard and confusion about expectations.

**No feedback loop**: Contributors cannot easily determine whether work meets the bar before submission. They discover shortcomings only after formal review. Result: wasted effort and long review cycles.

**Context blindness**: Standards are applied identically regardless of context, requiring the same rigor for throwaway prototypes as for production systems. Result: friction, perceived unfairness, and slowed iteration.

**Zero transparency about exceptions**: Exceptions to the standard are made silently, without explaining why this work is different. Result: other contributors see inconsistent enforcement and question the legitimacy of the standard.

## Example Use

A team establishes that code review is required before deployment. However, "code review" is never defined. Reviewers have different expectations. Some focus on style, others on architecture, others on test coverage. Some reviews are superficial sign-offs, others result in extensive revision cycles.

Contributors become frustrated. The review process feels arbitrary. Sometimes code is accepted quickly; other times it is rejected for reasons the contributor does not understand. A new contributor submits code that mirrors a previously-accepted pattern but is rejected for that exact pattern.

Analysis reveals no explicit standards. The team needs to define the quality bar concretely:

1. **What does review actually check?** The team identifies that substantive reviews should verify: (a) the code change matches its stated purpose, (b) the logic handles documented edge cases, (c) tests cover the changed behavior, (d) the change does not introduce obvious security or performance problems.

2. **What does review NOT check?** Style is not reviewed (a linter handles that), performance micro-optimizations are not required (only obvious inefficiencies), and architectural restructuring is not expected in reviews (it requires design discussion beforehand).

3. **How is acceptance verified?** A reviewer signs off by confirming: code builds, tests pass, documented edge cases are handled, no security issues are evident. These are observable facts, not interpretations.

4. **How is consistency maintained?** The team adopts a checklist that reviewers use for every review. They track reviews to identify patterns (reviewers who consistently require changes or rarely do), and discuss those patterns monthly.

5. **What about edge cases?** If code is novel or high-risk, an additional architectural review is required before code review. If code is internal-only test infrastructure, full review is deferred to a lighter checklist.

6. **How do contributors know they meet the bar?** Before submitting, contributors verify: the change matches its stated purpose, they documented edge cases and verified the code handles them, tests cover the changed behavior, no obvious security or performance issues exist. If the change is novel, they request design review first.

7. **When does the standard change?** The team reviews the standard quarterly. Changes require team discussion and are communicated before taking effect, giving contributors time to adjust.

After implementing explicit standards with consistent enforcement, the review cycle accelerates. Contributors understand expectations upfront. Reviewers apply consistent criteria. Rejections are explained by reference to the explicit standard rather than felt as subjective preferences.
