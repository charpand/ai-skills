# Supply Chain Verification

## Intent

Supply chain attacks compromise software through dependencies, build tools, and CI/CD infrastructure rather than the application code itself. This framework guides systematic reasoning about dependency trust, artifact integrity, and pipeline execution authority to distinguish well-defended software supply chains from those with unverified or mutable dependency graphs. The agent applies this skill when evaluating whether a codebase, build pipeline, or CI/CD configuration adequately controls the provenance, integrity, and trust level of every external artifact it consumes.

## Mental Model

Well-designed supply chain security is governed by the principle of **trust by verification, not by reference**. Referencing a package by name and version is not the same as verifying it. Mutable references — version tags, floating version ranges, `latest`, branch names — allow the referenced artifact to change without the consuming codebase changing. Immutable references — cryptographic hashes, content-addressed digests, signed attestations — ensure that the artifact consumed today is the same one that was reviewed and approved.

The underlying model is that **every artifact boundary is an attack surface**. Each place where external code enters the build — package installations, action invocations, container image pulls, module downloads, system package installations in CI scripts — represents a point where a compromised or substituted artifact can execute with the privileges of the build environment. Supply chain security is a discipline of ensuring that at every such boundary the identity of the artifact is verified, its integrity is confirmed, and the decision to trust it is explicit, documented, and enforceable.

## Thinking Steps

1. **Enumerate artifact boundaries**: Identify every category of external artifact the codebase consumes: language package managers (npm/pnpm/yarn, pip/Poetry/uv, Maven/Gradle, NuGet, Go modules), container images, GitHub Actions `uses:` references, infrastructure module sources (Terraform/OpenTofu), and system package manager calls (apt, Homebrew) in CI scripts. Each category must be evaluated independently because the verification mechanisms differ.

2. **Assess reference mutability for GitHub Actions first**: Treat GitHub Actions `uses:` references as the highest-priority artifact boundary. A single workflow step running with `contents: write` or `secrets` access can exfiltrate credentials or modify repository contents. For every `uses:` entry, determine whether it is pinned to an immutable commit SHA (`owner/action@abc1234567890abcdef1234567890abcdef12345`) or to a mutable reference (`@v4`, `@main`, `@latest`). SHA pinning is a first-class requirement. Third-party actions — those not under `actions/*` or `github/*` — require explicit documented trust decisions; their publish history, ownership, and update patterns must be evaluated, not assumed trustworthy.

3. **Assess reference mutability for other artifact categories**: For each remaining artifact boundary, determine whether references are mutable or immutable. Version ranges (`^1.2.0`, `~> 2.0`, `>=1.0.0`) in manifest files are mutable; lockfile-pinned versions with integrity hashes are immutable. Container image tags are mutable; digest-pinned references (`image@sha256:abcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab`) are immutable. Terraform module version constraints such as `~> 1.0` permit minor upgrades without review; exact version pins or commit SHAs are immutable. Flag every mutable reference as a risk requiring remediation.

4. **Inspect lockfile and hash discipline**: For each package ecosystem present, verify that a lockfile is committed to version control and validated in CI. For npm: `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml` must be committed and CI must fail if the lockfile drifts from the manifest. For pip: `requirements.txt` with `--hash` flags or a `poetry.lock`. For Go: `go.sum` must be committed and `GONOSUMCHECK`/`GONOSUMDB` overrides must be absent or explicitly justified. For Maven/Gradle: dependency verification files or checksum validation configuration. For NuGet: lock files with package source mapping and preference for signed packages. An absent or unvalidated lockfile means the lockfile documents rather than enforces dependency integrity.

5. **Review audit tooling integration**: Determine whether automated vulnerability scanning runs on every pull request and every merge to the default branch. `npm audit`, `pip-audit`, `go mod verify`, Maven/Gradle dependency verification, and equivalent tooling must be present, configured to fail the build on findings above an agreed severity threshold, and not bypassed through `--ignore-scripts`, `--no-audit`, or always-pass exit code configurations. Audit tooling that does not gate merges provides a false sense of security.

