# Agent-Based Conversation Generation Plan

## Overview

We'll spawn 10 parallel agents, each generating 20 conversations. Each agent writes its batch to a separate file, then we combine them into the final `.jsonl`.

---

## Agent Architecture

### Batch Assignment

| Agent | Conversations | IDs | File |
|-------|--------------|-----|------|
| Agent 1 | 20 | CONV-0001 to CONV-0020 | `data/batch-01.jsonl` |
| Agent 2 | 20 | CONV-0021 to CONV-0040 | `data/batch-02.jsonl` |
| Agent 3 | 20 | CONV-0041 to CONV-0060 | `data/batch-03.jsonl` |
| Agent 4 | 20 | CONV-0061 to CONV-0080 | `data/batch-04.jsonl` |
| Agent 5 | 20 | CONV-0081 to CONV-0100 | `data/batch-05.jsonl` |
| Agent 6 | 20 | CONV-0101 to CONV-0120 | `data/batch-06.jsonl` |
| Agent 7 | 20 | CONV-0121 to CONV-0140 | `data/batch-07.jsonl` |
| Agent 8 | 20 | CONV-0141 to CONV-0160 | `data/batch-08.jsonl` |
| Agent 9 | 20 | CONV-0161 to CONV-0180 | `data/batch-09.jsonl` |
| Agent 10 | 20 | CONV-0181 to CONV-0200 | `data/batch-10.jsonl` |

### After All Agents Complete
- Combine all batch files into `data/ecommerce-transcripts.jsonl`
- Validate against `data/schema.json`
- Generate `data/dataset-stats.json`
- Delete batch files

---

## What Each Agent Receives

Each agent gets a prompt containing three sections:

### Section 1: Role & Task

```
You are a synthetic data generator. Your task is to generate exactly 20 realistic
customer service chat conversations for an e-commerce company called "ShopWave."

Write each conversation as a single-line JSON object. Write all 20 conversations
to the file: data/batch-{NN}.jsonl

Generate them one at a time using the Write tool, appending each conversation
as a new line.
```

### Section 2: SOPs (full content of `data/ecommerce-sops.md`)

The agent receives the complete ShopWave Agent Operating Procedures, including:
- Company profile (return window, shipping tiers, loyalty tiers)
- Bot identity & tone guidelines
- All 7 bot capabilities with tool definitions
- All 9 escalation triggers with conditions and required bot behavior
- The 8 available tools with input/output schemas
- Escalation handoff protocol
- Response guidelines

### Section 3: Scenario Cards (pre-computed)

Each agent receives exactly 20 scenario cards specifying the required attributes for each conversation. These are pre-assigned to hit the overall distribution targets. Example card:

```json
{
  "conversation_id": "CONV-0042",
  "outcome": "escalated_and_resolved",
  "was_escalated": true,
  "escalation_trigger": "high_value_refund",
  "issue_category": "return_request",
  "complexity": "moderate",
  "customer_tier": "standard",
  "turn_range": [8, 16],
  "customer_sentiment_start": "frustrated",
  "customer_sentiment_end": "satisfied",
  "satisfaction_score": 4
}
```

### Section 4: JSON Schema & Rules

The agent receives the exact JSON schema each conversation must conform to, plus these rules:

1. **Bot turns that look up information MUST include `tool_calls`** with realistic inputs/outputs
2. Use realistic order IDs (ORD-XXXXX), tracking numbers (1Z...), product names, prices
3. Customer messages should feel natural — varying formality, occasional typos, casual tone
4. Bot messages follow ShopWave tone: friendly, professional, concise
5. First bot turn must include a background `check_customer_tier` tool call
6. `timestamp_offset_seconds` increases realistically (customer: 15-120s gaps, bot: 3-10s)
7. Turn count must fall within the card's `turn_range`
8. `internal_note` on bot/agent turns shows reasoning
9. Escalated conversations must include the bot's handoff message, a system transfer message, and continued human_agent turns
10. Abandoned conversations: customer stops responding, bot sends 1-2 follow-ups
11. Each conversation should have unique customer names, order details, and scenarios — avoid repetition across the batch
12. `issue_subcategory` should be specific (e.g., "size_exchange", "late_delivery", "expired_promo")

