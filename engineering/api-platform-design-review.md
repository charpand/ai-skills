# API Platform Design Review

## Intent

API Platform combines Symfony with schema-driven resource definition, automatic CRUD generation, JSON-LD/Hydra/OpenAPI documentation, and a powerful operation and state provider system. This expressiveness allows rapid API construction, but also enables designs that conflate persistence entities with API resources, expose internal data structures through public contracts, and rely on magic behavior that obscures how an endpoint actually functions. This framework guides systematic evaluation of API Platform–based APIs to distinguish designs that use the framework's resource model correctly from those that produce APIs that are fragile, over-exposed, or tightly coupled to their persistence layer. The agent applies this skill when assessing whether an API Platform application achieves clean resource modeling, appropriate operation design, stable contracts, and security correctness.

## Mental Model

Well-designed API Platform applications treat **API resources as intentional contracts, not persistence projections**. A resource is a stable, versioned, consumer-facing data model that expresses what clients need, not what the database stores. Poor API Platform design uses Doctrine entities directly as API resources, exposing persistence details, internal relationships, and implementation fields through the public API contract, creating coupling between database schema evolution and API contract stability.

The underlying principle is that API Platform's resource model, state providers, and state processors exist to interpose a deliberate design layer between persistence and the API surface. Bypassing this layer by annotating Doctrine entities directly produces an API that changes whenever the database schema changes—precisely the coupling that versioned APIs exist to prevent.

## Thinking Steps

1. **Assess resource vs. entity separation**: Are API resources defined as dedicated classes separate from Doctrine entities? Does each resource class represent a stable, consumer-meaningful view of domain data? Are internal entity relationships exposed only where consumers genuinely require them?

2. **Evaluate operation design**: Are the operations defined on each resource limited to those the API should support? Are custom operations using the operation DSL rather than bypassing API Platform with traditional controllers? Does each operation have an explicit security expression?

3. **Review state providers and processors**: Are state providers responsible for mapping from persistence to resource representation? Are state processors responsible for applying incoming resource data to domain logic? Is persistence logic absent from resource classes?

4. **Examine serialization groups**: Are serialization groups defined to control exactly which fields are exposed per operation? Are write-only fields (passwords, tokens) separated from read-only fields? Are computed or sensitive fields excluded by default rather than included and hidden per caller?

5. **Assess validation placement**: Are API Platform validation constraints applied to resource classes, not entities? Do constraints reflect API-level invariants (format, presence, range) while domain invariants are enforced in domain services?

6. **Review security model**: Is every operation protected by an explicit `security` or `securityPostDenormalize` expression? Are resource-level defaults set, with operation-level overrides only where differentiation is needed? Are object-level security checks using Voters rather than inline expressions?

7. **Evaluate documentation and schema quality**: Are all resources, operations, and properties documented with meaningful descriptions? Are response and error schemas documented? Is the generated OpenAPI specification sufficient for client developers to implement integrations without inspecting source code?

## Quality Bar

**Excellent design exhibits**:
- Dedicated resource classes separate from Doctrine entities; entities never annotated as API resources directly
- Each resource class representing a stable, versioned contract independent of persistence structure
- Serialization groups controlling field exposure per operation; no default full-entity exposure
- Every operation carrying an explicit security expression; no operations without authorization
- State providers and processors separating the mapping concern from the domain concern
- Validation on resource classes; domain invariants in domain services
- Complete OpenAPI documentation: resource descriptions, property descriptions, error responses

**Poor design exhibits**:
- Doctrine entities annotated as API Platform resources, exposing persistence schema through the API
- Operations without security expressions, defaulting to public access
- No serialization groups, exposing all entity properties to all callers
- Persistence logic in state processors that should be in domain services
- Validation constraints on entities rather than on resources, mixing persistence and API contracts
- Custom controllers used to bypass API Platform's operation system
- Undocumented properties and operations in the generated specification

## Common Failure Modes

**Entity-as-resource**: Annotating Doctrine entities directly as API resources for development speed. This produces an API contract that is structurally identical to the database schema, coupling API consumers to persistence decisions and making schema evolution a breaking change event.

**Security omission**: Relying on application-level authentication (firewall) as the only authorization layer, without operation-level security expressions. Authentication confirms identity; authorization confirms permission to act. Both layers are required.

**Serialization group neglect**: Omitting serialization groups and relying on default full-entity serialization. This exposes internal fields, creates circular reference risks with entity relationships, and leaks data that consumers do not need and should not receive.

**Processor as service**: Placing business logic directly in state processors rather than delegating to domain services. This makes processors non-reusable, untestable in isolation, and structurally similar to fat controllers—moving the coupling into a different class without removing it.

**Undocumented contracts**: Generating an OpenAPI specification with empty descriptions, unnamed response codes, and undocumented properties. The specification is a contract artifact; leaving it undocumented delegates the discovery burden to client developers and creates integration friction.

**Operation proliferation**: Adding custom operations for every minor variation rather than designing resource representations that serve multiple use cases through state and filtering. Excessive operations fragment the API surface and increase maintenance surface area.

## Example Use

An API exposes a `User` resource by annotating the Doctrine `User` entity directly. The entity includes `passwordHash`, `lastLoginAt`, `internalAccountId`, and a bidirectional relationship to `Order` entities. All fields are serialized by default. The single `GET /users/{id}` operation has no security expression.

Evaluation reveals: the persistence schema is the API contract; sensitive fields are publicly accessible; the operation is unsecured; the entity relationship creates a circular reference risk.

The framework suggests: creating a dedicated `UserResource` class with only consumer-relevant fields (`id`, `email`, `displayName`, `createdAt`); applying serialization groups to control read vs. write operations; adding `security: "is_granted('VIEW', object)"` with a corresponding Voter; creating a state provider that maps `User` entity to `UserResource`.

Reassessment shows: database schema changes do not affect the API contract; sensitive fields are not exposed; every operation carries explicit authorization; the state provider owns the mapping concern independently from the domain entity. The API resource represents a stable, intentional contract.
