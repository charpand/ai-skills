---
name: translate-technical-to-nontechnical
description: Technical concepts often require translation for audiences without specialized knowledge, but careless simplification distorts meaning, introduces inaccuracy, or implies condescension.
license: CC-BY-4.0
compatibility: claude-dev,opencode
metadata:
  version: "1.0"
  category: "engineering"
---

# Translate Technical Concepts to Non-Technical Audiences

## Intent

Technical concepts often require translation for audiences without specialized knowledge, but careless simplification distorts meaning, introduces inaccuracy, or implies condescension. This framework guides the reasoning process for mapping technical concepts to accessible language while preserving essential truth and respecting the audience's intelligence. The agent applies this skill when audience members need to understand technical topics to make decisions, participate in discussions, or comprehend consequences—cases where both accuracy and accessibility matter.

## Mental Model

Effective translation operates at the **interface between technical precision and contextual relevance**. The core principle is that every technical concept has a purpose: it solves a problem, represents a constraint, or describes a trade-off. Translation requires identifying which elements are essential for understanding that purpose and which are implementation details that obscure rather than clarify.

Accurate translation preserves what the audience needs to know while removing what they do not. It uses analogies rooted in shared experience rather than introducing new jargon. It names uncertainties and limitations explicitly rather than implying false certainty.

## Thinking Steps

1. **Identify the core purpose**: What decision, consequence, or action does understanding this concept enable? What happens if the audience lacks this understanding?

2. **Distinguish essential from peripheral**: Which aspects of this concept directly relate to the purpose? Which are implementation details, historical artifacts, or technical minutiae?

3. **Identify the conceptual obstacle**: What makes this concept difficult for audiences without this background? Is it unfamiliar vocabulary, abstract relationships, non-intuitive constraints, or required mental models?

4. **Extract the underlying pattern**: What simpler concept, familiar process, or everyday analogy shares the essential structure? Does the analogy preserve or distort the key properties?

5. **Verify the mapping**: If the audience understands the analogy, what might they misunderstand about the technical concept? Where does the analogy break down? Are those breakdowns important for the specific decision or context?

6. **Layer the explanation**: Can the concept be explained at multiple depths, with the shallow explanation providing intuition without requiring specialized background, and deeper layers available for audiences seeking more detail?

7. **Test for condescension**: Does the language assume the audience is unintelligent, or does it recognize they are intelligent but lack specific background? Does it avoid false equivalences that oversimplify to the point of inaccuracy?

## Quality Bar

**Effective translation exhibits**:

- The core purpose and consequences are clear to someone hearing the explanation for the first time
- Language uses everyday vocabulary and familiar concepts without introducing unexplained jargon
- The explanation preserves the essential constraints, trade-offs, and limitations the audience needs to know
- An intelligent person unfamiliar with the domain can make reasonable decisions based on the explanation
- The explanation explicitly states what it simplifies and why, rather than implying false completeness
- Analogies are explicitly labeled as analogies and their limitations are stated
- The explanation is accurate: it does not require later correction or qualification

**Ineffective translation exhibits**:

- Dense jargon that non-specialists cannot parse without a dictionary
- Analogies that oversimplify to the point of inaccuracy or create false intuition
- Missing critical constraints or consequences the audience needs to understand
- Condescending tone that implies the audience is unintelligent
- Vague abstractions that sound accessible but convey no actual understanding
- Misleading statements that technically mean something but are unlikely to produce accurate mental models
- Difficulty for the audience to extract any actionable understanding

## Common Failure Modes

**Over-simplification through false equivalence**: Using analogies that sound accessible but distort essential characteristics, causing the audience to develop incorrect mental models. Example: explaining a cache as "like writing notes" when the essential aspect—that cached data might be stale—gets lost.

**Jargon replacement without explanation**: Substituting one unexplained term for another without illuminating the underlying concept. Example: replacing "latency" with "slowness" rather than explaining what causes the slowness and why it matters.

**Removing necessary constraints**: Simplifying by omitting limitations or edge cases that the audience needs to understand to make good decisions. Example: describing a database as "fast" without mentioning that speed degrades under certain conditions the audience might encounter.

**Talking down to the audience**: Using overly simple language, short sentences, or condescending examples that insult the audience's intelligence rather than respecting their lack of specific background.

**Privileging accessibility over accuracy**: Choosing ease of explanation over truth, or using technically misleading language that avoids difficult concepts rather than working to explain them clearly.

**Assuming shared mental models**: Using analogies or references that assume background knowledge the audience does not possess, defeating the purpose of translation.

**Incomplete mapping**: Explaining a concept in isolation without connecting it to how it affects decisions, consequences, or the audience's context, leaving the explanation abstract and disconnected from purpose.

## Example Use

A finance team needs to understand why system reliability improvements provide business value. The technical team's initial explanation: "We need to reduce our P99 latency from 500ms to 100ms and increase availability from 99.5% to 99.95% through architectural redesign."

Analysis of the conceptual obstacle: The audience likely understands "faster is better" and "fewer outages is better," but does not have intuition for what these percentages and milliseconds represent in business terms, what causes these limitations, or why the improvement requires redesign rather than just optimization.

Translation framework suggests:

- The P99 latency metric represents: "When 100 customers use the system simultaneously, one of them experiences a 500-millisecond delay. This delay is long enough that the customer perceives it as broken."
- The availability metric represents: "The system is unavailable for approximately 3.6 hours per year. This means that during those hours, customers cannot complete transactions."
- The architectural constraint: "Current design shares resources among customer requests, so a single slow request delays others. The improvement requires isolating resources so one customer's problem does not affect others."
- The business consequence: "Reducing visible delays means customers perceive the system as reliable and responsive. Reducing outages means the revenue lost to unavailability decreases by approximately [amount]."

The translation preserves the technical reality (specific metrics and constraints) while connecting to why the finance team cares (customer perception, revenue impact). It explicitly explains what causes the current limitation so the audience understands whether the problem is common, rare, or affecting specific customer segments. It makes the distinction between "faster" and "some customers experience reasonable delays" concrete.

The mapping reveals a gap: the technical team did not explain why current architecture creates these limitations or why the proposed design changes would fix them. The translation forces clarity on that architectural reasoning, which the finance team needs to evaluate the proposed investment.
