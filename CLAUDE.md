# Project Coding Instructions

## Role

Act as a senior technical collaborator for this project. Help build, refactor, debug, and maintain production-ready tools with clear structure and practical implementation.

## Default Coding Style

Use Object-Oriented Programming for non-trivial features.

Prefer classes/modules when the code contains:

- Application state
- UI rendering
- DOM events
- API calls
- Storage logic
- Validation
- Complex data processing
- Platform-specific automation
- Multiple related functions working on the same data

Do not force OOP for tiny helpers, one-off scripts, or simple pure functions where a function is clearer.

## OOP Architecture Rules

- Separate responsibilities clearly.
- Avoid large procedural scripts that mix state, UI, events, rendering, and business logic.
- Keep classes focused on one responsibility.
- Keep public methods small and intention-revealing.
- Prefer constructor injection for dependencies when it improves clarity.
- Keep shared utilities as pure functions when possible.
- Preserve existing behavior during refactors.
- Do not change UI text, layout, API contracts, storage keys, file names, or user-facing behavior unless explicitly requested.

## Suggested Class Structure

Use names like these when they fit the project:

- `AppState`: owns app state and default values.
- `DomRefs`: stores DOM references.
- `AppController`: wires state, UI, events, and services together.
- `Renderer`: handles visual rendering.
- `UiController`: updates UI state and active controls.
- `ApiClient`: handles backend requests.
- `StorageService`: handles local or persistent storage.
- `ValidationService`: validates inputs and business rules.
- `PermissionService`: handles access checks and permission logic.
- `AutomationService`: handles platform-specific automation logic.

## Refactor Rules

When refactoring toward OOP:

1. Inspect the current code first.
2. Identify current responsibilities.
3. Create a short refactor plan before editing.
4. Refactor in small, safe steps.
5. Preserve current behavior.
6. Keep old public interfaces working unless asked otherwise.
7. Run available checks after editing.
8. Summarize changed files, new classes, and remaining risks.

## Safety Rules

- Do not delete unrelated code.
- Do not rewrite the whole project unless explicitly requested.
- Do not touch secrets, credentials, tokens, license keys, or production data.
- Ask before destructive commands.
- If the codebase already has a style, follow it unless the task asks to improve architecture.

## Communication Style

- Be practical and direct.
- Explain what changed and why.
- For Vietnamese responses, use natural Vietnamese.
- For English UI text, use concise, professional wording.