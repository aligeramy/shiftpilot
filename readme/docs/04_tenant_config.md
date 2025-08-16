# 04_tenant_config.md
**Tenant configuration for “Main Radiology Group” (initial)**  
Prepared: August 13, 2025 · Owner: Ali

This file captures the **live JSON config** the engine/UI will consume for the client’s group. It reflects the June 2025 schedule and the *Shift hours* workbook you shared, plus your domain rules from our transcript. Items marked `TODO` need client confirmation before year‑long generation.

---

## JSON (authoritative)
```json
{
  "org": {
    "name": "Main Radiology Group",
    "timezone": "America/Toronto",
    "weekStart": "MONDAY",
    "holidays": [
      {
        "date": "2025-01-01",
        "code": "NEW_YEAR",
        "name": "New Year's Day"
      },
      {
        "date": "2025-02-17",
        "code": "FAMILY_DAY",
        "name": "Family Day"
      },
      {
        "date": "2025-04-18",
        "code": "GOOD_FRIDAY",
        "name": "Good Friday"
      },
      {
        "date": "2025-05-19",
        "code": "VICTORIA_DAY",
        "name": "Victoria Day"
      },
      {
        "date": "2025-07-01",
        "code": "CANADA_DAY",
        "name": "Canada Day"
      },
      {
        "date": "2025-09-01",
        "code": "LABOUR_DAY",
        "name": "Labour Day"
      },
      {
        "date": "2025-10-13",
        "code": "THANKSGIVING",
        "name": "Thanksgiving Day"
      },
      {
        "date": "2025-12-25",
        "code": "CHRISTMAS",
        "name": "Christmas Day"
      },
      {
        "date": "2025-12-26",
        "code": "BOXING_DAY",
        "name": "Boxing Day"
      }
    ]
  },
  "subspecialties": [
    {
      "code": "NEURO",
      "label": "Neuroradiology"
    },
    {
      "code": "IR",
      "label": "Interventional Radiology"
    },
    {
      "code": "BODY",
      "label": "Body Imaging"
    },
    {
      "code": "MSK",
      "label": "Musculoskeletal"
    },
    {
      "code": "CHEST",
      "label": "Chest/Cardiac"
    },
    {
      "code": "INR",
      "label": "Interventional Neuroradiology"
    },
    {
      "code": "ANY",
      "label": "Any (Generalist eligible)"
    }
  ],
  "vacationPolicy": {
    "weeksPerMonth": 1,
    "rankedOptions": 3,
    "maxConsecutiveWeeksPerYear": 2,
    "tieBreak": {
      "method": "seeded_random",
      "respectFairnessLedger": true
    }
  },
  "ftePolicy": {
    "bands": [
      {
        "min": 60,
        "max": 69,
        "ptDaysPerMonth": 8
      },
      {
        "min": 70,
        "max": 79,
        "ptDaysPerMonth": 6
      },
      {
        "min": 80,
        "max": 89,
        "ptDaysPerMonth": 4
      },
      {
        "min": 90,
        "max": 99,
        "ptDaysPerMonth": 2
      },
      {
        "min": 100,
        "max": 100,
        "ptDaysPerMonth": 0
      }
    ],
    "weekdayBalanceCap": 1
  },
  "shiftTypes": [
    {
      "code": "N1",
      "label": "Neuro 1 (CT STAT, on site)",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "NEURO"
      }
    },
    {
      "code": "N2",
      "label": "Neuro 2 (MRI STAT, on site)",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "NEURO"
      }
    },
    {
      "code": "N3",
      "label": "Neuro 3 (CT volume support)",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "NEURO"
      }
    },
    {
      "code": "N4",
      "label": "Neuro 4 (MR volume support)",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "NEURO"
      }
    },
    {
      "code": "VASC",
      "label": "Vascular (on site)",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "IR"
      }
    },
    {
      "code": "XR_GEN",
      "label": "General (XR+GI to 1600, on site)",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "allowAny": true
      }
    },
    {
      "code": "CTUS",
      "label": "CT/US (ER+IP to 1600, on site)",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "BODY"
      }
    },
    {
      "code": "MSK",
      "label": "MSK (on site)",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "MSK"
      }
    },
    {
      "code": "BODY_VOL",
      "label": "Body volume support",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "BODY"
      }
    },
    {
      "code": "BODY_MRI",
      "label": "Body MRI",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "BODY"
      }
    },
    {
      "code": "CLIN_STONEY",
      "label": "Stoney Creek",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "allowAny": true
      }
    },
    {
      "code": "CLIN_MA1",
      "label": "MA1 (spec MSK, GI Tue/Thu/Fri)",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "named": []
      }
    },
    {
      "code": "CLIN_SPEERS",
      "label": "Speers",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "allowAny": true
      }
    },
    {
      "code": "CLIN_WALKERS",
      "label": "Walker\u2019s Line",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "allowAny": true
      }
    },
    {
      "code": "CLIN_WH_OTHER",
      "label": "WH Other",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "allowAny": true
      }
    },
    {
      "code": "CLIN_BRANT",
      "label": "Brant",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "allowAny": true
      }
    },
    {
      "code": "CARDIAC_CT",
      "label": "Cardiac CT",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "CHEST"
      }
    },
    {
      "code": "COIL",
      "label": "Coiling",
      "start": "08:00",
      "end": "16:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "named": []
      }
    },
    {
      "code": "BODY_16_18",
      "label": "Body 1600\u20131800",
      "start": "16:00",
      "end": "18:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "BODY"
      }
    },
    {
      "code": "BODY_18_21",
      "label": "Body 1800\u20132100",
      "start": "18:00",
      "end": "21:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "BODY"
      }
    },
    {
      "code": "NEURO_16_18",
      "label": "Neuro 1600\u20131800",
      "start": "16:00",
      "end": "18:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "NEURO"
      }
    },
    {
      "code": "NEURO_18_21",
      "label": "Neuro 1800\u20132100",
      "start": "18:00",
      "end": "21:00",
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true
      },
      "eligibility": {
        "requiredSubspecialty": "NEURO"
      }
    },
    {
      "code": "WEEKEND_READER",
      "label": "W/E Reader (weekend)",
      "allDay": true,
      "recur": {
        "sat": true,
        "sun": true
      },
      "eligibility": {
        "requiredSubspecialty": "BODY"
      }
    },
    {
      "code": "NEURO_CALL",
      "label": "Neuro on call",
      "allDay": true,
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true,
        "sat": true,
        "sun": true
      },
      "eligibility": {
        "requiredSubspecialty": "NEURO"
      }
    },
    {
      "code": "BODY_CALL",
      "label": "Body (diagnostic) on call",
      "allDay": true,
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true,
        "sat": true,
        "sun": true
      },
      "eligibility": {
        "requiredSubspecialty": "BODY"
      }
    },
    {
      "code": "IR_CALL",
      "label": "Intervention on call",
      "allDay": true,
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true,
        "sat": true,
        "sun": true
      },
      "eligibility": {
        "requiredSubspecialty": "IR"
      }
    },
    {
      "code": "INR_CALL",
      "label": "INR call",
      "allDay": true,
      "recur": {
        "mon": true,
        "tue": true,
        "wed": true,
        "thu": true,
        "fri": true,
        "sat": true,
        "sun": true
      },
      "eligibility": {
        "requiredSubspecialty": "INR"
      }
    }
  ],
  "equivalenceSets": [
    {
      "code": "NEURO_DAY_EQ",
      "members": [
        "N1",
        "N2",
        "N3",
        "N4"
      ]
    },
    {
      "code": "BODY_DAY_EQ",
      "members": [
        "XR_GEN",
        "CTUS",
        "MSK",
        "BODY_VOL",
        "BODY_MRI"
      ]
    },
    {
      "code": "CLINIC_EQ",
      "members": [
        "CLIN_STONEY",
        "CLIN_MA1",
        "CLIN_SPEERS",
        "CLIN_WALKERS",
        "CLIN_WH_OTHER",
        "CLIN_BRANT"
      ]
    },
    {
      "code": "NEURO_LATE_EQ",
      "members": [
        "NEURO_16_18",
        "NEURO_18_21"
      ]
    },
    {
      "code": "BODY_LATE_EQ",
      "members": [
        "BODY_16_18",
        "BODY_18_21"
      ]
    }
  ],
  "giveawayEligible": [
    "WEEKEND_READER",
    "NEURO_CALL",
    "BODY_CALL",
    "IR_CALL",
    "INR_CALL"
  ],
  "dollarValues": {
    "default": 0,
    "byShiftType": {
      "WEEKEND_READER": 500,
      "NEURO_CALL": 500,
      "BODY_CALL": 500,
      "IR_CALL": 500,
      "INR_CALL": 500
    },
    "notes": "Provisional amounts; confirm with Chief/Bookkeeper"
  },
  "notifications": {
    "emailProvider": "resend",
    "offerCadence": {
      "swap": {
        "waitMinutes": 120
      },
      "giveaway": {
        "waitMinutes": 60
      }
    },
    "dailyDigest": {
      "enabled": true,
      "sendHourLocal": 18
    }
  }
}
```

