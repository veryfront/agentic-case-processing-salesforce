---
title: Case Triage Taxonomy
description: Authoritative taxonomy for classifying and routing Salesforce cases.
---

# Case Triage Knowledge — Taxonomy v1

**Owner:** Customer Operations
**Applies to:** Salesforce `Case` records with `Status = New`
**Last reviewed:** 2026-08-12

This document is the single source of truth for how incoming cases are classified and
routed. The triage agent reads it on every run. If a rule here conflicts with something
learned from past cases, this document wins.

---

## 1. What the agent does

For each new case:

1. Read `Subject`, `Description`, `Account`, `Asset`/`Product`, and any inbound email body.
2. Pick exactly **one** category and **one** subcategory from §4.
3. Set the `Reason` picklist on the case to the matching **API Name** from §2.
4. Pick exactly **one** case type from §2b based on the equipment domain signals in the case.
5. Set the `Type` picklist on the case to the matching **API Name** from §2b.
6. Apply the overrides in §5 — these can change the routing regardless of category.
7. Score confidence per §6.
8. Post the triage comment on the case in the format defined in §7 and, if confidence is
   above threshold, set the fields on the case.

The agent never closes, merges, or replies to a customer case. Triage only.

---

## 2. Salesforce Case Reason picklist — canonical values

Every category in §4 maps to exactly one `Reason` picklist API name. The agent must use
the API Name verbatim when writing to Salesforce. No other values are valid.

| API Name              | Display Label          |
| --------------------- | ---------------------- |
| Installation          | Installation           |
| Equipment Complexity  | Equipment Complexity   |
| Performance           | Performance            |
| Breakdown             | Breakdown              |
| Equipment Design      | Equipment Design       |
| Feedback              | Feedback               |
| Other                 | Other                  |

---

## 2b. Salesforce Case Type picklist — canonical values

Each case must also be assigned exactly one `Type` picklist value. The agent must use the
API Name verbatim when writing to Salesforce. No other values are valid.

| API Name    | Display Label | When to use |
| ----------- | ------------- | ----------- |
| Mechanical  | Mechanical    | The case relates to mechanical components: rotating parts, shafts, bearings, housings, mounts, vibration, alignment, structural frames, or physical assembly. |
| Electrical  | Electrical    | The case relates to electrical systems: wiring, termination, power distribution, switchgear, circuit breakers, transformers, grounding, or high-voltage components. |
| Electronic  | Electronic    | The case relates to electronic systems: control boards, PLCs, firmware, sensors, actuators, HMI displays, communication modules, or software/digital interfaces. |
| Structural  | Structural    | The case relates to structural elements: foundations, enclosures, frames, canopies, civil works, mounting platforms, or physical containment. |
| Other       | Other         | The case does not clearly relate to any of the above domains, or the description is too vague to determine an equipment type. Also use for purely commercial, feedback, or administrative cases. |

### Type selection rules

- **One type only.** If a case spans multiple equipment domains, choose the one most central
  to the customer's stated problem. For example, a vibration issue in a generator bearing
  is Mechanical, even if wiring was mentioned in passing.
- **Feedback and commercial cases** default to `Other` unless the feedback specifically
  describes a mechanical, electrical, electronic, or structural concern.
- **Installation cases** should be typed by the installation domain: wiring installation →
  Electrical, mechanical mounting → Mechanical, controls integration → Electronic, site
  preparation → Structural.
- **When uncertain**, choose `Other`. An honest `Other` is better than a wrong type.

---

## 3. Signals, in order of precedence

When signals disagree, weight them in this order:

| Rank | Signal | Notes |
| --- | --- | --- |
| 1 | Explicit safety/outage language | Triggers §5 overrides before anything else |
| 2 | Case Description body | The customer's own words, fullest context |
| 3 | Linked Asset / product model | e.g. `GC5060` implies Generator product line |
| 4 | Subject line | Often written by an agent, not the customer — can be misleading |
| 5 | Account service tier | Only used for priority, never for category |

Subject lines are a weak signal on their own. "Design issue with X" is frequently used by
support agents as shorthand for "customer is unhappy with X" — read the body before
routing anything to Engineering.

---

## 4. Taxonomy

Each top-level category maps to one Salesforce `Reason` picklist value (shown in
parentheses after the heading). Use that value when setting the field.

### 4.1 Installation (`Reason: Installation`)

Pre-handover work, or a customer/contractor asking how to install something correctly.

