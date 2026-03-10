---
name: html5-accessibility-review
description: HTML5 semantic elements and ARIA specifications exist to communicate document structure, content relationships, and interactive behavior to assistive technologies and automated tools.
license: CC-BY-4.0
compatibility: claude-dev,opencode
metadata:
  version: "1.0"
  category: "engineering"
---

# HTML5 Accessibility and Semantics Review

## Intent

HTML5 semantic elements and ARIA specifications exist to communicate document structure, content relationships, and interactive behavior to assistive technologies and automated tools. Markup that achieves visual appearance without semantic correctness is invisible to screen readers, fails automated accessibility audits, and excludes users who rely on assistive technology. This framework guides systematic evaluation of HTML5 documents to distinguish markup that correctly expresses document structure and interaction semantics from markup that is visually sufficient but structurally empty. The agent applies this skill when assessing whether HTML achieves semantic correctness, WCAG 2.1 AA compliance, keyboard operability, and inclusive design that does not depend on sensory modality.

## Mental Model

Well-designed HTML treats the **document as a structured communication**, not a visual canvas. Every element chosen conveys meaning about the content it contains: its role in the page structure, its relationship to surrounding content, and its expected interaction behavior. Poor HTML design treats elements as styling primitives, choosing `<div>` and `<span>` for everything and recreating semantic meaning visually while leaving the accessible representation empty or misleading.

The underlying principle is that HTML semantics are the contract between a document and the tools—browsers, screen readers, search engines, automated tests—that process it. When that contract is fulfilled through correct element choice and ARIA use, assistive technologies operate correctly without customization. When it is violated, accessibility must be retrofitted through complex ARIA that duplicates what native semantics provide at no cost.

## Thinking Steps

1. **Assess landmark structure**: Does the document contain appropriate landmark elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) that divide the page into navigable regions? Is there exactly one `<main>` element? Are landmark labels provided via `aria-label` or `aria-labelledby` where multiple instances of the same landmark type appear?

2. **Evaluate heading hierarchy**: Is there a single `<h1>` that expresses the primary document topic? Does the heading hierarchy descend logically without skipping levels? Do headings convey document structure, not visual styling?

3. **Review interactive element choices**: Are interactive elements implemented using native HTML controls (`<button>`, `<a>`, `<input>`, `<select>`) rather than non-interactive elements made interactive via JavaScript and ARIA? Where custom interactive patterns are required, are ARIA roles, states, and properties complete and correct?

4. **Examine image and media alternatives**: Do all meaningful images carry descriptive `alt` text that conveys the same information as the image? Are decorative images marked with `alt=""` to suppress announcement? Do complex images (charts, diagrams) have extended descriptions? Do videos carry captions and audio descriptions?

5. **Assess form accessibility**: Is every form input associated with a visible `<label>` via `for`/`id` pairing or `aria-labelledby`? Are error messages programmatically associated with their inputs via `aria-describedby`? Are required fields indicated both visually and programmatically (`required`, `aria-required`)?

6. **Evaluate color and contrast independence**: Does all meaningful information conveyed through color have a non-color alternative? Do text elements meet WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text)? Do interactive focus indicators meet contrast requirements?

7. **Review focus management**: Is focus order logical and consistent with the visual reading order? Are focus styles visible with sufficient contrast? Does keyboard navigation reach all interactive elements? Are focus traps applied appropriately in modal dialogs and released correctly?

## Quality Bar

**Excellent design exhibits**:

- Complete landmark structure enabling screen reader navigation without reading every element
- Logical heading hierarchy reflecting document structure, not visual design preferences
- Native HTML semantics for all standard interactive patterns; ARIA used only to supplement, never to replace available native semantics
- All images carrying accurate alternative text; decorative images suppressed
- All form inputs visibly labeled with programmatic association; errors associated with their inputs
- WCAG 2.1 AA contrast ratios met for all text and meaningful UI elements
- All interactive functionality operable by keyboard; focus indicators visible and sufficiently contrasted
- No information conveyed by color alone

**Poor design exhibits**:

- `<div>` and `<span>` used as buttons, navigation items, or headings without native element or complete ARIA substitution
- Missing or incorrect `alt` text; images with `alt` text that describes appearance rather than meaning
- Form inputs without labels, or labels associated only visually without programmatic connection
- Heading levels chosen for font size rather than document structure
- Interactive elements unreachable by keyboard or lacking visible focus indicators
- Color as the sole distinguishing feature of states, categories, or error conditions
- ARIA roles applied without the required accompanying states and properties

## Common Failure Modes

**Semantic demotion**: Using a visually-styled `<div>` where a `<button>`, `<nav>`, or `<article>` would express the correct semantics natively. This forces ARIA retrofitting that is more complex than native element use and is more prone to incomplete implementation.

**Alt text as caption**: Writing `alt` text that describes what an image looks like ("Photo of a person sitting at a desk") rather than what information it conveys ("Software engineer reviewing code on a laptop"). Alt text serves users who cannot see the image; it should convey meaning, not appearance.

**Placeholder as label**: Using `placeholder` attributes as the only visible label for form inputs. Placeholders disappear on input, fail to display when the field has content, and are not reliably announced by assistive technologies as field labels.

**ARIA overuse**: Applying ARIA roles, states, and properties to recreate semantics already provided by native HTML elements. This adds maintenance burden, increases the risk of inconsistency between ARIA declaration and actual behavior, and is an indicator that a native element should be used instead.

**Color-only communication**: Conveying error states, category membership, required fields, or status through color without a textual, iconic, or positional alternative. Users with color blindness, monochrome displays, or high-contrast modes lose this information entirely.

**Skipped heading levels**: Jumping from `<h2>` to `<h4>` because the `<h4>` matches a desired font size, breaking the navigable document outline that screen reader users rely on to understand document structure and skip sections.

## Example Use

A product listing page displays items in a grid. Each item shows a product image, name, price, and an "Add to Cart" button implemented as `<div class="btn" onclick="addToCart()">`. Status messages appear in red text. Filter controls use `<div>` elements with click handlers. Images carry `alt` text reading "product image."

Evaluation reveals: interactive elements are non-native, requiring complete ARIA reconstruction; images describe their existence rather than their content; status information relies solely on color; filter controls lack keyboard access.

The framework suggests: replacing `<div class="btn">` with `<button>`; replacing `<div>` filter controls with `<fieldset>` and `<input type="checkbox">` elements; rewriting `alt` text to convey product identity; adding a text indicator alongside color for status messages; validating contrast ratios for all text.

Reassessment shows: screen reader users can navigate to buttons directly by element type; filter controls are operable by keyboard; image alternatives convey product information; status messages are perceivable without color vision. The document fulfills its semantic contract with assistive technology users.
