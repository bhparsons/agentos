# Productizing Hillclimbing: From Signals to System

## The Insight

The enterprise that wins a 30-day POC isn't the one with the best starting numbers — it's the one that improves fastest. Decagon's business model depends on this: a platform where customers self-serve their way to better performance, without dependency on forward-deployed engineering or Decagon-managed services. The faster a CX team can independently drive improvement, the faster Decagon wins deals, expands accounts, and reduces support load.

The platform already has strong building blocks — Duet, Agent Workbench, Diagnostics, Simulations, Experiments, Knowledge Suggestions, Watchtower, and Agent Versioning. What's missing is the **system that connects them** into a guided improvement workflow.

Three gaps remain:

1. **Proactive prioritization** — The platform surfaces signals but doesn't tell a CX lead what to fix next. Workbench is reactive. Duet is general-purpose. Neither produces a ranked, typed backlog of improvement opportunities with clear next actions.

2. **A guided improvement workflow** — Going from "see a problem" to "ship a fix" requires navigating five or more discrete tools. The path from diagnosis to draft to test to approval to deployment should be one connected flow.

3. **A granular diagnostic model** — "Deflection dropped 3%" isn't actionable. Knowing that 47 conversations per day fail at the *resolution* stage due to a *knowledge gap* — and that the fix is a KB article a CX lead can draft in minutes — is.

**The goal: users can drive material week-over-week improvements in minutes, not days.** Minutes to make a change. Hours to validate. Days only if stakeholder sign-off is needed — and the tooling produces shareable artifacts (projected impact, simulation results, recommended experiment config) that make approval fast.

---

## The Conversation Progression Model

Deflection is binary: resolved or escalated. But agent improvement isn't. Moving 200 conversations per day from failing at triage to failing at resolution is real, measurable progress — even before the deflection number moves. A POC team that can show this trajectory wins the deal.

The conversation progression model classifies *where* each conversation breaks down, complementing Intent Tags which classify *what* the customer wanted. Together: "billing dispute that failed at resolution due to a KB gap" — a diagnosis that maps directly to a fix. *(See Appendix C for detailed stage definitions and failure taxonomy.)*

| Stage | Cleared When | Common Failure Modes | Fix Category |
|-------|-------------|---------------------|-------------|
| **1. Connect & Context** | Issue identified, user authenticated, details ingested | Information retrieval failure; user authentication issues; agent fails to understand user intent | Procedure tuning; guardrail adjustment; tool access |
| **2. Triage** | Correct resolution path identified; self-help options shared | Misclassification of issue; user frustration leading to escalation request or abandonment | AOP logic; intent training; conversation design |
| **3. Resolve** | Resolution actioned successfully | Issue outside actionable scope; no available knowledge; user does not accept resolution; agent can't execute required action | KB update; tool/API integration; AOP / policy revision |
| **4. Close** | Case fully wrapped up, all parties notified | Failure to close and resolve case; missed follow-up actions with other parties; incomplete handoff | Process completion; monitoring |

> **Abandonment:** Users may exit at any stage — positively (self-resolved) or negatively (frustration, distrust). Both are tracked but attributed differently.
>
> **Hallucination:** More commonly surfaced through review and evaluation than as a direct escalation trigger. Watchtower evals catch these; they don't always show up in escalation data.

---

## The Product

### The Agent Refinement Lifecycle

Every improvement follows the same path. The opportunity is to systematize each step — composing existing features where possible, building net-new where necessary.

| Stage | What Happens | Existing Feature | What We Add | User Time |
|---|---|---|---|---|
| **Identify** | Surface what's broken | Intent Tags, Diagnostics | Conversation stage classification, proactive clustering | Automated |
| **Prioritize** | Decide what to fix next | — | Impact Queue with volume, lift estimate, fix type, owner | Minutes |
| **Investigate** | Understand root cause | Agent Workbench, Trace View | Proactive context from queue, linked example conversations | Minutes |
| **Draft** | Create the fix | Knowledge Suggestions, AOP Copilot, Duet | Pre-populated drafts; engineering specs for capability gaps | Minutes |
| **Test** | Validate the change | Simulations | Before/after comparison; labeled statements (V2); mock tools (V2) | Minutes–hours |
| **Approve** | Get stakeholder sign-off | — | Shareable report (in-app + exportable) with projected impact | Hours–days |
| **Ship** | Deploy to production | Experiments, Agent Versioning | One-click promotion, auto-suggested guardrail metrics | Minutes |
| **Monitor** | Confirm improvement | Watchtower, Experiments | Attribution timeline, human-calibrated evals (V2) | Automated |

### Building on What Exists

We set explicit requirements for how existing features participate. Where a feature meets these today, we compose it directly. Where it doesn't, the gap becomes part of our build. *(See Appendix B for detailed requirements.)*

| Existing Feature | Refinement Stage | What We Need From It |
|---|---|---|
| **Intent Tags + Diagnostics** | Identify | Extend tagging to include conversation *stage* alongside intent. Feed prioritized issues into the Impact Queue. |
| **Agent Workbench** | Investigate | Investigation layer for drill-down from Impact Queue items. Feed it proactive context from the queue. |
| **Knowledge Suggestions** | Draft | Pre-link drafts to the specific failure cluster that surfaced them. |
| **Simulations** | Test | Support *before/after comparison* — run a proposed change against the same failure set to project impact. |
| **Agent Versioning** | Draft, Ship | Workspace isolation = editing environment. Versioned commits = audit trail for attribution. |
| **Experiments** | Ship, Monitor | One-click promotion from validated change. Auto-suggest guardrail metrics by change type. |
| **Watchtower** | Monitor | Add human calibration loop — mark agreement/disagreement with automated judgments. |
| **Duet** | Draft, Investigate | Powers drafting and analysis within the structured improvement workflow. |

