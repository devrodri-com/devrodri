---
name: ui-review-cursor-handoff
description: Use this skill when the user wants a critical UX/UI review of an existing screen, landing, portfolio section, or visual flow and needs a precise implementation handoff for Cursor. Focus on hierarchy, clarity, branding alignment, consistency, trust, and MVP-safe improvements. Do not implement changes.
---

# UI Review + Cursor Handoff

## Goal
Review an existing UI critically, identify the highest-value improvements, and return a precise prompt ready for Cursor.

## Use this skill when
- the user shares a screen, landing, section, card layout, or visual flow
- the task is about UX, hierarchy, consistency, branding, trust, or conversion
- the user wants critique plus a Cursor-ready implementation prompt
- the change should stay MVP-safe and low-risk

## Do not use this skill when
- the task is primarily backend or data-flow related
- the user wants direct implementation
- the task is a tiny visual tweak with no real product/UI decision
- the product requirements are still undefined

## Required process
1. Evaluate the current UI critically.
2. Separate:
   - what is already working
   - what is weakening clarity, trust, consistency, or conversion
3. Keep the actual product context in mind:
   - personal brand vs agency feel
   - MVP vs final polish
   - actual business goal of the screen
4. Recommend the highest-value improvements first.
5. Avoid broad redesigns unless explicitly requested.
6. Produce a precise prompt that Cursor can execute safely.

## What to look for
- clarity of the primary action
- message hierarchy
- consistency between sections
- brand alignment
- dark/light system consistency
- spacing rhythm
- card/layout consistency
- whether the real issue is the asset, not the component
- whether repeated inline structures should be extracted into one reusable component

## Output format
Return:
1. what is working
2. what is weakening the screen
3. the highest-priority improvement
4. a short V1/V2 plan only if useful
5. a precise Cursor prompt

## Rules
- do not implement changes
- do not edit files
- do not redesign the whole page unless explicitly requested
- keep recommendations aligned with the current product and brand
- prefer MVP-safe, high-impact, low-risk improvements
- avoid `any`
- if suggesting extraction, keep it small and justified