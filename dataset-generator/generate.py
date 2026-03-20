#!/usr/bin/env python3
"""
Generate synthetic e-commerce customer service conversations using Claude API.
Produces 200 conversations following ShopWave SOPs with realistic bot/human agent interactions.
"""

import json
import os
import random
import sys
import time
from pathlib import Path
from collections import Counter

import anthropic
from jsonschema import validate, ValidationError

# ── Paths ──
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "data"
SOPS_PATH = DATA_DIR / "ecommerce-sops.md"
SCHEMA_PATH = DATA_DIR / "schema.json"
OUTPUT_PATH = DATA_DIR / "ecommerce-transcripts.jsonl"
STATS_PATH = DATA_DIR / "dataset-stats.json"

# ── Distribution targets ──
TOTAL_CONVERSATIONS = 200

OUTCOME_DIST = {
    "resolved_by_bot": 110,
    "escalated_and_resolved": 50,
    "escalated_and_unresolved": 10,
    "abandoned": 20,
    "unresolved": 10,
}

ESCALATION_TRIGGER_DIST = {
    "high_value_refund": 10,
    "repeated_failures": 8,
    "fraud_unauthorized": 8,
    "vip_customer": 8,
    "customer_requested": 8,
    "multi_order": 6,
    "complaint_retention": 6,
    "out_of_policy": 3,
    "shipping_damage": 3,
}

ISSUE_CATEGORY_DIST = {
    "order_status": 30,
    "return_request": 30,
    "refund_inquiry": 24,
    "shipping_delay": 24,
    "wrong_item": 20,
    "payment_failed": 16,
    "promo_code": 16,
    "product_question": 20,
    "account_access": 10,
    "other": 10,
}

COMPLEXITY_DIST = {"simple": 80, "moderate": 80, "complex": 40}
TIER_DIST = {"standard": 160, "premium": 30, "VIP": 10}

TURN_RANGES = {"simple": (4, 8), "moderate": (8, 16), "complex": (12, 25)}

SENTIMENTS_START = ["frustrated", "neutral", "confused", "angry", "polite"]
SENTIMENTS_END = ["satisfied", "neutral", "dissatisfied", "angry"]

# Map escalation triggers to compatible issue categories
TRIGGER_ISSUE_MAP = {
    "high_value_refund": ["return_request", "refund_inquiry", "wrong_item"],
    "repeated_failures": ["order_status", "payment_failed", "shipping_delay", "account_access", "promo_code"],
    "fraud_unauthorized": ["payment_failed", "other"],
    "vip_customer": ["order_status", "return_request", "refund_inquiry", "shipping_delay", "product_question"],
    "customer_requested": ["order_status", "return_request", "shipping_delay", "product_question", "promo_code", "other"],
    "multi_order": ["return_request", "refund_inquiry", "order_status"],
    "complaint_retention": ["shipping_delay", "wrong_item", "return_request", "other"],
    "out_of_policy": ["return_request", "refund_inquiry"],
    "shipping_damage": ["wrong_item", "shipping_delay", "other"],
}


def load_sops() -> str:
    return SOPS_PATH.read_text()


def load_schema() -> dict:
    return json.loads(SCHEMA_PATH.read_text())