### What We Add

We introduce **five new surfaces and capabilities** that — combined with extensions to existing features above — deliver a complete, guided improvement product. These five map primarily to the Prioritize, Approve, and Monitor stages of the lifecycle, while extending existing features in the Identify, Investigate, Draft, Test, and Ship stages.

**1. Impact Queue** — A prioritized, AI-generated backlog of improvement opportunities. Not a dashboard — a guided workflow entry point.

- **Proactive:** Surfaces problems the CX team hasn't investigated yet, ranked by volume (V1) and estimated lift (V2)
- **Typed:** Each item classified by conversation stage, fix type, and owner
- **Actionable:** Each item links directly to a fix path (draft, edit, spec)

Fix types stratified by complexity: **quick fixes** (KB gap, guardrail threshold, AOP edit — CX team, hours) | **policy decisions** (business owner, variable) | **capability gaps** (missing tool/API — engineering, days–weeks with spec generated). For quick fixes, drafts are pre-populated. For capability gaps, an engineering spec is generated automatically.

**2. Connected Workflow Pipeline** — The wiring from queue item → investigate → draft → test → approve → ship → monitor without switching contexts. Each step composes an existing feature; the pipeline is the new connective tissue.

**3. Human Review and Labeling** — CX leads confirm or override the system's classifications, building ground truth that improves future recommendations.

**4. Shareable Approval Artifacts** — When a change needs sign-off, the system produces a report with the issue summary, projected impact, simulation results, and recommended experiment config — viewable in-app and exportable.

**5. Attribution Timeline** — Every shipped change annotated on the performance graph with before/after impact, making the improvement story concrete for POC reviews.

Later phases (V2–V3) introduce additional surfaces beyond these five — mock tools, labeled statements, AI vs. human comparison — that extend the system's depth without changing its core workflow.

### Development Phases

**V1 — Connect the Loop.** Focus on the easiest, highest-frequency changes — KB updates, AOP edits, guardrail adjustments — and make it low-friction for a single CX lead to walk through the end-to-end process and get approval for their change to go into production. Zero client engineering required.

- Conversation stage classification applied at scale (extending Intent Tags)
- Impact Queue as the primary entry point, with connected workflow through to deployment
- Human review interface for refining classifications and building ground truth
- Shareable approval artifacts and attribution timeline for POC storytelling

**V2 — Validate at Scale.** Add the confidence layer so changes are validated against historical data before touching live traffic, and extend the system to handle more complex fix types.

- Simulation replay with projected aggregate impact; estimated lift scoring in the Impact Queue
- **Mock tools** — lightweight stubs for testing AOP flows before integrations are built, parallelizing development and generating engineering specs
- **Labeled statements** — per-case success conditions as a lightweight alternative to calibrating custom evals
- Human-calibrated Watchtower evals; semi-automatic revisions for low-risk fixes

**V3 — Learn from Human Agents.** Ingest human agent + customer transcripts from ticketing systems (Zendesk, Salesforce); ideally also human tool calls and actions.

- **AI vs. Human comparison surface** — side-by-side view surfacing policy divergence across case types
- **1-click alignment** — when divergence is found, easy actions: add tool, modify policy, update AOP
- Bidirectional learning (sometimes AI is right, human is inconsistent)
- Connect support outcomes to business metrics (retention, LTV)

**V4 — Full System Access.** Unrestricted API/CLI access so the improvement system sees a complete view of available tools, data, and resources — not just what client teams manually expose. Enables fully closed-loop improvement.

---

## V1 in Action: The 30-Day POC

The math: ~1–2 weeks to baseline, changes must ship in hours to leave 1–2 weeks for remeasurement. Every day spent diagnosing is a day not spent improving.

**Week 1:** Deploy agent, establish baselines. Intent Tags and Diagnostics classify conversations. The conversation progression model clusters failure patterns by stage.

**Week 2:** CX lead opens the Impact Queue. Top item: *"34 escalations/day on billing disputes — agent has no guidance for orders over $500. Stage 3 KB gap."* Clicks through to example conversations. Knowledge Suggestions has a pre-populated draft. Tests in Simulations — before/after shows the agent handles it correctly. Promotes to Experiment at 10%. Total time: under an hour.

**Week 3:** Experiment shows +12 containments/day, stable CSAT. Ramps to 100%. Second queue item: *"Agent misclassifies 'change subscription' as 'cancel' 28 times/day. Stage 2 AOP logic error."* Edits AOP, tests, ships. Third item requires a tool integration — system generates a spec, CX lead shares the approval artifact with engineering.

**Week 4:** POC review. Attribution timeline shows four specific improvements with before/after data. Containment 55% → 63%, stable CSAT. Stage 2 failure volume dropped 40% — even conversations that still escalate are getting further. The story: specific actions, specific impact, and a clear queue of what's next.

---

## Measuring Success

**Core goal:** Demonstrate measurable, attributable improvement velocity within 30 days.

**Primary metrics:** Improvement velocity (week-over-week slope in containment) and POC win rate. The progression model gives us a leading indicator — stage-level improvement — before the lagging metric (deflection rate) moves.

| Metric | What It Tells Us |
|--------|-----------------|
| **POC win rate** | Does this help win competitive bakeoffs? |
| **Improvement velocity** | Week-over-week containment slope |
| **CX team autonomy rate** | % of fixes shipped without Decagon or engineering involvement |
| **Fix-to-lift ratio** | % of shipped fixes that actually moved metrics |
| **Time-to-target** | Days to reach the customer's goal |

*(See Appendix D for extended tradeoff analysis: containment vs. CSAT, automation vs. control, and full success metric targets.)*
