# Appendix: Productizing Hillclimbing

## Appendix A: Decagon Platform Context

This proposal builds on a rapid cadence of platform releases shipped between September 2025 and March 2026. Below is the relevant timeline, followed by the specific features this proposal composes or extends.

### Recent Release Timeline

| Date | Release | Significance |
|------|---------|-------------|
| Sep 23, 2025 | Voice 2.0, AOP Copilot, Simulations | Foundation: voice latency, builder tools, testing |
| Nov 5, 2025 | Agent Versioning | CI/CD for agents: workspace isolation, diffs, rollback |
| Dec 12, 2025 | Trace View | Observability: step-by-step agent reasoning visualization |
| Jan 14, 2026 | Diagnostic Tools | Escalation Drivers + AOP Flow Analysis |
| Jan 27, 2026 | Series D: $250M at $4.5B | Validates market position and growth trajectory |
| Feb 2, 2026 | Templates | AOP, Tool, and Watchtower blueprints for faster deployment |
| Feb 18, 2026 | Intent Tags | Hierarchical 3-level intent classification |
| Mar 9, 2026 | Agent Workbench, User Memory, Outbound Voice | Spring '26 launch: autonomous debugging, persistent context, proactive calling |
| Mar 19, 2026 | Duet | AI agent building partner: build, test, and improve agents |

### Features Referenced in This Proposal

**Identify & Diagnose**

| Feature | Released | Role in This Proposal |
|---------|----------|----------------------|
| Intent Tags | Feb 2026 | Extend with conversation *stage* dimension to power the progression model |
| Diagnostic Tools | Jan 2026 | Escalation Drivers and AOP Flow Analysis feed failure patterns into the Impact Queue |
| Trace View | Dec 2025 | Step-by-step reasoning view used during investigation drill-downs |
| Agent Workbench | Mar 2026 | Investigation layer for root-cause analysis from queue items |

**Build & Iterate**

| Feature | Released | Role in This Proposal |
|---------|----------|----------------------|
| AOPs + AOP Copilot | Sep 2025 | Core configuration surface; Copilot assists drafting AOP edits |
| Knowledge Suggestions | Existing | Pre-populates KB drafts linked to specific failure clusters |
| Duet | Mar 2026 | Powers drafting and analysis within the structured improvement workflow |
| Templates | Feb 2026 | Accelerates deployment of new AOP and Watchtower configurations |

**Validate & Ship**

| Feature | Released | Role in This Proposal |
|---------|----------|----------------------|
| Simulations | Sep 2025 | Before/after comparison of proposed changes against historical failures |
| Experiments | Existing | A/B testing on live traffic; one-click promotion from validated changes |
| Agent Versioning | Nov 2025 | Workspace isolation for editing; versioned commits for attribution |
| Watchtower | Existing | Always-on QA monitoring; proposal adds human calibration loop |

---

## Appendix B: Detailed Product Requirements

### Impact Queue

**Fields per queue item:**

| Field | Description |
|-------|-------------|
| **Pattern** | What's going wrong, concretely (e.g., "47 escalations/day on billing disputes -- agent lacks refund policy for amounts >$500") |
| **Lifecycle stage** | Where the conversation breaks (Stage 2 misclassification, Stage 3 KB gap, Stage 3 missing tool) |
| **Volume** | Conversations per day hitting this failure mode |
| **Solution type** | KB update, AOP edit, new tool/integration, policy decision |
| **Owner** | CX team (fix now) vs. engineering (needs spec) vs. business owner (needs decision) |
| **Suggested fix** | Specific action -- draft this KB article, edit this AOP, adjust this threshold |
| **Tradeoff flags** | When a fix improves containment but risks CSAT, surface the tension explicitly |

**Filtering:** By AOP/issue type, solution type, owner, lifecycle stage, volume threshold.

**Ranking:** V1 ranks by volume. V2 adds estimated lift scoring (projected impact on containment rate).

### Conversation Stage Classifier

- Classify every conversation by the stage at which it concluded (cleared all stages, or failed at stage N)
- Apply per-question for multi-issue conversations
- Extend the existing Intent Tags infrastructure -- add a stage dimension to the existing theme/detail/outcome classification
- Support human override through the review interface
- Track classifier accuracy over time using human-labeled ground truth

### Fix Drafting

**KB drafts:**
- Pre-populated from Knowledge Suggestions and conversation context
- Linked to the specific failure cluster that surfaced them
- Editable in-place before promotion to test

**AOP edits:**
- Suggested based on the failure pattern (e.g., "add condition to distinguish 'change subscription' from 'cancel'")
- Editable in the AOP editor within the workflow

**Engineering specs (for capability gaps):**
- Auto-generated from failed conversations
- Include: what action is needed, example conversations showing the gap, expected inputs/outputs, priority based on volume
- Exportable for handoff to engineering teams

### Human Review Interface