| Subcategory | Route to | Target first response |
| --- | --- | --- |
| Electrical wiring & termination | Applications Engineering | 1 business day |
| Mechanical mounting & alignment | Applications Engineering | 1 business day |
| Controls & network integration | Controls Support | 1 business day |
| Site preparation & civils | Applications Engineering | 2 business days |
| Commissioning sign-off | Field Service Scheduling | 1 business day |

**Signals:** "seeking guidance", "how do I", "which terminal", "before we energise",
"our electrician", named model number with no fault described.

**Note:** A question about how to do something is *not* a defect. If nothing is broken and
the customer is asking for direction, it belongs here — not in §4.3 or §4.5. Wiring
questions must never be answered from memory or from a generic template; route them so a
qualified engineer answers against the drawing pack for that specific serial number.

**Type mapping:** Electrical wiring → `Type: Electrical`. Mechanical mounting → `Type: Mechanical`. Controls & network → `Type: Electronic`. Site preparation → `Type: Structural`. Commissioning → determine from dominant domain, default `Type: Other`.

---

### 4.2 Equipment Complexity (`Reason: Equipment Complexity`)

Cases where the customer struggles with the complexity of the equipment — configuration,
integration of subsystems, multi-unit setups, or advanced features that are working as
designed but hard to use or understand.

| Subcategory | Route to | Target first response |
| --- | --- | --- |
| Multi-unit configuration | Applications Engineering | 1 business day |
| Advanced controls & programming | Controls Support | 1 business day |
| System integration difficulty | Applications Engineering | 1 business day |
| Feature usage / capability question | Customer Enablement | 2 business days |

**Signals:** "too complex", "can't figure out", "configuration", "how do these work
together", "integration between", "multi-unit", "advanced settings", references to
multiple subsystems or interacting components.

**Note:** Distinguish from Installation (§4.1) — if the equipment is already installed and
running but the customer cannot configure or integrate it effectively, use this category.
Distinguish from Breakdown (§4.4) — if the equipment is functioning but confusing, it is
complexity, not a fault.

**Type mapping:** Controls & programming → `Type: Electronic`. Multi-unit / system integration → determine from dominant equipment domain. Feature usage → `Type: Other` unless a specific domain is evident.

---

### 4.3 Performance (`Reason: Performance`)

Equipment that runs but does not meet expected output, efficiency, or uptime.

| Subcategory | Route to | Target first response |
| --- | --- | --- |
| Degraded output | Field Engineering | 4 business hours |
| Unexpected shutdown / trip | Field Engineering | 1 business hour |
| Vibration or noise | Field Engineering | 4 business hours |
| Fuel or efficiency deviation | Performance Analytics | 1 business day |
| Intermittent fault, no pattern | Field Engineering | 1 business day |

**Signals:** "not reaching", "below spec", "second week", "derated", "keeps tripping",
any customer-supplied trend data or load figures.

**Note:** Repeat or multi-period wording ("second consecutive week", "again this month")
raises priority one level and sets `recurring: true`. Recurring performance cases must be
checked against open cases on the same Asset before routing — if one exists, flag as a
possible duplicate rather than opening a parallel investigation.

**Type mapping:** Vibration or noise → `Type: Mechanical`. Unexpected shutdown → determine from fault description (electrical trip → `Type: Electrical`, control fault → `Type: Electronic`, mechanical seizure → `Type: Mechanical`). Fuel/efficiency → `Type: Mechanical` unless electronic controls are implicated. If ambiguous, default to `Type: Mechanical`.

---

### 4.4 Breakdown (`Reason: Breakdown`)

Equipment that has stopped working entirely, or a component has catastrophically failed.
This is distinct from Performance (§4.3) where the equipment still runs but under-performs.

| Subcategory | Route to | Target first response |
| --- | --- | --- |
| Complete equipment failure | Field Engineering | 1 business hour |
| Component failure (mechanical) | Field Engineering | 4 business hours |
| Component failure (electrical) | Field Engineering | 4 business hours |
| Warranty claim — failed part | Warranty Admin | 1 business day |
| Parts availability / lead time | Spares Desk | 1 business day |
| Return / RMA | Warranty Admin | 1 business day |

**Signals:** "stopped", "won't start", "dead", "failed", "broken", "not working at all",
"offline since", "catastrophic", "seized", references to smoke, sparks, or visible damage.

**Note:** If the customer mentions a single part failure on one unit and the equipment is
otherwise operational, this is still Breakdown (not Equipment Design). Only route to
Equipment Design (§4.5) when the customer or an internal engineer asserts a systemic
fault across multiple units or serial numbers.