---

## Distribution Targets (across all 200)

| Dimension | Target |
|-----------|--------|
| resolved_by_bot | 110 |
| escalated_and_resolved | 50 |
| escalated_and_unresolved | 10 |
| abandoned | 20 |
| unresolved | 10 |
| simple | ~60 |
| moderate | ~100 |
| complex | 40 |
| standard tier | ~155 |
| premium tier | ~30 |
| VIP tier | ~15 |

These are enforced by pre-computing scenario cards before agent dispatch — agents just follow their cards.

---

## Example Conversation

Below is a complete example of what a single generated conversation looks like. This example is for a **resolved_by_bot** case with a **return_request** issue.

```json
{
  "conversation_id": "CONV-0001",
  "domain": "e-commerce",
  "company": "ShopWave",
  "issue_category": "return_request",
  "issue_subcategory": "wrong_size",
  "was_escalated": false,
  "escalation_trigger": null,
  "escalation_turn": null,
  "outcome": "resolved_by_bot",
  "resolution_detail": "Customer returned wrong-sized running shoes within the 30-day window. Return label issued and refund of $89.99 estimated in 5-7 business days.",
  "customer_sentiment_start": "neutral",
  "customer_sentiment_end": "satisfied",
  "satisfaction_score": 5,
  "complexity": "simple",
  "customer_tier": "standard",
  "turns": [
    {
      "turn_id": 1,
      "role": "customer",
      "message": "Hi, I need to return a pair of shoes I ordered. They're the wrong size.",
      "timestamp_offset_seconds": 0,
      "tool_calls": null,
      "internal_note": null
    },
    {
      "turn_id": 2,
      "role": "bot",
      "message": "Hi there! I'd be happy to help you with a return. Could you please provide me with your order number so I can look that up for you?",
      "timestamp_offset_seconds": 4,
      "tool_calls": [
        {
          "tool": "check_customer_tier",
          "input": {"customer_id": "CUST-88421"},
          "output": {"tier": "standard", "lifetime_value": 247.50}
        }
      ],
      "internal_note": "Customer is standard tier. Greeting and requesting order ID to proceed with return."
    },
    {
      "turn_id": 3,
      "role": "customer",
      "message": "Sure, it's ORD-77234",
      "timestamp_offset_seconds": 38,
      "tool_calls": null,
      "internal_note": null
    },
    {
      "turn_id": 4,
      "role": "bot",
      "message": "I found your order. You purchased the Nike Air Zoom Pegasus 40 in size 10 for $89.99, delivered on March 5th. Since it's within our 30-day return window, I can process this return for you right away. Can you confirm the reason is wrong size?",
      "timestamp_offset_seconds": 45,
      "tool_calls": [
        {
          "tool": "lookup_order",
          "input": {"order_id": "ORD-77234"},
          "output": {
            "status": "delivered",
            "items": [
              {"item_id": "ITEM-4421", "name": "Nike Air Zoom Pegasus 40 - Size 10", "price": 89.99}
            ],
            "tracking_number": "1Z999AA10123456784",
            "estimated_delivery": "2026-03-05",
            "order_total": 89.99
          }
        }
      ],
      "internal_note": "Order found. Delivered March 5, within 30-day return window. Item total $89.99 is under $200 threshold. Can process autonomously."
    },
    {
      "turn_id": 5,
      "role": "customer",
      "message": "Yep, I ordered a 10 but I actually need a 10.5. Can I return these?",
      "timestamp_offset_seconds": 72,
      "tool_calls": null,
      "internal_note": null
    },
    {
      "turn_id": 6,
      "role": "bot",
      "message": "Absolutely! I've initiated the return for you. Here's your prepaid return shipping label — just print it out and drop the package at any UPS location. Once we receive the shoes, your refund of $89.99 should be processed within 5-7 business days. Is there anything else I can help you with?",
      "timestamp_offset_seconds": 78,
      "tool_calls": [
        {
          "tool": "initiate_return",
          "input": {"order_id": "ORD-77234", "item_id": "ITEM-4421", "reason": "wrong_size"},
          "output": {
            "return_label_url": "https://returns.shopwave.com/label/RTN-55123",
            "refund_amount": 89.99,
            "refund_eta": "5-7 business days after receipt"
          }
        }
      ],
      "internal_note": "Return initiated successfully. Refund under $200 threshold, no escalation needed. Providing return label and setting expectations on refund timeline."
    },
    {
      "turn_id": 7,
      "role": "customer",
      "message": "That was super easy, thank you! No that's all I needed.",
      "timestamp_offset_seconds": 110,
      "tool_calls": null,
      "internal_note": null
    },
    {
      "turn_id": 8,
      "role": "bot",
      "message": "You're welcome! Good luck with the 10.5s. Have a great day!",
      "timestamp_offset_seconds": 115,
      "tool_calls": null,
      "internal_note": "Issue resolved. Customer satisfied."
    }
  ]
}
```