- CX leads can view system classifications and confirm or override
- Override data feeds back into classifier training
- Optional -- does not block the workflow
- Track agreement rate between human and system classifications

### Attribution Annotations

- Every change shipped through the workflow is automatically annotated on the performance timeline
- Annotation includes: change description, change type, before/after metrics, date shipped
- Visible in Insights & Reporting dashboards
- Exportable for POC review presentations

### Shareable Approval Artifacts

- Generated when a change needs stakeholder sign-off (policy decisions, capability gaps, high-risk changes)
- Contents: issue summary with example conversations, proposed fix, projected impact (from simulation results if available), recommended experiment configuration
- Viewable as an in-app page with a shareable link
- Exportable as PDF/document for offline sharing via email or Slack

---

## Appendix C: Conversation Progression Model -- Detail

### What Defines an AI Agent's Capability

Four components determine what an AI support agent can and cannot do:

- **Knowledge** -- the information the agent can draw on. KB articles, FAQs, product documentation, policy details. If it's not in the KB, the agent either escalates or halluccinates.
- **Procedures** -- how the agent should act. AOPs define decision logic: when to offer a refund, how to verify identity, what sequence of steps to follow. Procedures encode business rules and conversational flow.
- **Guardrails** -- the boundaries the agent must respect. Escalation rules, compliance constraints, tone requirements, scope limits. These are constraint-based rather than flow-based -- they define what the agent must *not* do or *must always* do, regardless of the procedure it's following.
- **Capabilities** -- what the agent can do. Tool integrations, API connections, permissions. An agent that knows the refund policy, follows the right procedure, and respects guardrails still can't process the refund without access to the billing system.

These four areas map directly to the fix categories in the conversation progression model. Each stage's failure branches trace back to one or more of these components.

### Multi-Issue Conversations

The model applies per-question within a conversation. A customer who asks three things may get two resolved and one failed -- and that single failure branch may result in full escalation. The system should track stage progression per-question and attribute the overall conversation outcome to the furthest-failed stage.

### Metrics Applicability

This model is most directly applicable to **containment rate**, as containment can be cleanly attributed to a conversation stage -- we can identify *where* in the lifecycle a conversation failed and what type of intervention it needs.

But the model also helps break down commonalities and suspected root causes behind degradations in other metrics: CSAT, handle time, repeat contact rate, escalation quality. A drop in CSAT might trace to a cluster of Stage 3 failures where the agent gives correct but poorly communicated answers. A spike in handle time might trace to Stage 2 triage loops where the agent lacks context access.

The platform should default to containment + CSAT and be extensible to composite quality scores that reflect each customer's specific business objectives.

### Measurement Pitfalls

- **False deflections:** A user who returns within 72 hours with the same issue -- the metric was inflated but the problem wasn't solved. Track repeat contact rates and discount accordingly.
- **Sample bias:** Post-conversation CSAT only captures users who complete the conversation. Abandoned and escalated contacts are excluded, systematically overstating satisfaction. Measure what users *didn't* rate alongside what they did.

---

## Appendix D: Extended Tradeoffs

### Containment vs. CSAT

These metrics are often in tension. The Impact Queue surfaces this tradeoff on every recommendation -- "this will contain 200 more conversations/day but projected CSAT impact is -3 points" -- rather than quietly optimizing one at the other's expense. The platform should support customer-defined objective functions that balance these according to their priorities.

### Automation vs. Control (The Trust Ladder)

Duet's philosophy leans toward autonomous self-improvement. This proposal starts with human-in-the-loop by default -- deliberate for POC and trust-building.

The trust ladder:
1. **Agent Workbench** -- reactive, full control. Investigate known issues.
2. **Impact Queue** -- proactive suggestions, human approval. System surfaces and recommends; human decides.
3. **Semi-automatic** (V2) -- for low-risk fix types with demonstrated accuracy (e.g., KB additions with 95%+ acceptance rate), auto-draft and auto-test with human approval gate before shipping.
4. **Auto-apply** -- earned autonomy. System ships changes with monitoring and auto-rollback. The path to Duet's autonomous vision.

This isn't disagreeing with Duet's direction -- it's the path to get there.

### Full Success Metrics

| Metric | What It Tells Us | Target |
|--------|-----------------|--------|
| **POC win rate** | Does this help win competitive bakeoffs? | Increase vs. baseline |
| **Time-to-target** | Days to reach the customer's containment/CSAT goal | <21 days |
| **Improvement velocity** | Week-over-week slope -- how fast are we getting better? | Positive and accelerating |
| **Actions taken per week** | Is the CX team using the queue? (adoption) | >3 fixes shipped/week |
| **Fix-to-lift ratio** | What % of shipped fixes actually moved metrics? (quality) | >70% |
| **Diagnosis-to-fix time** | Are we collapsing the iteration loop? | <4 hours for quick fixes |
| **CX team autonomy rate** | What % of fixes ship without Decagon or engineering involvement? | >80% for KB/AOP fixes |
