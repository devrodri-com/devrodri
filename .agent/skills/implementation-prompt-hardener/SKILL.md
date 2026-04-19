---
name: implementation-prompt-hardener
description: Use this skill when the user already has a strong implementation prompt and wants it hardened before sending it to Cursor. Focus on repo-specific blind spots, i18n consistency, responsive behavior, asset-vs-code decisions, runtime risks, compatibility issues, and missing technical constraints. Do not redesign the product scope unless necessary.
---

# Implementation Prompt Hardener

## Goal
Take an already-defined implementation task and improve it so execution in the real repo is safer, more complete, and less likely to miss hidden issues.

## Use this skill when
- the feature or change is already clearly defined,
- the user already has a detailed prompt,
- the main risk is incomplete implementation,
- the repo may contain hidden UI structure, duplicated logic, i18n dependencies, or asset-related constraints.

## Do not use this skill when
- the product requirements are still unclear,
- the user needs architecture from scratch,
- the task is primarily debugging a live issue interactively,
- the task is tiny and isolated.

## Required process
1. Read the implementation prompt and preserve its intended scope.
2. Inspect the real repo structure and locate the actual code paths.
3. Identify hidden gaps such as:
   - i18n dependencies
   - duplicated inline UI logic
   - asset vs code responsibility
   - responsive constraints
   - SEO / metadata side effects
   - state or layout consistency
   - local change safety
4. Add only the missing constraints needed to make implementation safe and complete.
5. Keep the task MVP-scoped.
6. Return an improved prompt ready to hand to Cursor.

## What to look for
- visual problems being solved in code when the asset is the real issue
- changes that must be applied in both ES and EN
- code paths duplicated in multiple components/pages
- layout issues caused by wrappers, spacing, aspect ratio, or state
- prompts that give Cursor too much freedom
- files that are already too large and should use a small focused component
- risk of overwriting unrelated local changes
- whether the task should be split into phases

## Output format
Return:
1. brief verdict on the original prompt
2. missing or risky points
3. improved prompt
4. what to manually verify after implementation

## Rules
- do not broaden the product scope
- do not add speculative future-proofing
- do not turn V1 into V2
- do not push unnecessary refactors
- prefer precise additions over rewriting everything
- avoid `any`
- if suggesting extraction, keep it small and justified