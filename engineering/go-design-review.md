# Go Design Review

## Intent

Go codebases in systems programming, CLI tools, and performance-critical applications benefit from design patterns that leverage Go's simplicity while avoiding its characteristic pitfalls. This framework guides evaluation of Go package structure, API design, error handling, and concurrency patterns to distinguish idiomatic, maintainable designs from those that underutilize Go's strengths or inadvertently introduce race conditions, hidden dependencies, and inflexible abstractions. The agent applies this skill when assessing whether a codebase makes strategic use of interfaces, respects Go's philosophy of explicit over implicit, handles errors with context propagation, and designs APIs that compose cleanly.

## Mental Model

Well-designed Go code follows the principle of **simplicity with explicitness**. Go's design philosophy prioritizes readable, maintainable code that handles errors directly rather than through exception mechanisms. Idiomatic Go embraces composition over inheritance, uses interfaces only when they define behavior contracts (not as a form of abstraction), and makes dependencies explicit rather than implicit.

The underlying principle is that code clarity should not require execution to understand—readers should be able to trace logic and dependencies by reading the code itself. When packages hide dependencies, over-abstract with unnecessary interfaces, defer error handling, or create subtle goroutine safety issues, the resulting system becomes difficult to understand, modify, or debug.

## Thinking Steps

1. **Examine package structure**: Does each package have a single, clear responsibility? Are public vs. private APIs well-delineated? Do packages avoid circular dependencies and expose only the types and functions consumers genuinely need?

2. **Evaluate interface design**: Are interfaces defined by consumers of the behavior (not providers)? Are interfaces narrow, representing a single behavioral contract? Or are they broad, leaky abstractions that expose implementation details?

3. **Trace dependency graph**: Can the agent identify what each package depends on? Are dependencies explicit (imported and used directly) or implicit (discovered through reflection, environment variables, global state, or side effects)? Do dependencies form clean layers?

4. **Assess error handling**: Does the code propagate context through errors (wrapping with additional information)? Are sentinel errors and custom error types used appropriately? Or are errors ignored, swallowed, or returned without context?

5. **Review concurrency patterns**: If goroutines are used, are communication patterns explicit (channels) or risky (shared memory)? Are race conditions possible due to unsynchronized access to mutable state? Does the code use goroutines where simpler patterns would suffice?

6. **Evaluate standard library usage**: Does the code leverage Go's batteries-included standard library, or does it reimplement functionality that already exists? Are standard library patterns (io.Reader/Writer, context, sync primitives) used idiomatically?

7. **Examine testing discipline**: Are tests table-driven, allowing easy addition of cases? Do sub-tests enable clear failure messages? Is benchmarking used for performance-critical paths? Or is testing surface-level with poor coverage of edge cases?

8. **Check resource management**: Are file handles, network connections, and other resources properly closed with defer? Is cleanup guaranteed even when errors occur? Are goroutines cleaned up to prevent leaks?

## Quality Bar

**Excellent design exhibits**:
- Packages with clear, single responsibilities; public APIs express only consumer concerns
- Interfaces defined by behavior consumers, not providers; interfaces are narrow (1-3 methods)
- Explicit dependencies: imports and uses are visible; no global state, reflection hacks, or runtime discovery
- Error handling with context: errors are wrapped with `fmt.Errorf` or custom error types; call chains can be traced
- Concurrency patterns are explicit and safe: channels or synchronization primitives are used for shared state; no data races
- Standard library patterns used idiomatically: io.Reader, context.Context, defer for cleanup
- Comprehensive testing: table-driven tests cover happy paths and edge cases; benchmarks validate performance assumptions
- Resource cleanup is guaranteed: defer statements ensure cleanup even on panic or error

**Poor design exhibits**:
- Packages with unclear responsibility; consumers must understand internal implementation to use the package
- Broad interfaces (5+ methods); interfaces designed by providers not consumers; interfaces that leak implementation
- Implicit dependencies: global state, reflection-based initialization, environment variable discovery, or side effects hidden in imports
- Errors ignored with blank imports; error context lost; log.Fatal or panic used instead of returning errors
- Goroutines spawned without explicit communication or synchronization; potential for data races
- Reimplementation of standard library functionality; non-idiomatic patterns (manual string parsing instead of regexp, custom error types when fmt.Errorf suffices)
- Sparse or superficial tests; no benchmarks; test helpers that obscure failure points
- Resource leaks: unclosed files or connections; goroutines spawned without cancellation

## Common Failure Modes

**Overly broad interfaces**: Defining interfaces with many methods (e.g., interfaces that mirror concrete type APIs) limits composability and forces implementations to provide unrelated functionality. Idiomatic Go uses narrow interfaces (often 1-3 methods) that describe a specific behavior contract.

**Implicit interface satisfaction**: Designers assume a type implements an interface but never actually use it in that context, creating hidden contracts that break when the type changes. Explicit type assertions in tests catch this early.

**Global state and singletons**: Using package-level variables for configuration or runtime state makes testing difficult and creates hidden dependencies between tests and between packages. Idiomatic Go passes dependencies explicitly.

**Premature abstraction with interfaces**: Creating interfaces "just in case" someone might need a mock or alternative implementation, before the need is proven. This adds ceremony without benefit and complicates the code.

**Error handling deferrals**: Returning errors without wrapping or context, forcing callers to guess what went wrong. Using log.Fatal, panic, or os.Exit instead of returning errors.

**Unbounded goroutine spawning**: Launching goroutines without a cancellation mechanism, cleanup guarantee, or bounded concurrency, risking resource exhaustion or goroutine leaks.

**Reflection for initialization**: Using reflection tags or build-time code generation for dependency injection when explicit initialization would be clearer. This moves complexity from readers to runtime.

**Inconsistent error types**: Mixing custom error types, error wrapping, error checking strategies, and error logging patterns across a codebase, making it hard to predict error handling behavior.

## Example Use

A team designs a data pipeline package that reads configuration from files, transforms data using pluggable filters, and writes results to various outputs. The initial design defines a broad Filter interface with 12 methods covering validation, transformation, logging, metrics, and resource cleanup. Configuration initialization uses reflection over struct tags. The main pipeline function accepts a variadic list of filters but runs them sequentially in a single goroutine despite accepting channels as output.

Evaluation reveals several issues: the Filter interface couples many concerns and forces every implementation to handle unrelated responsibilities. Reflection-based configuration hides how filters are initialized. The pipeline doesn't leverage concurrency even when output destinations could handle parallel writes.

The thinking framework suggests redesigning with focused interfaces: a Transform interface with a single method (Transform(input []byte) ([]byte, error)), a Validator interface with a single method (Validate(input []byte) error), and a separate Sink interface for outputs. Configuration should be explicit function calls or struct initialization, not reflection. The pipeline should accept a context.Context for cancellation and spawn goroutines per output sink to write concurrently.

Reassessment shows that interfaces are now narrow and composable. Adding a new filter type is straightforward—implement one interface. Configuration is explicit and testable. Concurrency is safe because each goroutine owns its output sink. Tests are cleaner because they inject mock implementations of specific, focused interfaces. Error propagation now includes context at each layer. Benchmarks show the concurrent pipeline outperforms the sequential version on I/O-bound workloads.