def build_scenario_cards() -> list[dict]:
    """Build 200 scenario cards with target distributions."""
    cards = []
    card_id = 1

    # Flatten distributions into lists
    outcomes = []
    for outcome, count in OUTCOME_DIST.items():
        outcomes.extend([outcome] * count)
    random.shuffle(outcomes)

    # Build escalation trigger queue for escalated outcomes
    escalation_triggers = []
    for trigger, count in ESCALATION_TRIGGER_DIST.items():
        escalation_triggers.extend([trigger] * count)
    random.shuffle(escalation_triggers)

    # Build issue category pool
    issue_pool = []
    for cat, count in ISSUE_CATEGORY_DIST.items():
        issue_pool.extend([cat] * count)
    random.shuffle(issue_pool)

    # Build complexity pool
    complexity_pool = []
    for comp, count in COMPLEXITY_DIST.items():
        complexity_pool.extend([comp] * count)
    random.shuffle(complexity_pool)

    # Build tier pool
    tier_pool = []
    for tier, count in TIER_DIST.items():
        tier_pool.extend([tier] * count)
    random.shuffle(tier_pool)

    esc_idx = 0
    for i in range(TOTAL_CONVERSATIONS):
        outcome = outcomes[i]
        is_escalated = outcome in ("escalated_and_resolved", "escalated_and_unresolved")
        complexity = complexity_pool[i]

        if is_escalated:
            trigger = escalation_triggers[esc_idx]
            esc_idx += 1
            # Pick a compatible issue category for this trigger
            compatible = TRIGGER_ISSUE_MAP[trigger]
            # Try to use one from the pool
            issue_cat = None
            for j, cat in enumerate(issue_pool):
                if cat in compatible:
                    issue_cat = issue_pool.pop(j)
                    break
            if issue_cat is None:
                issue_cat = random.choice(compatible)
        else:
            trigger = None
            if issue_pool:
                issue_cat = issue_pool.pop(0)
            else:
                issue_cat = random.choice(list(ISSUE_CATEGORY_DIST.keys()))

        # VIP trigger forces VIP tier
        if trigger == "vip_customer":
            tier = "VIP"
        else:
            tier = tier_pool[i] if i < len(tier_pool) else random.choice(["standard", "premium"])

        # Escalated cases should be at least moderate
        if is_escalated and complexity == "simple":
            complexity = "moderate"

        turn_min, turn_max = TURN_RANGES[complexity]
        sentiment_start = random.choice(SENTIMENTS_START)

        # Determine end sentiment based on outcome
        if outcome == "resolved_by_bot":
            sentiment_end = random.choice(["satisfied", "satisfied", "satisfied", "neutral"])
            sat_score = random.choice([4, 4, 5, 5, 3])
        elif outcome == "escalated_and_resolved":
            sentiment_end = random.choice(["satisfied", "satisfied", "neutral"])
            sat_score = random.choice([3, 4, 4, 5])
        elif outcome == "escalated_and_unresolved":
            sentiment_end = random.choice(["dissatisfied", "angry", "neutral"])
            sat_score = random.choice([1, 2, 2])
        elif outcome == "abandoned":
            sentiment_end = random.choice(["dissatisfied", "neutral", "angry"])
            sat_score = random.choice([1, 2, 2, 3])
        elif outcome == "unresolved":
            sentiment_end = random.choice(["dissatisfied", "angry"])
            sat_score = random.choice([1, 1, 2])

        cards.append({
            "conversation_id": f"CONV-{card_id:04d}",
            "outcome": outcome,
            "was_escalated": is_escalated,
            "escalation_trigger": trigger,
            "issue_category": issue_cat,
            "complexity": complexity,
            "customer_tier": tier,
            "turn_range": (turn_min, turn_max),
            "customer_sentiment_start": sentiment_start,
            "customer_sentiment_end": sentiment_end,
            "satisfaction_score": sat_score,
        })
        card_id += 1

    return cards