### Example: Escalated Conversation (high-value refund)

```json
{
  "conversation_id": "CONV-0042",
  "domain": "e-commerce",
  "company": "ShopWave",
  "issue_category": "return_request",
  "issue_subcategory": "defective_electronics",
  "was_escalated": true,
  "escalation_trigger": "high_value_refund",
  "escalation_turn": 8,
  "outcome": "escalated_and_resolved",
  "resolution_detail": "Customer wanted to return a defective laptop ($649.99). Bot identified the refund exceeded the $200 threshold and escalated. Human agent approved the return and expedited the refund.",
  "customer_sentiment_start": "frustrated",
  "customer_sentiment_end": "satisfied",
  "satisfaction_score": 4,
  "complexity": "moderate",
  "customer_tier": "premium",
  "turns": [
    {
      "turn_id": 1,
      "role": "customer",
      "message": "I received a laptop from you guys last week and the screen has dead pixels all over it. I need to return this.",
      "timestamp_offset_seconds": 0,
      "tool_calls": null,
      "internal_note": null
    },
    {
      "turn_id": 2,
      "role": "bot",
      "message": "I'm sorry to hear about the issue with your laptop screen! That's definitely not the experience we want you to have. Let me look into this for you. Could you share your order number?",
      "timestamp_offset_seconds": 5,
      "tool_calls": [
        {
          "tool": "check_customer_tier",
          "input": {"customer_id": "CUST-10294"},
          "output": {"tier": "premium", "lifetime_value": 1823.40}
        }
      ],
      "internal_note": "Customer is premium tier. Reporting a defective product — likely a return request. Need order details to assess."
    },
    {
      "turn_id": 3,
      "role": "customer",
      "message": "ORD-90122",
      "timestamp_offset_seconds": 22,
      "tool_calls": null,
      "internal_note": null
    },
    {
      "turn_id": 4,
      "role": "bot",
      "message": "I found your order — it's an Acer Aspire 5 Laptop, purchased for $649.99, delivered on March 12th. I can see it's within our return window. Let me check on processing this return for you.",
      "timestamp_offset_seconds": 29,
      "tool_calls": [
        {
          "tool": "lookup_order",
          "input": {"order_id": "ORD-90122"},
          "output": {
            "status": "delivered",
            "items": [
              {"item_id": "ITEM-7788", "name": "Acer Aspire 5 Laptop 15.6\" FHD", "price": 649.99}
            ],
            "tracking_number": "1Z999AA10987654321",
            "estimated_delivery": "2026-03-12",
            "order_total": 649.99
          }
        }
      ],
      "internal_note": "Order total is $649.99, which exceeds the $200 refund threshold. I cannot process this return autonomously — must escalate to human agent."
    },
    {
      "turn_id": 5,
      "role": "customer",
      "message": "Yeah, the screen looked fine when I first set it up but by the next day there were like 5-6 dead pixel clusters. Pretty frustrating for a brand new laptop.",
      "timestamp_offset_seconds": 68,
      "tool_calls": null,
      "internal_note": null
    },
    {
      "turn_id": 6,
      "role": "bot",
      "message": "I completely understand your frustration — dead pixels on a new laptop is unacceptable. Because this is a higher-value item, I want to make sure you get the best help with this. Let me connect you with a specialist who can get this resolved for you quickly.",
      "timestamp_offset_seconds": 74,
      "tool_calls": null,
      "internal_note": "Refund amount ($649.99) exceeds $200 threshold. Escalating to human agent per SOP for high-value refund approval."
    },
    {
      "turn_id": 7,
      "role": "customer",
      "message": "Ok sure, thanks",
      "timestamp_offset_seconds": 95,
      "tool_calls": null,
      "internal_note": null
    },
    {
      "turn_id": 8,
      "role": "system",
      "message": "Customer transferred to human agent. Context: Premium customer requesting return of defective Acer Aspire 5 Laptop ($649.99, ORD-90122). Dead pixel clusters appeared within 24 hours of delivery. Order within 30-day return window. Escalation reason: refund exceeds $200 threshold requiring human approval.",
      "timestamp_offset_seconds": 98,
      "tool_calls": null,
      "internal_note": null
    },
    {
      "turn_id": 9,
      "role": "human_agent",
      "message": "Hi there, this is Marcus from ShopWave support. I've reviewed the details from our assistant — I'm really sorry about the dead pixels on your new laptop. That's definitely a defect we'll take care of. I'm going to approve the full return and refund right now.",
      "timestamp_offset_seconds": 142,
      "tool_calls": null,
      "internal_note": "Reviewed bot context. Defective item within return window, premium customer. Approving full refund of $649.99."
    },
    {
      "turn_id": 10,
      "role": "customer",
      "message": "Great, thank you. How long will the refund take?",
      "timestamp_offset_seconds": 170,
      "tool_calls": null,
      "internal_note": null
    },
    {
      "turn_id": 11,
      "role": "human_agent",
      "message": "I've processed your return and I'm sending you a prepaid shipping label to your email right now. Once we receive the laptop, I'll personally expedite your refund — as a premium member, we'll aim to get it back to you within 3 business days instead of the usual 5-7. You'll get a confirmation email once the refund is issued.",
      "timestamp_offset_seconds": 185,
      "tool_calls": [
        {
          "tool": "initiate_return",
          "input": {"order_id": "ORD-90122", "item_id": "ITEM-7788", "reason": "defective_dead_pixels"},
          "output": {
            "return_label_url": "https://returns.shopwave.com/label/RTN-88901",
            "refund_amount": 649.99,
            "refund_eta": "3 business days after receipt (expedited)"
          }
        }
      ],
      "internal_note": "Return initiated with expedited refund for premium customer. Sent label via email."
    },
    {
      "turn_id": 12,
      "role": "customer",
      "message": "Awesome, I appreciate the quick turnaround on this. Thanks Marcus!",
      "timestamp_offset_seconds": 215,
      "tool_calls": null,
      "internal_note": null
    },
    {
      "turn_id": 13,
      "role": "human_agent",
      "message": "Happy to help! If you have any other questions or run into any issues with the return, don't hesitate to reach out. Have a great rest of your day!",
      "timestamp_offset_seconds": 225,
      "tool_calls": null,
      "internal_note": "Issue resolved. Customer sentiment improved from frustrated to satisfied."
    }
  ]
}
```

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Agent produces invalid JSON | Prompt includes exact schema; we validate after and re-generate failures |
| Conversations feel repetitive across agents | Each agent gets different scenario cards; prompt explicitly says "avoid repetition, use unique names/products" |
| Agent runs out of context generating 20 convos | 20 conversations at ~500 tokens each = ~10K tokens output; well within limits |
| Distribution targets drift | Scenario cards are pre-computed — agents can't change outcome/trigger/category |
| Some agents fail | We check batch files after all complete and re-run missing batches |