6. **Examine container image trust**: Evaluate whether Docker/OCI images in CI, production pipelines, and Dockerfile `FROM` statements use digest pinning rather than tag references. Verify whether Cosign or equivalent signature verification is integrated into the pipeline for production images. Determine whether SBOM attestations are required or generated for base images. Tags are mutable even for versioned releases; only digest references guarantee byte-for-byte reproducibility.

7. **Assess provenance and SLSA posture**: Determine the SLSA level at which the software supply chain operates. SLSA 1 requires a scripted, documented build process. SLSA 2 requires version-controlled build definitions with provenance generated by the build platform. SLSA 3 requires provenance generated by a tamper-resistant, trusted build system with no persistent credentials. Identify which level is claimed or implied, and whether the pipeline configuration actually achieves that level. For npm packages, verify whether provenance attestations are published with releases.

8. **Evaluate SBOM generation**: Determine whether a Software Bill of Materials is generated as part of the release build. CycloneDX and SPDX are the primary standards; both are machine-readable and support downstream tooling. An absent SBOM prevents downstream consumers and security teams from reasoning about software composition without re-analyzing the artifact. An SBOM that is generated once and not updated on subsequent releases actively misrepresents software composition.

9. **Synthesize risk priority**: Not all artifact boundaries carry equal risk. A compromised GitHub Action with `contents: write` permissions represents a higher-severity risk than a compromised dev dependency that never executes in production. Prioritize findings by the privilege available to a compromised artifact and the blast radius of exploitation, not simply by the category of the finding.

## Quality Bar

**Excellent design exhibits**:

- All GitHub Actions `uses:` references pinned to full commit SHAs with the action name and version in an adjacent comment for readability (e.g., `uses: actions/checkout@abc1234567890abcdef1234567890abcdef12345 # actions/checkout@v4`)
- Lockfiles committed and validated in CI for every package ecosystem present; CI fails on lockfile drift
- Dependency audit tooling running on every pull request with findings above an agreed threshold blocking merges
- Container images referenced by digest in CI and production pipelines; tags preserved in comments only
- Cosign or equivalent signature verification integrated for production container images
- SBOM generated as part of every release build in CycloneDX or SPDX format
- Third-party GitHub Actions documented with explicit trust justification in workflow comments or a separate trust policy file
- `go.sum` committed and verified; `GONOSUMCHECK` and `GONOSUMDB` overrides absent or documented with scope-limited justification
- Terraform/OpenTofu modules pinned to exact versions or commit SHAs; sources from verified registries
- System package installations in CI scripts pinned to specific versions rather than floating to latest

**Poor design exhibits**:

- GitHub Actions referenced by mutable version tags (`@v4`, `@main`, `@latest`) or by unresolved branch names
- Missing lockfiles, lockfiles excluded from version control, or lockfiles committed but not validated in CI
- No dependency audit tooling in CI; vulnerability detection relies on ad-hoc manual review or external notifications
- Container images pulled by tag without digest pinning
- Third-party actions used without any documented trust decision or provenance evaluation
- `go.sum` absent, not committed, or bypassed through `GONOSUMCHECK` patterns added for transient convenience
- Infrastructure modules sourced from arbitrary git repositories without version or SHA pinning
- SBOM absent or generated once at initial release and never updated

## Common Failure Modes

**SHA pinning treated as optional for trusted publishers**: Teams pin their own actions to commit SHAs but leave first-party (`actions/checkout@v4`) and well-known third-party actions at version tags, reasoning that reputable publishers are trustworthy. Publisher reputation is not a substitute for immutability. Tags are mutable; a compromised tag update on a trusted action is indistinguishable from the original until the pipeline has already executed with the compromised code. All `uses:` references require SHA pinning regardless of publisher.

