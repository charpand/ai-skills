# Terraform Design Review

## Intent

Infrastructure-as-code design quality extends beyond syntax correctness to encompass modularity, maintainability, composability, and operational resilience. This framework guides systematic evaluation of infrastructure designs to distinguish robust, scalable approaches from those that create hidden technical debt or operational fragility. The agent applies this skill when assessing whether infrastructure patterns adequately isolate concerns, facilitate future modification, handle failure modes, and scale across organizational boundaries.

## Mental Model

Well-designed infrastructure-as-code follows the principle of **separation of concerns with clear contracts**. Each module or component should encapsulate a single, well-defined responsibility and expose only the decisions that consumers must control. Poor design conflates concerns, embeds rigid assumptions, creates implicit dependencies, or distributes related logic across disconnected locations.

The underlying principle is that infrastructure code is a form of specification: it describes the intended state and its constraints. When that specification is unclear, coupled, or incomplete, the resulting infrastructure becomes difficult to reason about, modify, or troubleshoot.

## Thinking Steps

1. **Identify the logical boundaries**: What distinct responsibilities does this infrastructure configuration contain? Are responsibilities that logically belong together physically separated?

2. **Examine module inputs and outputs**: Which inputs are truly variable decisions versus which are configuration details that should be hidden? Are consumers forced to know about internal implementation details?

3. **Trace dependency flows**: Can the agent identify where one component depends on another? Are those dependencies explicit (via inputs/outputs) or implicit (hard-coded references, discovery mechanisms)? Are circular dependencies present?

4. **Evaluate isolation of state**: Does the infrastructure configuration clearly separate mutable state from immutable specification? Are consumers able to manage lifecycle independently?

5. **Assess failure scenarios**: If a component fails or is modified, which other components experience consequences? Are those consequences intentional or accidental?

6. **Review decision distribution**: Where are critical architectural decisions embedded? Are they made explicitly during configuration or buried in code logic where they are invisible to operators?

7. **Examine composition patterns**: Can modules be combined in multiple valid configurations? Are the constraints on valid combinations documented and enforced?

## Quality Bar

**Excellent design exhibits**:

- Modules with a single, unambiguous responsibility that can be stated in one sentence
- Input variables limited to externally-variable decisions, with sensible defaults for technical details
- Explicit dependency declarations; dependencies are never implicit or discovered at runtime
- Clear separation between what a component provides and how it accomplishes that
- Configurations that can be modified or replaced without cascading consequences
- Failure of one component does not prevent understanding or modification of others
- Each responsibility can be tested, deployed, and modified independently from logically unrelated responsibilities

**Poor design exhibits**:

- Modules with multiple responsibilities requiring simultaneous modification
- Inputs that expose implementation details or require consumers to make technical decisions
- Hard-coded values, assumptions, or environment-specific logic scattered throughout
- Implicit dependencies that require reading code to understand what depends on what
- Modification to one component requiring changes in multiple locations
- Tight coupling between logically independent components
- Cryptic variable names or values that obscure intention

## Common Failure Modes

**Over-parameterization**: Exposing every internal configuration value as a variable, forcing consumers to understand and specify technical details they should never need to consider. This moves the burden of architectural decision-making from the designer to every consumer.

**Environment-specific hardcoding**: Embedding environment assumptions (region, availability zone, naming scheme, quota values) in code rather than as explicit inputs, making the code non-portable and difficult to reason about.

**Monolithic aggregation**: Combining multiple logically distinct resources or concerns into a single module, preventing independent lifecycle management or reuse in different contexts.

**Implicit coupling**: Using service discovery, naming conventions, or run-time parameter lookups to create dependencies that do not appear in the configuration, making dependency relationships invisible during code review.

**Hidden state**: Storing operational decisions or mutable configuration in code, making it impossible to reason about what a component does without executing it first.

**Inconsistent abstraction levels**: Mixing low-level resource configuration with high-level architectural decisions, or vice versa, making it unclear what layer of abstraction consumers are expected to work at.

## Example Use

A platform team designs infrastructure code that provisions a database cluster with automated backup, monitoring, and failover capability. The initial design exposes 47 input variables covering backup window, replica count, storage class, monitoring intervals, network interface details, and tag structures.

Evaluation reveals the design conflates several distinct responsibilities: cluster provisioning, backup policy, monitoring configuration, and network topology. These responsibilities have different change frequencies, different teams owning decisions, and different operational contexts in which they might be reused.

The thinking framework suggests decomposing into separate modules: one for cluster topology (encapsulating replication and failover logic), one for backup strategy (independent of cluster topology), one for monitoring integration (can apply to any stateful resource), and one for network configuration (can be shared across resource types).

With this separation, the cluster module exposes only: desired replica count, instance class, and storage quota. Backup configuration becomes an optional add-on module that consumers choose to apply. Monitoring defaults work for 90% of use cases with minimal parameterization. Network binding is explicit but separated, allowing network decisions to evolve independently.

Reassessment of the redesigned modules shows each focuses on a single decision domain, exposes only variables that represent genuine trade-offs, and can be composed in multiple valid configurations. A team managing backups can modify backup policy without touching cluster configuration. A team managing network can update network rules without disrupting database teams. Each module's responsibility is testable in isolation.