def build_generation_prompt(card: dict, sops: str) -> str:
    """Build the prompt for generating a single conversation."""
    esc_instructions = ""
    if card["was_escalated"]:
        esc_instructions = f"""
ESCALATION REQUIREMENTS:
- This conversation MUST be escalated to a human agent.
- Escalation trigger: {card["escalation_trigger"]}
- The bot should handle the initial turns, then hit the escalation trigger naturally.
- When escalating, the bot says something like: "I want to make sure you get the best help with this. Let me connect you with a specialist."
- Then include a system message: {{"role": "system", "message": "Customer transferred to human agent. Context: [brief summary of issue and what bot already did]"}}
- After the system message, a human_agent continues the conversation with full context.
- Outcome: {card["outcome"]} — {"the human agent resolves the issue" if card["outcome"] == "escalated_and_resolved" else "the human agent is unable to fully resolve the issue in this interaction"}.
"""
    elif card["outcome"] == "abandoned":
        esc_instructions = """
ABANDONED CONVERSATION:
- The customer stops responding at some point (their last message should feel natural — not a goodbye).
- The bot sends 1-2 follow-up messages asking if they're still there, then the conversation ends.
"""
    elif card["outcome"] == "unresolved":
        esc_instructions = """
UNRESOLVED CONVERSATION:
- The bot tries to help but cannot fully resolve the customer's issue.
- The bot does NOT escalate (perhaps the issue doesn't match an escalation trigger clearly).
- The conversation ends with the customer unsatisfied but not requesting a human.
"""
    elif card["outcome"] == "resolved_by_bot":
        esc_instructions = """
BOT-RESOLVED CONVERSATION:
- The bot successfully resolves the customer's issue using its available tools.
- The conversation ends positively with the customer's problem solved.
"""

    return f"""You are generating a realistic synthetic customer service chat transcript for training data.

## Company SOPs
{sops}

## Scenario Card
- Conversation ID: {card["conversation_id"]}
- Issue category: {card["issue_category"]}
- Complexity: {card["complexity"]}
- Customer tier: {card["customer_tier"]}
- Customer starting sentiment: {card["customer_sentiment_start"]}
- Customer ending sentiment: {card["customer_sentiment_end"]}
- Target turn count: {card["turn_range"][0]}-{card["turn_range"][1]} turns
- Satisfaction score: {card["satisfaction_score"]}/5
{esc_instructions}

## Output Format
Return a single JSON object (no markdown, no explanation) with this exact structure:
{{
  "conversation_id": "{card["conversation_id"]}",
  "domain": "e-commerce",
  "company": "ShopWave",
  "issue_category": "{card["issue_category"]}",
  "issue_subcategory": "<specific subcategory, e.g. 'late_delivery', 'size_exchange', 'expired_promo'>",
  "was_escalated": {json.dumps(card["was_escalated"])},
  "escalation_trigger": {json.dumps(card["escalation_trigger"])},
  "escalation_turn": <int or null — the turn_id where escalation happens>,
  "outcome": "{card["outcome"]}",
  "resolution_detail": "<1-2 sentence description of how the conversation was resolved or left unresolved>",
  "customer_sentiment_start": "{card["customer_sentiment_start"]}",
  "customer_sentiment_end": "{card["customer_sentiment_end"]}",
  "satisfaction_score": {card["satisfaction_score"]},
  "complexity": "{card["complexity"]}",
  "customer_tier": "{card["customer_tier"]}",
  "turns": [
    {{
      "turn_id": 1,
      "role": "customer|bot|human_agent|system",
      "message": "<the message text>",
      "timestamp_offset_seconds": <seconds from conversation start>,
      "tool_calls": [
        {{
          "tool": "<tool_name>",
          "input": {{"<param>": "<value>"}},
          "output": {{"<field>": "<value>"}}
        }}
      ] or null,
      "internal_note": "<bot/agent internal reasoning>" or null
    }}
  ]
}}

## Rules
1. Bot turns that look up information MUST include realistic tool_calls with plausible inputs/outputs.
2. Use realistic order IDs (ORD-XXXXX), tracking numbers, product names, and prices.
3. Customer messages should feel natural — typos, casual language, varying formality.
4. Bot messages should follow the tone guidelines in the SOPs.
5. The first bot turn should include a `check_customer_tier` tool call as a background check.
6. timestamp_offset_seconds should increase realistically (customers: 15-120s between messages, bot: 3-10s response time).
7. The turn count must be between {card["turn_range"][0]} and {card["turn_range"][1]}.
8. internal_note should be used on bot/agent turns to show reasoning (e.g., "Customer is within return window, proceeding with return" or "Refund exceeds $200 threshold, must escalate").
9. Generate a complete, realistic conversation. Do not use placeholder text.
10. Return ONLY the JSON object, nothing else."""


def generate_conversation(client: anthropic.Anthropic, card: dict, sops: str, max_retries: int = 3) -> dict:
    """Generate a single conversation using Claude API."""
    prompt = build_generation_prompt(card, sops)

    for attempt in range(max_retries):
        try:
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=8192,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.9,
            )

            text = response.content[0].text.strip()
            # Strip markdown code fences if present
            if text.startswith("```"):
                text = text.split("\n", 1)[1]
                if text.endswith("```"):
                    text = text[: text.rfind("```")]
                text = text.strip()

            conversation = json.loads(text)
            return conversation

        except json.JSONDecodeError as e:
            print(f"  JSON parse error on attempt {attempt + 1}: {e}")
            if attempt == max_retries - 1:
                raise
        except anthropic.APIError as e:
            print(f"  API error on attempt {attempt + 1}: {e}")
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)

    raise RuntimeError(f"Failed to generate {card['conversation_id']} after {max_retries} attempts")


def validate_conversation(conversation: dict, schema: dict) -> list[str]:
    """Validate a conversation against the schema. Returns list of errors."""
    errors = []
    try:
        validate(instance=conversation, schema=schema)
    except ValidationError as e:
        errors.append(f"Schema validation: {e.message}")

    # Additional checks
    if conversation.get("was_escalated"):
        has_human = any(t.get("role") == "human_agent" for t in conversation.get("turns", []))
        has_system = any(t.get("role") == "system" for t in conversation.get("turns", []))
        if not has_human:
            errors.append("Escalated conversation missing human_agent turns")
        if not has_system:
            errors.append("Escalated conversation missing system transfer message")

    # Check that bot turns have at least some tool_calls across the conversation
    bot_turns = [t for t in conversation.get("turns", []) if t.get("role") == "bot"]
    has_any_tool_call = any(t.get("tool_calls") for t in bot_turns)
    if not has_any_tool_call and conversation.get("outcome") != "abandoned":
        errors.append("No tool_calls found on any bot turn")

    return errors


