---
name: twig-template-review
description: Twig templates occupy the boundary between application logic and rendered output.
license: CC-BY-4.0
compatibility: claude-dev,opencode
metadata:
  version: "1.0"
  category: "engineering"
---

# Twig Template Review

## Intent

Twig templates occupy the boundary between application logic and rendered output. Poor template design blurs this boundary, embedding business logic in views, duplicating structural markup, and producing output that is inaccessible, fragile, or difficult to maintain. This framework guides systematic evaluation of Twig templates to distinguish designs that maintain clean separation between logic and presentation from those that treat templates as a secondary concern. The agent applies this skill when assessing whether Twig templates are composable, logic-free, accessible by construction, and maintainable as the underlying data model evolves.

## Mental Model

Well-designed Twig templates treat **presentation as a pure function of prepared data**. The template receives data that is already shaped for display and renders it; it does not transform, filter, or compute. Poor template design introduces the view layer as a second application layer where filtering, conditional business logic, and data assembly occur—creating a hidden layer of untestable, undocumented behavior.

The underlying principle is that Twig's inheritance, block, macro, and include mechanisms exist to eliminate structural repetition while keeping logic in controllers or view models. When templates grow to perform domain logic, they duplicate effort already done or should be done elsewhere, and they create coupling between the rendering layer and business rules that should evolve independently.

## Thinking Steps

1. **Identify logic in templates**: Does the template perform filtering, sorting, or transformation of data rather than purely displaying it? Are conditional branches based on domain rules (not presentation conditions) present in the template?

2. **Examine inheritance and block structure**: Is template inheritance used to establish a single, canonical page structure? Are block names semantically meaningful and consistently used? Are blocks sized appropriately—neither too coarse (forcing fork of an entire layout) nor too granular (producing excessive indirection)?

3. **Evaluate macro and include usage**: Are macros used for reusable, parameterized markup fragments? Do macros receive only the data they need, without passing the entire context? Are includes used for structural composition and macros for component reuse?

4. **Review variable usage and escaping**: Are all user-sourced variables escaped by default? Are `raw` or `|e` overrides present only with explicit documented justification? Are variable names descriptive of what they contain rather than their origin?

5. **Assess loops and conditionals**: Are loop bodies simple, delegating complex output decisions to macro calls rather than inline conditional logic? Are empty-state conditions (`{% else %}` in `{% for %}`) handled?

6. **Check for translation and internationalization readiness**: Are all user-visible strings wrapped in `{% trans %}` or `{{ 'key'|trans }}`? Are dynamic values interpolated through translation placeholders rather than concatenation?

7. **Evaluate output completeness and fallback**: Are all variables that may be absent handled with `|default` or explicit null checks? Does the template produce valid, complete markup in all data-present and data-absent states?

## Quality Bar

**Excellent design exhibits**:

- Templates that contain no domain logic; all filtering, computation, and transformation performed before template rendering
- A clear, shallow inheritance hierarchy with a canonical base layout and well-named blocks
- Macros that accept only the data they render, with explicit parameter lists
- Consistent auto-escaping with `raw` overrides documented and rare
- Translation wrappers on every user-visible string; no hardcoded natural-language strings
- Loop `{% else %}` handling present wherever empty collections are possible
- Variable names that describe presented content, not technical origin
- No inline styles or behavior-altering attributes mixed into structural templates

**Poor design exhibits**:

- Domain conditions (user role checks, business rule tests) evaluated inside templates
- Structural duplication across templates that should be composed via inheritance or macros
- Raw output of unescaped user data without explicit documented justification
- Hardcoded natural-language strings not covered by translation
- Template variables assumed present without fallback, causing rendering failures on missing data
- Macros that accept the entire template context object rather than specific values
- Logic embedded in template filters that implements business rules

## Common Failure Modes

**Logic migration**: Moving filtering, sorting, or business rule evaluation into templates because it is convenient rather than placing it in the controller or a dedicated presenter/view model. This creates untestable, invisible business logic in the rendering layer.

**Inheritance over-depth**: Building template inheritance chains four or five levels deep, making it unclear which block overrides which and requiring navigation through multiple files to understand a single rendered output. Shallow inheritance with clear block semantics is preferable.

**Context object passing**: Passing the entire application context, entity, or data bag to macros rather than extracting the values the macro needs. This creates hidden coupling between macros and data structures, making macros non-reusable.

**Translation neglect**: Leaving natural-language strings untranslated because the application is currently single-language. This technical debt makes future internationalization a global search-and-replace rather than a configuration decision.

**Assumed data completeness**: Writing templates that assume all variables are always populated, producing broken output when optional data is absent. Templates should degrade gracefully.

**Security bypass via raw**: Using the `|raw` filter to solve a rendering problem without investigating why escaping is breaking output. In most cases, escaping breaks output because data was pre-escaped upstream—fixing that is correct; bypassing escaping is not.

## Example Use

A content management system renders article pages using a Twig template. The initial template contains conditional branches that check the author's subscription tier to determine which content sections render, applies `|lower` and string-slicing operations to format byline data, and hardcodes the label "Published by" in English.

Evaluation reveals domain logic (subscription tier) residing in the view, data transformation (formatting) occurring at render time rather than in a presenter, and an untranslated hardcoded string preventing internationalization.

The framework suggests: moving subscription-tier conditional logic to the controller, which passes a prepared `show_premium_content` boolean; extracting byline formatting to a dedicated presenter class that prepares a `formatted_byline` string; and replacing the hardcoded label with a `{% trans %}` wrapper.

Reassessment shows: the template now contains no domain logic, renders purely from prepared data, handles the empty-author case via `|default`, and all visible strings are translation-ready. A new subscription tier requires no template change. The template fulfills its role as a pure presentation layer.
