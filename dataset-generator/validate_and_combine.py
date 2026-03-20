#!/usr/bin/env python3
"""Combine batch JSONL files, validate against schema, compute stats."""

import json
import sys
from pathlib import Path
from collections import Counter

DATA_DIR = Path(__file__).parent.parent / "data"
SCHEMA_PATH = DATA_DIR / "schema.json"
OUTPUT_PATH = DATA_DIR / "ecommerce-transcripts.jsonl"
STATS_PATH = DATA_DIR / "dataset-stats.json"
NUM_BATCHES = 10

OUTCOME_TARGETS = {
    "resolved_by_bot": 110,
    "escalated_and_resolved": 50,
    "escalated_and_unresolved": 10,
    "abandoned": 20,
    "unresolved": 10,
}


def load_schema():
    return json.loads(SCHEMA_PATH.read_text())


def validate_field(conv, field, expected_type, allowed=None):
    """Validate a single field exists and has correct type/value."""
    errors = []
    val = conv.get(field)
    if val is None and expected_type != "nullable":
        errors.append(f"Missing required field: {field}")
    elif allowed and val not in allowed:
        errors.append(f"{field}={val!r} not in {allowed}")
    return errors


def validate_conversation(conv, schema):
    """Validate a conversation structurally. Returns list of error strings."""
    errors = []
    cid = conv.get("conversation_id", "UNKNOWN")

    # Check required top-level fields exist
    for field in schema.get("required", []):
        if field not in conv:
            errors.append(f"[{cid}] Missing required field: {field}")

    # Check domain/company constants
    if conv.get("domain") != "e-commerce":
        errors.append(f"[{cid}] domain={conv.get('domain')!r}, expected 'e-commerce'")
    if conv.get("company") != "ShopWave":
        errors.append(f"[{cid}] company={conv.get('company')!r}, expected 'ShopWave'")

    # Check enums
    valid_outcomes = ["resolved_by_bot", "escalated_and_resolved", "escalated_and_unresolved", "abandoned", "unresolved"]
    if conv.get("outcome") not in valid_outcomes:
        errors.append(f"[{cid}] Invalid outcome: {conv.get('outcome')!r}")

    valid_categories = ["order_status", "return_request", "refund_inquiry", "shipping_delay", "wrong_item",
                        "payment_failed", "promo_code", "product_question", "account_access", "other"]
    if conv.get("issue_category") not in valid_categories:
        errors.append(f"[{cid}] Invalid issue_category: {conv.get('issue_category')!r}")

    valid_complexity = ["simple", "moderate", "complex"]
    if conv.get("complexity") not in valid_complexity:
        errors.append(f"[{cid}] Invalid complexity: {conv.get('complexity')!r}")

    valid_tiers = ["standard", "premium", "VIP"]
    if conv.get("customer_tier") not in valid_tiers:
        errors.append(f"[{cid}] Invalid customer_tier: {conv.get('customer_tier')!r}")

    # Check satisfaction score range
    sat = conv.get("satisfaction_score")
    if not isinstance(sat, int) or sat < 1 or sat > 5:
        errors.append(f"[{cid}] satisfaction_score={sat!r} not in 1-5")

    # Check turns array
    turns = conv.get("turns", [])
    if not isinstance(turns, list) or len(turns) < 2:
        errors.append(f"[{cid}] turns has {len(turns) if isinstance(turns, list) else 0} items, need >=2")
        return errors  # Can't check further

    # Check turn structure
    valid_roles = {"customer", "bot", "human_agent", "system"}
    for t in turns:
        role = t.get("role")
        if role not in valid_roles:
            errors.append(f"[{cid}] Turn {t.get('turn_id')}: invalid role {role!r}")
        # Required fields
        for f in ["turn_id", "role", "message", "timestamp_offset_seconds", "tool_calls", "internal_note"]:
            if f not in t:
                errors.append(f"[{cid}] Turn {t.get('turn_id')}: missing field {f}")

    # Structural checks for escalated conversations
    if conv.get("was_escalated"):
        has_human = any(t.get("role") == "human_agent" for t in turns)
        has_system = any(t.get("role") == "system" for t in turns)
        if not has_human:
            errors.append(f"[{cid}] Escalated but no human_agent turns")
        if not has_system:
            errors.append(f"[{cid}] Escalated but no system transfer message")

    # Check bot turns have at least some tool_calls
    bot_turns = [t for t in turns if t.get("role") == "bot"]
    has_any_tool_call = any(t.get("tool_calls") for t in bot_turns)
    if not has_any_tool_call and conv.get("outcome") != "abandoned":
        errors.append(f"[{cid}] No tool_calls on any bot turn")

    # Check first bot turn has check_customer_tier
    first_bot = next((t for t in turns if t.get("role") == "bot"), None)
    if first_bot and first_bot.get("tool_calls"):
        tier_check = any(tc.get("tool") == "check_customer_tier" for tc in first_bot["tool_calls"])
        if not tier_check:
            errors.append(f"[{cid}] First bot turn missing check_customer_tier tool call")
    elif first_bot:
        errors.append(f"[{cid}] First bot turn has no tool_calls (expected check_customer_tier)")

    return errors


