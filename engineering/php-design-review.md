# Modern PHP Design Review

## Intent

Modern PHP 8.x provides expressive type-system features, first-class callable syntax, fibers, enums, intersection and union types, readonly properties, and modern object-oriented constructs that substantially raise the ceiling for code quality. This framework guides systematic evaluation of PHP codebases to distinguish designs that exploit contemporary language capabilities from those that carry forward legacy idioms or anti-patterns. The agent applies this skill when assessing whether PHP code achieves strong type safety, appropriate use of modern language constructs, clarity of domain modeling, and sustainable maintainability.

## Mental Model

Well-designed PHP 8.x code treats the **type system as executable documentation**. Types, enums, readonly properties, and intersection types express domain invariants that cannot be violated at runtime. Poor PHP design relies on loose typing, docblock conventions unverified by runtime or static analysis, mutable state without justification, and structural inheritance where composition or interfaces are more appropriate.

The underlying principle is that PHP's evolution from a loosely-typed scripting language to a statically-analyzable, expressive object-oriented language requires deliberate opt-in to modern idioms. Code that opts out—through mixed types, nullable everything, and unconstrained mutability—discards the safety guarantees the language now provides.

## Thinking Steps

1. **Assess type coverage**: Does every function signature, property declaration, and return type carry an explicit type? Are union types used to model genuine alternatives or as a shortcut to avoid clear domain modeling? Are intersection types used only where multiple behavioral contracts genuinely apply?

2. **Evaluate use of enums**: Where a finite set of values is logically present, are enums used rather than class constants, string literals, or integer codes? Are backed enums used where serialization is required? Are enum methods used to encapsulate enum-specific behavior?

3. **Examine readonly and immutability**: Are value objects and data transfer objects using readonly properties to enforce immutability? Is mutability present only where explicit state transitions are part of the domain model?

4. **Review object-oriented design**: Are classes single-responsibility? Are interfaces narrow and behavior-oriented? Is inheritance used only where substitutability (Liskov) is provably maintained, and composition or interfaces used otherwise?

5. **Evaluate first-class callable and closure patterns**: Are callables, closures, and first-class function syntax used to express transformation pipelines clearly, or are they obscuring intent through excessive indirection?

6. **Assess named arguments and constructor promotion**: Are named arguments used to clarify call sites where positional ambiguity exists? Is constructor promotion used consistently for simple value objects to reduce boilerplate without obscuring intent?

7. **Check error handling discipline**: Are exceptions typed to specific domain conditions rather than a monolithic exception hierarchy? Is error propagation consistent (exceptions vs. result types vs. nullable returns) across the codebase?

## Quality Bar

**Excellent design exhibits**:
- Strict types declared (`declare(strict_types=1)`) in every file
- Function and method signatures fully typed including return types, with `void` and `never` used appropriately
- Enums replacing finite-value constants throughout the domain model
- Readonly properties on value objects and data transfer objects, preventing accidental mutation
- Narrow, behavior-focused interfaces; no interfaces that exist only as type tags
- Single-responsibility classes with clear, stateable purposes
- Exception types that convey domain meaning; no bare `\Exception` or `\RuntimeException` for domain errors
- Static analysis (PHPStan level 8 or Psalm strict mode) passing without suppressions

**Poor design exhibits**:
- Missing type declarations or pervasive use of `mixed`, `array`, or unparameterized collections
- String or integer constants replacing enums for finite domain values
- Mutable public properties without justification
- Deep inheritance hierarchies where interface composition is more appropriate
- Catching `\Throwable` or `\Exception` broadly and swallowing or re-throwing without context
- Docblock types that contradict or substitute for declared types
- Functions exceeding a single, expressible responsibility

## Common Failure Modes

**Legacy idiom retention**: Using PHP 5-era patterns (array-based configuration, `isset` guards, string type checks with `is_array`) in codebases where PHP 8.5 features offer cleaner alternatives. This creates inconsistency and signals unfamiliarity with the current language version.

**Nullable overuse**: Declaring every parameter and property as nullable (`?Type`) rather than distinguishing between "this value is genuinely optional" and "this value should always be present but the developer was uncertain." Nullable everything degrades type safety to little better than untyped.

**Enum underuse**: Modeling finite domain sets as class constants, integer codes, or string literals when backed or pure enums would enforce exhaustiveness and provide methods. This loses both type safety and domain expressiveness.

**Inheritance over composition**: Building deep class hierarchies to share behavior rather than using traits, interfaces, or composition. Inheritance creates coupling across unrelated responsibilities and violates the substitutability assumption.

**Suppressed static analysis**: Using `@phpstan-ignore` or `@psalm-suppress` annotations without documented justification, hiding type errors that indicate unresolved design problems.

**Constructor overload**: Constructors that perform logic, make network calls, or apply conditional transformations rather than purely accepting and assigning values. This makes objects non-instantiable in isolation and testing impractical.

## Example Use

A web application processes customer orders through a service class. The initial implementation uses array parameters for order data, string constants for order status (`'pending'`, `'confirmed'`, `'shipped'`), nullable properties everywhere, and a single `OrderService` class managing creation, validation, persistence, and notification.

Evaluation reveals the design discards type safety through untyped arrays, loses domain expressiveness through string status codes, permits inconsistent state through nullable properties without domain rationale, and concentrates multiple responsibilities in one class.

The framework suggests: replacing array parameters with readonly data transfer objects bearing fully-typed properties; replacing string status constants with a backed enum carrying transition-validation methods; making properties readonly where order data is immutable after creation; and decomposing `OrderService` into focused services each expressible in one sentence.

Reassessment shows: the type system now enforces valid order structure at construction; invalid status transitions become type errors; and each service class has a single, testable responsibility. Static analysis at maximum strictness passes without suppressions. The design demonstrates PHP 8.5's type system functioning as executable domain documentation.