**Type mapping:** Component failure (mechanical) → `Type: Mechanical`. Component failure (electrical) → `Type: Electrical`. Complete equipment failure → determine from description (motor/engine/bearing → Mechanical, wiring/power → Electrical, control board → Electronic). Warranty/Parts/RMA → determine from the failed component domain. Default to `Type: Mechanical` when the failure domain is unclear.

---

### 4.5 Equipment Design (`Reason: Equipment Design`)

A suspected fault in the design itself, not in one unit's build or installation.

| Subcategory | Route to | Target first response |
| --- | --- | --- |
| Rotating assembly (rotor, bearings, shaft) | Product Engineering | 4 business hours |
| Structural / housing | Product Engineering | 1 business day |
| Electrical design | Product Engineering | 1 business day |
| Software / firmware | Controls Support | 1 business day |
| Suspected fleet-wide issue | Product Engineering + Quality | 1 business hour |

**Signals:** "design", "by design", "same on all our units", "third unit with the same",
engineering drawings or FEA attached, references to a change notice.

**Note:** Genuine design escalations are rare and expensive. Route here only when the
customer or an internal engineer is asserting a systemic fault, or when the same failure
mode appears on two or more serial numbers. A single failed component is a Breakdown case
(§4.4), not a design case. When in doubt, choose §4.4 and let Quality escalate.

**Type mapping:** Rotating assembly → `Type: Mechanical`. Structural / housing → `Type: Structural`. Electrical design → `Type: Electrical`. Software / firmware → `Type: Electronic`. Fleet-wide → determine from the affected domain.

---

### 4.6 Feedback (`Reason: Feedback`)

Customer opinions, suggestions, compliments, complaints, or survey responses that are not
tied to a specific technical fault or commercial transaction.

| Subcategory | Route to | Target first response |
| --- | --- | --- |
| Product feedback / suggestion | Product Management | 3 business days |
| Service experience feedback | Customer Success | 2 business days |
| Complaint (non-technical) | Customer Success | 1 business day |
| Compliment / positive feedback | Customer Success | 3 business days |
| Documentation feedback | Technical Publications | 2 business days |
| Training feedback / request | Customer Enablement | 3 business days |

**Signals:** "suggestion", "wish it could", "would be nice", "impressed with", "unhappy
with the service", "NPS", "survey", "your team was", "the manual says", "documentation
unclear", "training".

**Note:** If the feedback describes a documentation gap that could lead to incorrect
maintenance on a live machine, add `safety-adjacent: true` and copy Field Engineering.
Ambiguity in a torque figure, an isolation step, or a service interval is not a
publications-only problem.

**Type mapping:** Default to `Type: Other` unless the feedback specifically describes a concern in a mechanical, electrical, electronic, or structural domain (e.g. "the wiring diagram in the manual is wrong" → `Type: Electrical`).

---

### 4.7 Other (`Reason: Other`)

Use when no category above fits, or the case body is empty, truncated, or unreadable.
Also covers commercial/billing matters and anything that falls outside the technical
taxonomy.

| Subcategory | Route to | Target first response |
| --- | --- | --- |
| Billing & invoicing | Billing Support | 1 business day |
| Refund request | Billing Support | 1 business day |
| Contract & service plan | Account Management | 2 business days |
| Quote request | Sales Operations | 1 business day |
| Uncategorised / unreadable | Triage Desk | 1 business day |

**Signals (commercial):** "invoice", "charge", "refund", "contract", "renewal", "quote",
"pricing".

**Note:** An honest `Other / Uncategorised` is better than a confident wrong route. If the
case spans two categories and the agent cannot determine a primary intent, route here for
manual handling.

**Type mapping:** Default to `Type: Other`.

---

## 5. Overrides

These are checked before category routing and applied on top of it.

- **Injury, fire, electric shock, gas release, or environmental discharge** — set priority
  to Critical, route to Field Engineering, and page the on-call HSE duty manager. Post to
  `#safety-escalation` as well as `#case-triage`. Never auto-route these silently.
- **Complete site outage or generator offline** — priority Critical, Field Engineering,
  first response 1 hour regardless of category.
- **Regulatory body, insurer, or legal counsel named as a party** — route to Legal &
  Compliance and stop. Do not set a category.
- **Press or media enquiry** — route to Communications. Do not set a category.
- **Account service tier = Platinum** — raise priority one level. Does not change routing.

---

## 6. Confidence