def compute_stats(conversations):
    """Compute distribution statistics."""
    stats = {
        "total": len(conversations),
        "outcomes": dict(Counter(c["outcome"] for c in conversations)),
        "escalation_triggers": dict(Counter(
            c["escalation_trigger"] for c in conversations if c.get("escalation_trigger")
        )),
        "issue_categories": dict(Counter(c["issue_category"] for c in conversations)),
        "complexity": dict(Counter(c["complexity"] for c in conversations)),
        "customer_tiers": dict(Counter(c["customer_tier"] for c in conversations)),
        "avg_turns": round(sum(len(c["turns"]) for c in conversations) / max(len(conversations), 1), 1),
        "avg_satisfaction": round(
            sum(c["satisfaction_score"] for c in conversations) / max(len(conversations), 1), 2
        ),
        "escalated_with_human_turns": sum(
            1 for c in conversations
            if c.get("was_escalated") and any(t["role"] == "human_agent" for t in c["turns"])
        ),
        "conversations_with_tool_calls": sum(
            1 for c in conversations
            if any(t.get("tool_calls") for t in c["turns"] if t["role"] == "bot")
        ),
    }
    return stats


def main():
    schema = load_schema()
    conversations = []
    missing_batches = []
    parse_errors = []

    # Load all batch files
    for i in range(1, NUM_BATCHES + 1):
        batch_file = DATA_DIR / f"batch-{i:02d}.jsonl"
        if not batch_file.exists():
            missing_batches.append(i)
            print(f"MISSING: {batch_file}")
            continue

        with open(batch_file) as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                try:
                    conv = json.loads(line)
                    conversations.append(conv)
                except json.JSONDecodeError as e:
                    parse_errors.append(f"batch-{i:02d}.jsonl line {line_num}: {e}")

    print(f"\nLoaded {len(conversations)} conversations from {NUM_BATCHES - len(missing_batches)} batch files")
    if missing_batches:
        print(f"Missing batches: {missing_batches}")
    if parse_errors:
        print(f"JSON parse errors: {len(parse_errors)}")
        for e in parse_errors[:5]:
            print(f"  {e}")

    # Validate
    all_errors = []
    for conv in conversations:
        errs = validate_conversation(conv, schema)
        all_errors.extend(errs)

    if all_errors:
        print(f"\nValidation errors: {len(all_errors)}")
        for e in all_errors[:20]:
            print(f"  {e}")
        if len(all_errors) > 20:
            print(f"  ... and {len(all_errors) - 20} more")
    else:
        print("\nAll conversations passed validation!")

    # Check for duplicate IDs
    ids = [c.get("conversation_id") for c in conversations]
    dupes = [cid for cid, count in Counter(ids).items() if count > 1]
    if dupes:
        print(f"\nDuplicate conversation IDs: {dupes}")

    # Write combined output
    with open(OUTPUT_PATH, "w") as f:
        for conv in conversations:
            f.write(json.dumps(conv) + "\n")
    print(f"\nWrote {len(conversations)} conversations to {OUTPUT_PATH}")

    # Compute and save stats
    stats = compute_stats(conversations)
    stats["validation_errors_count"] = len(all_errors)
    stats["parse_errors_count"] = len(parse_errors)
    stats["missing_batches"] = missing_batches

    with open(STATS_PATH, "w") as f:
        json.dump(stats, f, indent=2)
    print(f"Wrote stats to {STATS_PATH}")

    # Print distribution summary vs targets
    print(f"\n{'='*60}")
    print("DISTRIBUTION SUMMARY")
    print(f"{'='*60}")
    print(f"Total: {stats['total']} / 200")
    print(f"\nOutcomes (target):")
    for outcome, target in OUTCOME_TARGETS.items():
        actual = stats["outcomes"].get(outcome, 0)
        diff = actual - target
        flag = " !!!" if abs(diff) > target * 0.05 else ""
        print(f"  {outcome:30s} {actual:4d} / {target:4d}  ({diff:+d}){flag}")

    print(f"\nEscalation triggers:")
    for trigger, count in sorted(stats["escalation_triggers"].items()):
        print(f"  {trigger:30s} {count:4d}")

    print(f"\nIssue categories:")
    for cat, count in sorted(stats["issue_categories"].items()):
        print(f"  {cat:30s} {count:4d}")

    print(f"\nComplexity:")
    for comp, count in sorted(stats["complexity"].items()):
        print(f"  {comp:30s} {count:4d}")

    print(f"\nCustomer tiers:")
    for tier, count in sorted(stats["customer_tiers"].items()):
        print(f"  {tier:30s} {count:4d}")

    print(f"\nAvg turns: {stats['avg_turns']}")
    print(f"Avg satisfaction: {stats['avg_satisfaction']}")
    print(f"Escalated w/ human turns: {stats['escalated_with_human_turns']}")
    print(f"Convos w/ tool calls: {stats['conversations_with_tool_calls']}")
    print(f"Validation errors: {len(all_errors)}")

    return 0 if not all_errors and not missing_batches and len(conversations) == 200 else 1


if __name__ == "__main__":
    sys.exit(main())