---

## Notes & TODOs
- **MA1 named eligibility:** currently empty `named: []`. Please provide the **exact list of radiologists** (emails or IDs) who can cover MA1.  
- **Coiling:** set as `named: []` because only one INR‑qualified physician covers this. Provide the person’s ID.  
- **Cardiac CT:** restricted to `CHEST`. If the roster labels are “Chest/Body”, either (a) tag those users as `CHEST` in roster, or (b) switch `CARDIAC_CT` eligibility to a `named` list.  
- **Dollar values:** all on‑call/weekend set to 500 as placeholders — confirm per shift type and whether **holiday premiums** apply.  
- **On‑call times:** modeled as `allDay: true` for safety (ICS-friendly). If you prefer explicit night windows (e.g., 17:00–08:00), we’ll change the schema to support cross‑midnight spans.  
- **FTE→PT mapping:** uses our default bands (60–100%). Adjust if your group counts PT days differently.  
- **Holidays:** Ontario statutory holidays for 2025 are baked in below; adjust if your practice observes additional civic/federal days.

---

## Ontario statutory holidays (2025)
These nine are recognized under Ontario’s ESA. Dates below are for 2025.

- New Year’s Day — 2025‑01‑01  
- Family Day — 2025‑02‑17  
- Good Friday — 2025‑04‑18  
- Victoria Day — 2025‑05‑19  
- Canada Day — 2025‑07‑01  
- Labour Day — 2025‑09‑01  
- Thanksgiving Day — 2025‑10‑13  
- Christmas Day — 2025‑12‑25  
- Boxing Day — 2025‑12‑26

> Sources: Government of Ontario (official list of public holidays) and Ontario 2025 date tables. See project knowledge base for links.

---

## How to use this file
1. Paste this JSON into the **Tenant Config** screen and save.  
2. Import/update roster so subspecialties match (`NEURO`, `IR`, `BODY`, `MSK`, `CHEST`, `INR`).  
3. Populate the `named` lists for **MA1** and **Coiling**.  
4. Confirm dollar values & any premiums, then run a 2‑month draft.  
5. Iterate until warnings = 0 and fairness metrics are inside thresholds; then publish.

