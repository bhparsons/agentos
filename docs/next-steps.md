# AgentOS Prototype — Next Steps

## Status

The V1 "Identify, Fix, Test, Ship" hillclimb loop is now implemented across all 6 phases (types, queue, fix/diagnose, playground, experiments, flow wiring). The items below are follow-on improvements to polish the prototype and strengthen the demo narrative.

---

## UI Polish & Visual Refinements

- [ ] Apply Decagon Purple theme consistently across new components (diagnosis cards, ramp stepper, guardrail status use generic colors currently)
- [ ] Dark mode audit — new callout cards (Pattern, Suggested Fix, Draft Preview) use hardcoded light colors with dark: overrides that need testing
- [ ] Mobile/responsive pass — queue filter bar and pipeline progress indicator may overflow on narrow screens
- [ ] Add loading skeletons for queue detail and experiment detail when switching items

## Queue Enhancements

- [ ] Sortable queue list — allow sorting by CSAT impact, volume, or date (currently only sorted by volume)
- [ ] Bulk actions — select multiple queue items and assign owner or change stage
- [ ] Queue item creation form — currently items are only seed data
- [ ] Search/text filter within queue items

## Fix/Diagnose Flow

- [ ] Deep-link "Edit AOP" to the specific AOP related to the queue item topic (currently goes to `/builder` generically)
- [ ] Conflict banner should link to the conflicting queue items
- [ ] Draft preview inline editing — allow quick edits to suggestion content without leaving the queue page

## Playground / Testing

- [ ] Real evaluation scoring — current score delta is a naive mock based on message count; wire up the `EvaluationResult` rubric scoring
- [ ] Persist test sessions — save playground conversations linked to queue items for later review
- [ ] Side-by-side diff of AOP versions in before/after mode
- [ ] Auto-populate replay conversations when arriving from queue context

## Experiments

- [ ] Auto-rollback behavior — when guardrail status is "breached", auto-trigger rollback and show notification
- [ ] Ramp stage history — show timestamps of when each ramp stage was reached
- [ ] Statistical significance visualization in the ramp stepper (green check per stage when p < 0.05)
- [ ] Create experiment dialog should pre-fill metrics based on the linked queue item's impact type

## Flow Wiring & Lifecycle

- [ ] Auto-stage progression: creating an experiment from a queue item should call `linkExperiment()` to move item to "validating"
- [ ] Completing an experiment successfully should call `promoteToShipped()` and create a `ShippedFix` entry in the trajectory data
- [ ] Trajectory chart shipped fix dots should be clickable — navigate to the queue item or experiment
- [ ] Dashboard/home page showing the full pipeline funnel (items in each stage)

## Demo & Presentation

- [ ] Guided walkthrough/tour overlay highlighting the end-to-end flow
- [ ] Screenshot suite for the hillclimb response document
- [ ] Record a click-through demo video of the full Identify > Fix > Test > Ship loop
