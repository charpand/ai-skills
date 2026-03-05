# GitHub CI/CD Pipeline Review

## Intent

GitHub Actions workflows define automated pipelines that build, test, secure, and deploy software. Poorly designed workflows produce pipelines that are slow, brittle, difficult to maintain, or insecure—creating friction that erodes trust in automation and leads teams to bypass it. This framework guides systematic evaluation of GitHub Actions–based CI/CD configurations to distinguish pipelines that are fast, reliable, secure, and maintainable from those that are fragile, over-permissioned, undocumented, or functionally incomplete. The agent applies this skill when assessing whether a CI/CD pipeline achieves correctness of automation logic, least-privilege security, appropriate caching and parallelism, and complete documentation of pipeline behavior.

## Mental Model

Well-designed CI/CD pipelines treat **automation as a trust boundary**. The pipeline is the enforcer of quality and security gates; it runs in an environment with privileged access to production systems, secrets, and deployment targets. Every permission granted, every secret exposed, and every action invoked extends the pipeline's attack surface. Poor pipeline design accumulates permissions, secrets, and third-party actions without scrutiny, creating a privileged, automated path that bypasses the quality controls the pipeline ostensibly enforces.

The underlying principle is that a pipeline that can be bypassed is not a gate; it is a suggestion. Pipelines must be designed so that their quality gates are mandatory, their security posture is explicitly scoped, and their behavior is understandable to engineers who did not write them.

## Thinking Steps

1. **Assess trigger and scope design**: Are workflow triggers (`on:` keys) appropriately scoped? Are `push` triggers on protected branches? Are `pull_request` triggers restricted to the events they require (`opened`, `synchronize`, `reopened`) rather than all pull_request events? Are `workflow_dispatch` inputs validated?

2. **Evaluate permissions model**: Is `permissions: read-all` or a blanket grant replaced with the minimum permissions each job requires? Are `write` permissions present only for jobs that publish, deploy, or create? Is the `GITHUB_TOKEN` scope minimized at the workflow or job level?

3. **Review secret management**: Are secrets accessed only in the jobs that require them? Are secrets mapped into step environments explicitly rather than exposed globally? Are third-party actions pinned to commit SHAs rather than mutable tags to prevent secret exfiltration through tag mutation?

4. **Examine action pinning and supply chain security**: Are all third-party `uses:` references pinned to immutable commit SHAs? Are official GitHub actions (`actions/*`) pinned to major-version tags at minimum, SHA at best? Are the pinned actions from trusted publishers?

5. **Assess job structure and parallelism**: Are independent jobs running in parallel rather than sequentially? Are jobs logically separated so that a test failure does not prevent a security scan, and vice versa? Is the critical path through the pipeline identifiable and minimized?

6. **Review caching strategy**: Are dependency installations cached with appropriate cache keys that invalidate when lockfiles change? Are build artifacts cached between jobs rather than rebuilt unnecessarily? Are cache paths correct and complete?

7. **Evaluate documentation and maintainability**: Do workflows carry descriptive `name:` properties for workflows, jobs, and steps? Are non-obvious steps documented with inline comments? Is conditional logic (`if:` expressions) documented where the condition is not immediately obvious?

## Quality Bar

**Excellent design exhibits**:

- Permissions declared at the most granular level required; default permissions not relied upon
- All third-party actions pinned to commit SHAs with the action name in a comment for readability
- Secrets scoped to the job or step that requires them; not exported to the full environment
- Independent jobs running in parallel; `needs:` relationships expressing only genuine dependencies
- Dependency caches keyed to lockfiles; cache invalidation correct on dependency changes
- Descriptive names on all workflows, jobs, and non-trivial steps
- All push triggers to protected branches include required status checks
- Deployment jobs gated on passing test and security scan jobs

**Poor design exhibits**:

- Blanket `permissions: write-all` or default permissions without explicit declaration
- Third-party actions referenced by mutable version tags (`@v3`, `@main`) rather than commit SHAs
- Secrets injected into global job environment rather than only the steps that use them
- Sequential job chains where parallelism is possible without ordering dependency
- Missing or incorrect cache keys causing either stale caches or cache misses every run
- Workflows with no names or generic names that produce illegible job matrices in the Actions UI
- Deployment possible on failed test runs due to missing job dependency declarations

## Common Failure Modes

**Permission accumulation**: Granting broad permissions (`contents: write`, `packages: write`) at the workflow level and then limiting individual jobs, when the reverse is more secure. Permissions should default to the minimum at the workflow level and be elevated only where required.

**Mutable action references**: Pinning actions to version tags (`@v3`) rather than commit SHAs. Tags are mutable; a compromised or updated action package can change the behavior of a pinned tag, creating a supply chain injection point.

**Secret leakage via environment**: Exporting all secrets as global environment variables when only one step in one job requires each secret. Secrets in the global environment are accessible to all steps, including third-party actions run later in the job.

**Phantom parallelism**: Designing jobs as sequential when they are logically independent, causing pipelines to take three times longer than necessary because test, lint, and security jobs run in series rather than parallel.

**Cache key rigidity**: Using cache keys that never invalidate (e.g., based on OS only) or that always invalidate (based on the full dependency tree hash rather than the lockfile hash), producing either stale dependency caches or cache misses on every run.

**Undocumented conditionals**: Using complex `if:` expressions on steps without commenting what condition they evaluate and why, making it impossible for future maintainers to understand when a step runs and when it is skipped.

## Example Use

A web application pipeline runs a single job with all steps in sequence: install dependencies, lint, unit tests, integration tests, build, security scan, and deploy to production. The workflow declares `permissions: write-all`. Third-party actions are referenced by version tags. All repository secrets are injected into the global job environment. No caching is configured.

Evaluation reveals: deployment runs sequentially after a blocking security scan, meaning a slow scan delays every deployment; all permissions are granted regardless of step requirements; mutable action tags allow supply chain substitution; all secrets are exposed to all steps including third-party actions; no caching causes full dependency reinstallation on every run.

The framework suggests: splitting into parallel jobs (lint, test, security scan), with deploy gated on all three; reducing permissions to `contents: read` at workflow level with `deployments: write` only on the deploy job; pinning all action references to commit SHAs; scoping secrets to the deploy job only; adding a cache step keyed to the lockfile hash.

Reassessment shows: pipeline wall time reduced by parallelism; a supply chain compromise of a third-party action cannot gain deploy permissions; secrets are not available to lint or test jobs; cache reduces dependency installation time on repeated runs; the pipeline is now both faster and more secure than the original sequential design.