**Lockfile present but not enforced**: Committing a lockfile satisfies a policy requirement but provides no security if CI does not verify the lockfile matches the manifest and fail on drift. Developers installing packages with flags that bypass the lockfile, or modifying `package.json` without regenerating `package-lock.json`, introduce unverified dependencies silently. Enforcement requires an active CI check, not just file presence.

**Audit tooling without gate enforcement**: Running `npm audit` or `pip-audit` in CI but configuring the step to always succeed regardless of output — through `|| true`, suppressed exit codes, or blanket vulnerability suppression — produces audit output that is never acted on. Audit tooling that does not block merges on critical findings provides false assurance while the vulnerability remains unaddressed and in production.

**Container tag conflation with version immutability**: Using specific version tags such as `nginx:1.25.3` and treating them as immutable because they reference a specific release. Container registry tags can be overwritten by the image publisher at any time. Only digest references (`nginx@sha256:abcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab`) guarantee that the same image bytes are pulled on every build.

**GONOSUMDB scope expansion**: Adding broad wildcard patterns to `GONOSUMDB` or `GONOSUMCHECK` to resolve a transient sum database connectivity issue, and then leaving those patterns in place permanently. These overrides silently bypass Go's module checksum verification for every matching module indefinitely, removing the integrity guarantee Go's toolchain provides by default.

**Infrastructure module floating version constraints**: Using Terraform `~> 1.0` version constraints that permit minor version upgrades without code review, or sourcing modules from Git repositories with branch references rather than tagged releases or commit SHAs. Infrastructure module changes can introduce breaking configuration behavior or introduce compromised resources; they require the same immutability discipline as application dependencies.

**SBOM as a compliance artifact**: Generating an SBOM once to satisfy a compliance requirement and not regenerating it on subsequent releases. An SBOM that predates the current release misrepresents the software composition and provides incorrect data to downstream consumers and vulnerability scanners. SBOMs must be regenerated on every release build and associated with the specific artifact they describe.

## Example Use

A CI/CD pipeline for a web application contains three GitHub Actions workflows: build, security-scan, and deploy. The build workflow references `actions/checkout@v4`, `actions/setup-node@v4`, and a third-party code analysis action at `vendor/analysis-action@latest`. Docker images are pulled by tag. The project has `package.json` with `^` version ranges and a committed `package-lock.json`, but `npm audit` is not in the pipeline. The deploy workflow grants `contents: write` permissions to all jobs.

Evaluation begins by enumerating artifact boundaries: three action references, one npm dependency set, and one Docker image. The `@v4` and `@latest` references are mutable version tags. The `package-lock.json` is committed but not validated in CI. `npm audit` is absent. The Docker image uses a tag. The third-party action runs in a pipeline with `contents: write` access.

The framework identifies the third-party action at `@latest` as the highest-priority risk: it is maximally mutable, it runs with write permissions, and it lacks any documented trust decision. The `actions/checkout@v4` and `actions/setup-node@v4` references are lower severity but still require SHA pinning. The absent audit step leaves newly disclosed vulnerabilities in the npm dependency tree undetected.

Applying the framework produces a remediation set ordered by risk: pin all three action references to commit SHAs with version comments; document or replace the third-party action with a justified trust decision; restrict `contents: write` to only the specific deploy job that requires it; add `npm audit --audit-level=high` as a mandatory CI step; replace the Docker image tag with a digest reference; add a CI step validating the lockfile matches the manifest.

Reassessment after remediation shows that the pipeline no longer consumes any mutable artifact reference. A tag-mutation attack on any action would have no effect because all runs use pinned SHAs. Newly disclosed npm vulnerabilities would fail the build before merging. The Docker image is guaranteed to be the reviewed version on every run. The third-party action operates with only the permissions it requires rather than repository-wide write access. The supply chain posture has moved from implicitly trusting all external references to verifying each one.