def compute_stats(conversations: list[dict]) -> dict:
    """Compute distribution statistics from generated conversations."""
    stats = {
        "total": len(conversations),
        "outcomes": dict(Counter(c["outcome"] for c in conversations)),
        "escalation_triggers": dict(Counter(c["escalation_trigger"] for c in conversations if c["escalation_trigger"])),
        "issue_categories": dict(Counter(c["issue_category"] for c in conversations)),
        "complexity": dict(Counter(c["complexity"] for c in conversations)),
        "customer_tiers": dict(Counter(c["customer_tier"] for c in conversations)),
        "avg_turns": round(sum(len(c["turns"]) for c in conversations) / len(conversations), 1),
        "avg_satisfaction": round(sum(c["satisfaction_score"] for c in conversations) / len(conversations), 2),
        "escalated_with_human_turns": sum(
            1 for c in conversations
            if c["was_escalated"] and any(t["role"] == "human_agent" for t in c["turns"])
        ),
        "conversations_with_tool_calls": sum(
            1 for c in conversations
            if any(t.get("tool_calls") for t in c["turns"] if t["role"] == "bot")
        ),
    }
    return stats


def main():
    # Check for API key
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Error: ANTHROPIC_API_KEY environment variable not set.")
        sys.exit(1)

    client = anthropic.Anthropic()
    sops = load_sops()
    schema = load_schema()

    print("Building scenario cards...")
    cards = build_scenario_cards()

    # Print distribution preview
    print(f"\nScenario distribution preview:")
    print(f"  Outcomes: {dict(Counter(c['outcome'] for c in cards))}")
    print(f"  Escalation triggers: {dict(Counter(c['escalation_trigger'] for c in cards if c['escalation_trigger']))}")
    print(f"  Issue categories: {dict(Counter(c['issue_category'] for c in cards))}")
    print(f"  Complexity: {dict(Counter(c['complexity'] for c in cards))}")
    print(f"  Tiers: {dict(Counter(c['customer_tier'] for c in cards))}")

    conversations = []
    validation_errors = []

    # Resume from existing output if present
    start_idx = 0
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH, "r") as f:
            for line in f:
                line = line.strip()
                if line:
                    conversations.append(json.loads(line))
        start_idx = len(conversations)
        if start_idx > 0:
            print(f"\nResuming from conversation {start_idx + 1} (found {start_idx} existing)")

    print(f"\nGenerating {TOTAL_CONVERSATIONS - start_idx} conversations...\n")

    # Open in append mode
    with open(OUTPUT_PATH, "a") as outfile:
        for i in range(start_idx, TOTAL_CONVERSATIONS):
            card = cards[i]
            conv_id = card["conversation_id"]

            print(f"[{i + 1}/{TOTAL_CONVERSATIONS}] Generating {conv_id} "
                  f"({card['issue_category']}, {card['outcome']}, {card['complexity']})...", end=" ")

            try:
                conversation = generate_conversation(client, card, sops)

                # Validate
                errors = validate_conversation(conversation, schema)
                if errors:
                    print(f"WARNINGS: {errors}")
                    validation_errors.extend([(conv_id, e) for e in errors])
                else:
                    print("OK")

                conversations.append(conversation)
                outfile.write(json.dumps(conversation) + "\n")
                outfile.flush()

            except Exception as e:
                print(f"FAILED: {e}")
                validation_errors.append((conv_id, str(e)))
                continue

            # Rate limiting — stay under API limits
            if (i + 1) % 10 == 0:
                print(f"  ... {i + 1}/{TOTAL_CONVERSATIONS} done, pausing briefly...")
                time.sleep(2)

    # Compute and save stats
    print("\nComputing statistics...")
    stats = compute_stats(conversations)
    stats["validation_errors"] = [{"conversation_id": cid, "error": err} for cid, err in validation_errors]

    with open(STATS_PATH, "w") as f:
        json.dump(stats, f, indent=2)

    # Print summary
    print(f"\n{'='*60}")
    print(f"GENERATION COMPLETE")
    print(f"{'='*60}")
    print(f"Total conversations: {stats['total']}")
    print(f"Average turns: {stats['avg_turns']}")
    print(f"Average satisfaction: {stats['avg_satisfaction']}")
    print(f"\nOutcome distribution:")
    for outcome, count in stats["outcomes"].items():
        target = OUTCOME_DIST.get(outcome, "?")
        print(f"  {outcome}: {count} (target: {target})")
    print(f"\nEscalation triggers:")
    for trigger, count in stats["escalation_triggers"].items():
        target = ESCALATION_TRIGGER_DIST.get(trigger, "?")
        print(f"  {trigger}: {count} (target: {target})")
    print(f"\nEscalated with human turns: {stats['escalated_with_human_turns']}")
    print(f"Conversations with tool calls: {stats['conversations_with_tool_calls']}")
    print(f"Validation errors: {len(validation_errors)}")
    print(f"\nOutput: {OUTPUT_PATH}")
    print(f"Stats: {STATS_PATH}")


if __name__ == "__main__":
    main()
