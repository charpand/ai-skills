# Symfony Application Design Review

## Intent

Symfony's component architecture, dependency injection container, event system, and convention-driven structure provide a framework for building maintainable, testable PHP applications. However, conventions can be applied superficially, producing applications that are structurally compliant but logically coupled, difficult to test, and fragile under change. This framework guides systematic evaluation of Symfony application design to distinguish architectures that use the framework's capabilities correctly from those that fight the framework, bypass its contracts, or conflate infrastructure concerns with domain logic. The agent applies this skill when assessing whether a Symfony application achieves clean layering, correct use of the service container, appropriate command/query separation, and testability at each layer.

## Mental Model

Well-designed Symfony applications treat the **framework as infrastructure, not identity**. The domain model, business rules, and application logic are independent of Symfony; the framework provides routing, serialization, dependency injection, and event dispatch as services to that logic. Poor design treats Symfony classes as the application, embedding business decisions in controllers, coupling domain objects to framework contracts, and using the service container as a global state repository.

The underlying principle is that Symfony's dependency injection container exists to wire objects together, not to be accessed at runtime. An application that calls `$this->container->get(...)` at runtime has replaced explicit, verifiable dependency declarations with implicit, invisible runtime coupling.

## Thinking Steps

1. **Assess controller design**: Do controllers contain only orchestration logic—receiving input, invoking application services, and returning responses? Is domain logic absent from controllers? Are controllers thin, with each action expressible as "receive, validate, delegate, respond"?

2. **Examine service and dependency injection design**: Are services declared with constructor injection rather than property or setter injection (except where Symfony's component contracts require otherwise)? Is the container accessed at runtime via `$this->container->get()` anywhere outside framework bootstrap code? Are services appropriately scoped (request-scoped where needed, shared otherwise)?

3. **Review event and message bus usage**: Are Symfony Messenger messages used to decouple asynchronous operations from synchronous request handling? Are events dispatched for cross-cutting notifications rather than used as a control flow mechanism for sequential operations? Are event handlers free of domain logic that belongs in services?

4. **Evaluate form and validation design**: Are Symfony Forms used for input binding and validation at the HTTP layer, with domain validation in domain objects? Are constraints applied at the appropriate layer—format constraints in forms, invariant constraints in domain objects? Is form processing logic absent from domain entities?

5. **Assess repository and persistence design**: Do repositories expose only domain-meaningful query methods and avoid leaking query-builder or ORM details to callers? Are entities pure domain objects, free of persistence logic and framework annotations that affect behavior? Is the persistence boundary clear?

6. **Review security and authorization**: Is authorization logic expressed through Symfony's Voter system or security expressions rather than embedded in controllers or services as ad-hoc checks? Is the security layer orthogonal to the application logic it protects?

7. **Examine configuration and parameter management**: Are environment-specific values injected via parameters rather than read from environment variables at runtime? Are services configurable through the service container without code changes?

## Quality Bar

**Excellent design exhibits**:
- Controllers limited to input handling, service delegation, and response construction; no business logic
- Constructor injection throughout; service container not accessed at runtime
- Domain objects free of Symfony-specific annotations, interfaces, or base class inheritance
- Messenger used for async decoupling; events used for notifications, not sequential control flow
- Repositories that expose named, domain-meaningful methods; no `findBy(['status' => 'active'])` scattered at call sites
- Voters encapsulating all authorization logic; no inline `if (!$this->isGranted(...))` throughout service layers
- Tests for each layer in isolation: unit tests for domain, integration tests for services, functional tests for controllers

**Poor design exhibits**:
- Business logic in controllers, form types, or event listeners
- Service locator pattern (`$container->get(...)`) used at runtime outside bootstrap code
- Domain entities implementing Symfony interfaces (serializable, aware) or extending Symfony base classes
- Direct ORM queries at call sites rather than through named repository methods
- Authorization checks scattered through service classes rather than centralized in Voters
- Configuration values read directly from `$_ENV` or `getenv()` at runtime
- Missing or absent test coverage for individual layers

## Common Failure Modes

**Fat controller**: Placing business logic, query construction, or presentation formatting in controller actions because it is the nearest execution point. Controllers should be coordinators, not executors of business logic.

**Service locator anti-pattern**: Using the service container as a runtime registry to avoid declaring dependencies explicitly. This hides dependencies, prevents static analysis from resolving them, and couples code to the container.

**Framework entity coupling**: Implementing Symfony interfaces on domain entities (`UserInterface`, `EquatableInterface`) in ways that embed infrastructure behavior in domain objects. Domain objects should not know about the framework that persists or serializes them.

**Event-driven sequential coupling**: Using the event system to implement sequential processing steps, where each listener depends on the previous one having run. Events are for decoupled notification; sequential operations should be explicit service calls.

**Repository leakage**: Returning QueryBuilder instances or exposing ORM query methods from repositories, coupling callers to persistence technology and preventing data source substitution.

**Anemic domain model**: Domain entities that contain only getters and setters with no behavior, placing all domain logic in services. This inverts the domain model's responsibility and produces logic that is difficult to locate and reason about.

## Example Use

An e-commerce application processes orders through a Symfony controller action that performs stock validation, applies discount rules, persists the order, sends a confirmation email, and updates an analytics record—all within the action method. The order entity implements `Symfony\Component\Security\Core\User\UserInterface` for convenience.

Evaluation reveals: the controller has become an application orchestrator embedding business logic; the entity implements a Symfony interface it has no domain reason to implement; the email and analytics operations are synchronously blocking without decoupling rationale.

The framework suggests: extracting the stock validation and discount application into a domain service with explicit inputs and a typed result; moving the controller to delegating to an `OrderApplicationService`; replacing synchronous email and analytics calls with Messenger messages dispatched after successful order persistence; removing the unrelated interface from the entity.

Reassessment shows: the controller action is expressible in one sentence ("receive validated input, delegate to application service, return response"); domain logic is testable without the HTTP layer; email and analytics are decoupled from the request cycle; the entity expresses only domain behavior. The application uses Symfony as infrastructure rather than as the application itself.
