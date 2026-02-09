# Jip-en-Janneke Explanation Mode

## Intent

Some concepts are so complex that explaining them requires extreme, systematic simplification: removing all but the core mechanism, using only everyday language and objects, and explicitly stating what is being omitted. This framework guides the process of creating explanations so fundamental they could be understood by those with minimal prior knowledge. The agent applies this skill when an audience needs to understand a concept deeply but lacks background to digest typical explanations, or when a technical team needs to verify that a concept is truly understood by testing whether it can be explained in extremely simple terms.

## Mental Model

Extreme simplification operates under the principle that **if a concept cannot be explained simply, it is either not truly understood or genuinely requires prerequisites**. The process is not about dumbing down but about stripping away ornament to expose structure. The metaphor is clearing debris from an archaeological site: the goal is not to destroy context but to reveal what was always there underneath the accumulated layers.

A "Jip-en-Janneke explanation" uses the vocabulary and conceptual resources available to someone without specialized training. It relies on: immediate sensory experience (what can be seen, heard, touched), common objects and activities, and simple logical relationships. It explicitly states what dimensions of the concept are being set aside and why, rather than pretending the simplified version is complete.

## Thinking Steps

1. **Identify what you are actually trying to convey**: What single core idea or mechanism does the audience need to understand? What would be incomplete or wrong about their mental model if they missed this?

2. **Strip away layers of abstraction**: What technical jargon, mathematical notation, implementation details, or domain expertise can be removed? What remains when all the specialist apparatus is gone?

3. **Find concrete referents**: What objects, activities, or everyday experiences embody the same structure or principle? Can the core mechanism be shown through something the audience can observe or do?

4. **Name what is being omitted**: What dimensions of the real concept are being simplified, idealized, or left out? State this explicitly rather than pretending the simplified version is complete.

5. **Test for logical consistency**: Does the simplified explanation contain contradictions? Can the audience explain the consequences and edge cases based on the simplified model?

6. **Verify conceptual coherence**: If the audience understood only this simplified explanation, would their mental model be directionally correct? Would they make reasonable predictions about how the thing works?

7. **Build a bridge to complexity**: If the audience later encounters the full complexity, could they connect it to the simple explanation? Does the simple version provide a foundation they can build on?

## Quality Bar

**Excellent extreme simplification exhibits**:
- Uses only vocabulary that a person without domain knowledge would understand
- Relies on immediate sensory experience or common objects rather than requiring specialized knowledge
- Explicitly states what is being simplified, removed, or idealized
- Explains why those simplifications are acceptable for understanding the core concept
- The core mechanism is clear; someone could predict basic behavior from the explanation
- Logical consistency: the explanation does not contain internal contradictions
- Provides a foundation that later learning can extend rather than contradict
- The simplification reveals rather than obscures the real structure

**Poor extreme simplification exhibits**:
- Uses technical jargon or domain-specific language
- Requires specialized knowledge or previous concepts to understand
- Omits important qualifications without stating that it is doing so
- Introduces metaphors so loose they distort the core concept
- The mechanism is still opaque; the audience could not predict behavior from the explanation
- Creates false mental models that later learning must correct
- Oversimplifies to the point of inaccuracy
- Treats the simple version as complete rather than acknowledging what is omitted

## Common Failure Modes

**Metaphor without mechanism**: Using loose analogies that sound accessible but do not convey the actual mechanism. Example: explaining a network packet as "like sending a letter" without explaining what makes packet loss possible or why order matters. This creates a comforting sound-alike rather than understanding.

**Vocabulary substitution**: Replacing technical terms with everyday-sounding ones without actually simplifying. Example: saying "the code talks to the database" instead of "queries." This sounds simpler but does not illuminate what is actually happening.

**Removing necessary constraints**: Simplifying by omitting critical limitations that the audience needs to understand. Example: explaining electricity as "like water flowing through pipes" but omitting that pipes can only handle so much flow, which is why overloading causes problems.

**Jargon smuggling**: Introducing specialized concepts or terms disguised in everyday language, so they sound simple but are not. Example: "the algorithm optimizes performance" uses "algorithm" and "optimizes" without explaining them.

**False completeness**: Presenting the simplified explanation as complete rather than explicitly stating what is being left out. This creates false confidence that the audience fully understands something they do not.

**Directional inaccuracy**: Simplifying so drastically that the core mechanism is distorted. The simplified version is so far from the truth that when the audience later learns the reality, they must unlearn the simplification.

**Assuming residual knowledge**: Forgetting what specialized knowledge the audience does not possess. For example, explaining "the cache stores recently-accessed data" to an audience that does not know what a cache is or why previously-accessed data is relevant.

## Example Use

An engineer needs to explain to an executive board why a particular database optimization improved performance. Technical explanation would involve query execution plans, index structures, and algorithmic complexity.

Extreme simplification framework suggests:

First, identify the core mechanism: searches are faster because the system now finds relevant information without reading everything. That is the essential idea.

Strip away abstractions: Remove index structures, B-trees, hash tables, query optimization algorithms. What remains? Searching.

Find concrete referents: Searching is like finding a name in a phone book. Without organization, finding one person requires reading every page. With alphabetical organization, the system can skip directly to the right section.

Name the omission: "This is like alphabetical organization. The real explanation involves more complicated structures, but the principle is the same: organizing information so that finding it does not require reading everything."

Explain why the simplification is acceptable: "For understanding why performance improved, knowing the principle—that information is organized so searches can skip irrelevant data—is sufficient. The specific organization mechanism does not change the basic fact that skipping irrelevant data makes searches faster."

Test for coherence: "Based on this explanation, an executive could predict: if the database added more data, performance would still be good as long as the organization mechanism remains efficient. If we stopped organizing data, performance would slow down again. If we organized data in multiple ways, we could make different types of searches fast." These predictions align with reality.

Build a bridge: "Later, if the board member wanted to understand the technical details, they could learn that instead of alphabetical organization, the system uses a specific structure called an index, which works on the same principle: organizing data so searches can skip what is not relevant."

The simplified explanation conveys the core insight—that organization enables efficient search—without requiring expertise in database internals. It provides a foundation on which more technical understanding can build. And it explicitly acknowledges that the real story is more complex while conveying the essential mechanism.