Report a value between 0 and 1.

| Range | Meaning | Behaviour |
| --- | --- | --- |
| ≥ 0.80 | Clear match on body + subject, one plausible subcategory | Auto-apply fields, post comment |
| 0.60–0.79 | Plausible match, some ambiguity or thin description | Post comment as a suggestion, leave fields unset |
| < 0.60 | Weak or conflicting signals | Route to `Other` / Triage Desk |

Lower confidence when:

- the description is under ~15 words or is only a subject line;
- the case spans two categories (a wiring question *and* a billing dispute);
- the customer's wording implies a diagnosis the evidence doesn't support;
- the product model can't be resolved to a known line.

Do not inflate confidence to clear the auto-apply threshold. A suggestion a human confirms
in ten seconds costs far less than a misrouted case that sits in the wrong queue for a week.

---

## 7. Output format

Post one comment on the case. Body first, then a metadata block.

```
[Triage] {Category} → {Subcategory}

{One-or-two-sentence summary in the agent's own words.}
Suggested team: {Team}

---
category:    {Category}
subcategory: {Subcategory}
reason:      {Salesforce Reason API Name from §2}
type:        {Salesforce Type API Name from §2b}
confidence:  {0.00–1.00}
team:        {Team}
taxonomy:    v1
agent:       case-triage/{ISO-8601 UTC timestamp}
```

Rules:

- Summary is one or two sentences, in the agent's own words. Do not paste the customer's
  description back verbatim.
- Values in the metadata block must be copied exactly from §4 — no invented team names.
- `reason` must be one of the seven API Names from §2 — no other values are valid.
- `type` must be one of the five API Names from §2b — no other values are valid.
- `agent` is the run identifier plus an ISO-8601 UTC timestamp.
- If an override from §5 fired, add an `override:` line naming it.
- If confidence is below 0.80, prefix the summary line with `(unconfirmed)`.

---

## 8. Worked examples

**"Performance inadequate for second consecutive week"**
→ Performance / Degraded output, Field Engineering, `Reason: Performance`, `Type: Mechanical`, `recurring: true`.
The repeat wording raises priority. Check for an existing open case on the same Asset
before posting. Confidence would sit around 0.85 with load figures in the body, nearer
0.65 with a bare subject line and no description.

**"Seeking guidance on electrical wiring installation for GC5060"**
→ Installation / Electrical wiring & termination, Applications Engineering, `Reason: Installation`, `Type: Electrical`.
Nothing is faulty; this is a pre-energisation question. The model number resolves cleanly
to the generator line, which supports high confidence.

**"Design issue with mechanical rotor"**
→ Read the body before accepting the subject at face value. If the customer is asserting a
systemic fault or naming multiple serial numbers, it is Equipment Design / Rotating
assembly, Product Engineering, `Reason: Equipment Design`, `Type: Mechanical`. If it is one bearing that failed
on one machine, it is Breakdown / Component failure (mechanical), `Reason: Breakdown`, `Type: Mechanical`.
This case should typically land at 0.55–0.70 confidence and go out as a suggestion, not
an auto-route.

**"Generator won't start, completely dead since yesterday"**
→ Breakdown / Complete equipment failure, Field Engineering, `Reason: Breakdown`, `Type: Mechanical`.
Clear breakdown language with no ambiguity. Confidence 0.90+.

**"Can't figure out how to configure multi-unit synchronisation"**
→ Equipment Complexity / Multi-unit configuration, Applications Engineering,
`Reason: Equipment Complexity`, `Type: Electronic`. The equipment is installed and operational but the customer
is struggling with advanced configuration. Not Installation, not Breakdown.

**"Your service engineer was excellent last week"**
→ Feedback / Compliment / positive feedback, Customer Success, `Reason: Feedback`, `Type: Other`.
No technical issue to resolve.

**"Maintenance guidelines for generator unclear"**
→ Feedback / Documentation feedback, Technical Publications, `Reason: Feedback`, `Type: Other`. If the
ambiguity touches isolation, lockout, or a torque-critical step, add `safety-adjacent: true`
and copy Field Engineering.

**"Control board error code E-4501, display is blank"**
→ Breakdown / Component failure (electrical), Field Engineering, `Reason: Breakdown`, `Type: Electronic`.
The fault is in the electronic control system. Confidence 0.85+.

**"Foundation cracking under generator pad"**
→ Equipment Design / Structural / housing, Product Engineering, `Reason: Equipment Design`, `Type: Structural`.
Structural concern with the mounting platform.
