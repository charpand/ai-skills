# CSS Design Review with Contrast Validation

## Intent

CSS governs not only the visual appearance of interfaces but also the accessibility of those interfaces to users with low vision, color blindness, or conditions requiring high contrast. CSS that achieves a desired aesthetic without meeting contrast and focus visibility requirements excludes users who depend on adequate contrast to read, interact, and navigate. This framework guides systematic evaluation of CSS to distinguish design systems that produce accessible, maintainable stylesheets from those that achieve visual goals while creating exclusion or introducing structural fragility. The agent applies this skill when assessing whether CSS meets WCAG 2.1 contrast standards, maintains logical cascade and specificity discipline, and produces an interface that functions across visual contexts without degradation.

## Mental Model

Well-designed CSS treats the **stylesheet as a contract with the visual perception of all users, not a subset**. Color, contrast, spacing, and typography decisions are made with the full range of visual abilities in mind: low vision, color vision deficiency, high-contrast mode, and scaled text. Poor CSS optimizes for a single, assumed visual context—typically a designer's calibrated display—producing an experience that degrades for a significant portion of users without the designer being aware.

The underlying principle is that contrast and visual clarity are not cosmetic concerns; they are functional requirements for usability. An interface that cannot be read or operated by a user with low vision has failed its basic communication function, regardless of its aesthetic quality.

## Thinking Steps

1. **Calculate text contrast ratios**: For all text elements, calculate the contrast ratio between text color and background color. Does normal text (below 18pt / 14pt bold) achieve 4.5:1? Does large text meet 3:1? Are these ratios maintained across all states (hover, focus, visited, disabled)?

2. **Assess non-text contrast**: Do interactive UI components (buttons, input borders, checkboxes, focus indicators) meet 3:1 contrast against adjacent colors? Do meaningful graphical elements meet 3:1? Are focus indicators clearly distinguishable from the unfocused state?

3. **Evaluate color-independence of information**: Is every instance of color used to convey meaning (error states, success indicators, required fields, active navigation) accompanied by a non-color indicator (text label, icon, pattern, border, position)?

4. **Review cascade and specificity design**: Are specificity levels appropriate and consistent? Are ID selectors avoided in stylesheets that intend reusability? Are `!important` declarations absent except in documented overrides for utility classes? Is the cascade used intentionally rather than overcome?

5. **Examine custom property (variable) usage**: Are design tokens expressed as CSS custom properties? Is the token vocabulary semantically named (e.g., `--color-text-primary`) rather than value-named (e.g., `--blue-500`) so tokens can be changed without hunting for usage sites?

6. **Assess responsive behavior and text scaling**: Does the layout remain usable when text is scaled to 200%? Does the layout function across the supported viewport range without content overlap, overflow, or loss of functionality?

7. **Review motion and animation**: Are transitions and animations providing functional feedback or purely decorative? Is `prefers-reduced-motion` respected, disabling or reducing non-functional motion for users who require it?

## Quality Bar

**Excellent design exhibits**:

- All text passing WCAG 2.1 AA contrast ratios (4.5:1 normal, 3:1 large) verified by calculation, not perception
- Interactive component boundaries and focus indicators meeting 3:1 non-text contrast requirements
- No information conveyed by color alone; always paired with a non-color differentiator
- CSS custom properties used for all design tokens with semantic naming
- Specificity levels flat and predictable; no ID selectors in reusable components; `!important` absent except in documented utility overrides
- Text scaling to 200% without loss of functionality or content overlap
- `prefers-reduced-motion` media query reducing or disabling decorative animations
- Dark mode or high-contrast mode support through adaptive token values

**Poor design exhibits**:

- Color choices made visually on a calibrated display without contrast ratio verification
- Focus indicators styled to be invisible or barely visible to preserve aesthetics
- Information (errors, required status, active state) communicated by color with no alternative
- Magic number values scattered throughout stylesheets rather than design token references
- Specificity wars resolved with `!important` declarations
- Text overflow or layout breakage at 200% text scale
- Animations present without `prefers-reduced-motion` accommodation

## Common Failure Modes

**Aesthetic-driven contrast**: Selecting color combinations for visual harmony without verifying contrast ratios, producing combinations that are aesthetically pleasing but fail WCAG thresholds. Contrast ratios are arithmetic properties, not visual judgments; they must be calculated.

**Focus visibility sacrifice**: Removing or minimizing focus ring styles to avoid visual interruption of the design, leaving keyboard and assistive technology users without any indication of interactive focus. Focus indicators are functional, not cosmetic.

**Disabled-state neglect**: Applying reduced contrast to disabled form elements on the grounds that they are non-interactive, without verifying that users can still distinguish disabled from enabled states. Disabled elements must be perceivable as disabled, not invisible.

**Token vocabulary mismatch**: Using value-based custom property names (`--gray-200`, `--blue-600`) rather than semantic names (`--color-surface-subtle`, `--color-action-primary`). When brand colors change, every property must be renamed or all usage sites must be updated—eliminating the benefit of the token system.

**Specificity escalation**: Using increasingly high specificity selectors to override component styles, rather than correcting the cascade architecture. This produces stylesheets where later changes cannot predict or control visual outcomes.

**Motion blindness**: Adding transitions and animations that provide no functional feedback without providing a `prefers-reduced-motion` alternative. Some users experience vestibular disruption from motion; others configure their operating system explicitly to suppress it.

## Example Use

A design system defines a primary action color as a medium blue applied to button text on a white background. Buttons in a disabled state apply 40% opacity. Form error messages appear in red. Focus rings are set to `outline: none` with a custom thin blue underline.

Evaluation reveals: the medium blue on white achieves 3.2:1, below the 4.5:1 required for normal text; disabled opacity reduces contrast to approximately 1.9:1, making disabled state text illegible rather than perceptibly disabled; error messages rely on color alone; the focus indicator fails the 3:1 non-text contrast requirement against the white background.

The framework suggests: darkening the primary blue to achieve at least 4.5:1; replacing opacity-based disabled styling with explicit low-contrast colors that still meet 3:1 against the background (sufficient to perceive the element, insufficient to imply interactivity); adding an error icon alongside red error text; replacing the thin blue underline focus indicator with a visible offset outline meeting 3:1 contrast.

Reassessment verifies: all text meets 4.5:1; disabled elements are perceptible as present but non-interactive; error states are perceivable without color vision; focus indicators are clearly visible to keyboard users. The design system functions across the intended range of visual abilities.
