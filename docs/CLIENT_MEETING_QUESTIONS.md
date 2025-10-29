# Client Meeting Questions - ShiftPilot Discovery Session

**Date:** January 10, 2025  
**Client:** Main Radiology Group  
**Contact:** Mike Colapinto (Lead Scheduler)  
**Purpose:** Requirements gathering and system refinement

---

## 📋 Meeting Objectives
1. Validate understanding of current vacation scheduling process
2. Identify pain points and bottlenecks in existing workflow
3. Clarify business rules and edge cases
4. Determine success metrics and priorities
5. Gather historical data for AI training
6. Define rollout strategy and training needs

---

## 1️⃣ Current Process & Pain Points

### 1.1 Current Workflow
- **Q:** Walk me through your current vacation scheduling process from start to finish. How long does it typically take?
- **Q:** What tools/systems are you currently using? (Excel, email, calendar software, etc.)
- **Q:** How far in advance do you collect vacation preferences? (e.g., November/December for next year?)
- **Q:** What's your biggest time sink in the current process?
- **Q:** How many hours per month do you spend on vacation scheduling vs. daily shift assignments?

### 1.2 Pain Points
- **Q:** What are the top 3 most frustrating parts of the current process?
- **Q:** Where do most conflicts arise? (overlapping requests, last-minute changes, coverage gaps?)
- **Q:** How do you currently handle vacation conflicts? Email threads, phone calls, meetings?
- **Q:** Have you ever had to completely redo a vacation schedule? What triggered that?
- **Q:** What keeps you up at night about scheduling?

### 1.3 Communication Challenges
- **Q:** How do radiologists currently submit vacation requests? (email, form, verbal?)
- **Q:** How many back-and-forth rounds typically happen before finalizing vacation schedules?
- **Q:** Do radiologists ever "game" the system? (e.g., coordinating requests, strategic timing?)
- **Q:** How do you communicate decisions? (individual emails, group email, meeting?)

---

## 2️⃣ Vacation Scheduling Rules (Validation & Clarification)

### 2.1 Subspecialty Coverage Caps
Based on your email, we have:
- **Body MRI:** Max 2 on vacation per week
- **Cardiac:** Max 2 on vacation per week  
- **IR:** Max 1 on vacation per week

**Questions:**
- **Q:** Are these hard limits or guidelines? Have you ever needed to violate them?
- **Q:** Are there other subspecialty coverage requirements we should know about?
- **Q:** Do these caps change seasonally? (e.g., summer vs. winter?)
- **Q:** What happens if multiple people in the same subspecialty request the same week?

### 2.2 Mammography Coverage
You mentioned:
- Minimum 1 mammo Bx rad (absolute)
- Ideally 2+ mammo Bx rads
- Aim for 5 total mammo-qualified rads available
- Special: NS case (if only mammo rad, need DL or DW on Tuesdays)

**Questions:**
- **Q:** Has there ever been a week where you couldn't meet the minimum 1 mammo rad requirement?
- **Q:** The NS special case (DL/DW on Tuesdays for cardiac) - how often does this constraint bind?
- **Q:** Are there specific days of the week where mammo coverage is more critical? (e.g., biopsy clinic days?)
- **Q:** You mentioned Kathy Zhao does biopsies 2x/month ad-hoc. Should the system flag weeks she's scheduled to remind you?
- **Q:** Are there other radiologists who might become mammo-qualified soon?

### 2.3 Part-Time (PT) Status
**Q:** You mentioned being "cognizant of PT status" for neuro/body coverage. Can you give me an example of when this became an issue?  
**Q:** Do PT radiologists get vacation priority since they work fewer days?  
**Q:** Should the system calculate "effective FTE" when checking coverage? (e.g., 2 PT rads = 1.2 FTE instead of 2.0?)  
**Q:** Do PT percentages change throughout the year? How often?

### 2.4 Consecutive Vacation Limits
**Q:** What's the maximum consecutive weeks someone can request?  
**Q:** You mentioned "limit on long consecutive runs" - is there a hard cap? (e.g., no more than 2 consecutive weeks?)  
**Q:** If someone requests 2 weeks in a row, does that count as their P1 and P2 choices?  
**Q:** Do you allow split weeks? (e.g., Wed-Sun vacation?)

### 2.5 Total Vacation Capacity
**Q:** What's the maximum percentage of radiologists that can be on vacation in any given week?  
**Q:** We calculated 30% (8 out of 27 rads) - does that sound right?  
**Q:** Does this vary by time of year? (e.g., higher capacity in summer?)  
**Q:** Have you ever had a week where "too many" people were off, even if subspecialty rules were met?

---

## 3️⃣ Preference Collection & Fairness

### 3.1 Preference Submission
**Q:** Do radiologists typically submit all 3 choices (P1, P2, P3) for every month?  
**Q:** What percentage of people submit requests late or not at all?  
**Q:** How do you handle late submissions? Are they penalized?  
**Q:** You mentioned Saba ranked chronologically instead of by priority. How common is this misunderstanding?

### 3.2 Flexibility & Intent
**Q:** When someone marks a request as "flexible," what does that mean to you?  
**Q:** How often do you have to infer what someone "really wanted" vs. what they submitted?  
**Q:** Are there radiologists who consistently submit ambiguous requests?  
**Q:** Would it help to have a free-text "notes" field for requests? (e.g., "Need this for family wedding")

### 3.3 Fairness Tracking
**Q:** How do you currently track fairness across the year?  
**Q:** Do you keep a mental tally of who got P1 choices vs. who didn't?  
**Q:** Have radiologists ever complained about fairness? What was the issue?  
**Q:** If someone doesn't get their P1 choice, do they get "first dibs" next month?  
**Q:** How do you balance fairness vs. clinical coverage needs?

### 3.4 Special Cases
**Q:** Are there radiologists who get vacation priority? (e.g., parents with school-age kids during summer, senior staff?)  
**Q:** Do fellows/residents have different vacation rules than full radiologists?  
**Q:** Are there "blackout periods" where certain people can't take vacation? (e.g., academic year, major conferences?)

---

## 4️⃣ Shift Assignment (Beyond Vacation)

### 4.1 Daily Schedule Generation
**Q:** Once vacation is locked in, how long does it take to generate the daily shift assignments?  
**Q:** What rules apply to daily assignments that we haven't discussed?  
**Q:** Are there "desirable" and "undesirable" shifts? How should we weight them?  
**Q:** Weekend call seems to be the most undesirable - are there others?

### 4.2 Named Shifts
You mentioned:
- **MA1:** 6 specific radiologists
- **Coiling:** Ramiro only

**Q:** Are there other named/restricted shifts we should know about?  
**Q:** For MA1, all 6 are equally qualified, or are some preferred?  
**Q:** What happens if Ramiro is on vacation during a coiling day (Tue/Wed)? Does the shift get cancelled or covered differently?  
**Q:** Are there radiologists training to become eligible for named shifts?

### 4.3 Shift Desirability
**Q:** Can you rank all 23 shift types from most desirable to least desirable?  
**Q:** Which shifts are considered "prime clinic slots" that people want?  
**Q:** Are late blocks (16-18, 18-21) equally undesirable, or is 18-21 worse?  
**Q:** Do radiologists have individual preferences? (e.g., some prefer evenings?)

---

## 5️⃣ Conflict Resolution & Decision Making

### 5.1 Current Decision Process
**Q:** When multiple people want the same vacation week, what's your decision-making process?  
**Q:** Do you ever split the difference? (e.g., give both people 3 days each?)  
**Q:** How often do you need to call someone and negotiate?  
**Q:** Have you ever had to make a decision that upset someone? How did you handle it?

### 5.2 Override & Exceptions
**Q:** What percentage of the schedule do you manually override after the initial plan?  
**Q:** What are the most common reasons for manual overrides?  
**Q:** Are there "sacred" shifts that can't be touched? (e.g., someone always works Mondays?)  
**Q:** How do you document exception decisions so you remember them next time?

### 5.3 AI Decision Preferences
**Q:** For "flexible" requests, would you like the AI to:
  - A) Auto-assign to the optimal week (you review after)
  - B) Present you with 2-3 options and let you choose
  - C) Flag for manual review every time

**Q:** When AI infers priority (like Saba's summer preference), what confidence level should trigger your review? (90%? 70%?)  
**Q:** If AI makes a decision you disagree with, would you want to:
  - A) Override it and teach the AI
  - B) Just override it
  - C) Revert and manually handle

---

## 6️⃣ Swaps & Changes

### 6.1 Swap Workflow
**Q:** How often do shift swaps happen after the schedule is published?  
**Q:** What's the current process for requesting a swap?  
**Q:** Do you approve every swap, or can radiologists swap directly?  
**Q:** Are there restrictions on what can be swapped? (e.g., can't swap a NEURO shift for an IR shift?)

### 6.2 Giveaways
**Q:** You mentioned weekend call is eligible for giveaways. How does this work currently?  
**Q:** Who gets first dibs on a giveaway? (first response? most junior? fairness score?)  
**Q:** Are there shifts that can ONLY be swapped, not given away?  
**Q:** How do you prevent "shopping around" where someone keeps asking until they find a taker?

### 6.3 Last-Minute Changes
**Q:** What happens when someone gets sick and can't work their shift?  
**Q:** Is there a "call pool" or do you manually contact people?  
**Q:** How far in advance must swap requests be submitted? (24 hours? 1 week?)

---

## 7️⃣ Reporting & Analytics

### 7.1 Current Reporting
**Q:** What reports do you currently generate for administration/finance?  
**Q:** Do you track shift counts per radiologist? How? (spreadsheet?)  
**Q:** Does finance need dollar values per shift for compensation?  
**Q:** What's your reporting cadence? (monthly? quarterly? yearly?)

### 7.2 Desired Metrics
**Q:** What metrics would be most valuable to you?
  - Total shifts per radiologist (monthly/YTD)
  - Weekend call count per person
  - Vacation preference satisfaction rate
  - Fairness score per person
  - Coverage gaps/unfilled shifts
  - Other?

**Q:** Do you need to present data to leadership? What do they care about?  
**Q:** Would it help to see "what-if" scenarios? (e.g., "What if 3 more NEURO rads were on vacation this week?")

### 7.3 Audit Trail
**Q:** How important is it to be able to explain why someone got or didn't get a vacation week?  
**Q:** Have you ever had to "justify" a scheduling decision to a radiologist or admin?  
**Q:** Would it help to have a complete history of all changes and overrides?

---

## 8️⃣ Integration & Technical

### 8.1 Current Systems
**Q:** What calendar system do radiologists use? (Google Calendar, Outlook, other?)  
**Q:** Do you need to integrate with any existing systems? (HR, payroll, EMR?)  
**Q:** How do radiologists currently view their schedules? (email, shared calendar, printout?)  
**Q:** Do you use any scheduling software currently that we should integrate with?

### 8.2 Data Export
**Q:** What format do you need for exports? (CSV, Excel, PDF, ICS?)  
**Q:** Do different stakeholders need different views? (radiologists see their own, you see everyone's, finance sees totals?)  
**Q:** How often do you need to export data?

### 8.3 Notifications
**Q:** How should the system notify radiologists?
  - Email?
  - SMS?
  - In-app only?
  - Push notifications?

**Q:** What events need notifications?
  - Schedule published
  - Swap request received
  - Vacation request approved/denied
  - Reminder to submit preferences
  - Other?

---

## 9️⃣ Historical Data & AI Training

### 9.1 Past Schedules
**Q:** Do you have past vacation schedules in digital format? How far back?  
**Q:** Can you share the last 12 months of vacation decisions with decisions rationale?  
**Q:** Are there examples of particularly difficult scheduling months we can learn from?  
**Q:** Do you have records of past conflicts and how you resolved them?

### 9.2 Decision Patterns
**Q:** Are there patterns you consciously follow? (e.g., "always give senior staff summer weeks first")  
**Q:** Are there unwritten rules that you apply but haven't documented?  
**Q:** Would you be willing to do a "think-aloud" session where we watch you schedule and you explain your reasoning?

### 9.3 Edge Cases
**Q:** What's the craziest/hardest scheduling situation you've ever faced?  
**Q:** Have you ever had a month where it was impossible to satisfy all constraints?  
**Q:** Are there "nightmare scenarios" we should specifically test for?

---

## 🔟 Rollout & Adoption

### 10.1 Implementation Timeline
**Q:** When would you want to start using ShiftPilot for real scheduling? (what month/year?)  
**Q:** Would you want to pilot with just vacation scheduling first, then add daily shifts?  
**Q:** Should we run in parallel with your current process for a few months?  
**Q:** What would make you feel confident to "flip the switch" and go all-in?

### 10.2 User Training
**Q:** How tech-savvy are the radiologists? Should we plan extensive training?  
**Q:** Would you prefer in-person training, video tutorials, or documentation?  
**Q:** Who would be the "power users" we should train first?  
**Q:** Do you have concerns about adoption/resistance?

### 10.3 Success Criteria
**Q:** How will we know if ShiftPilot is successful?  
**Q:** What would make you say "this is better than the old way"?  
**Q:** What's the minimum time savings you'd need to see to consider this worthwhile?  
**Q:** If we could only deliver 3 features perfectly, which 3 would you choose?

### 10.4 Support & Maintenance
**Q:** How often do scheduling rules change? (annually? quarterly?)  
**Q:** Do you anticipate adding/removing radiologists frequently?  
**Q:** What level of support do you need? (24/7? business hours? email only?)  
**Q:** Would you want a direct line to us for the first few months?

---

## 1️⃣1️⃣ Pricing & Business

### 11.1 Current Costs
**Q:** How much does your current scheduling process cost? (your time, admin time, software costs?)  
**Q:** Have you ever considered purchasing scheduling software before? Why or why not?  
**Q:** What's your budget for a solution like this?

### 11.2 Value Proposition
**Q:** What would you pay for a system that reduces scheduling time by 80%?  
**Q:** Is fairness/transparency worth paying for, or is time savings the main driver?  
**Q:** Would you pay more for AI features, or just want basic rule enforcement?

### 11.3 Decision Making
**Q:** Who needs to approve purchasing a system like this? (just you? department head? CFO?)  
**Q:** What's your decision timeline? When would you want to make a go/no-go decision?  
**Q:** What would cause you to not move forward with ShiftPilot?

---

## 1️⃣2️⃣ Open-Ended & Discovery

### 12.1 Vision
**Q:** If you had a magic wand, what would the perfect scheduling system look like?  
**Q:** What features would make you say "wow, this is amazing"?  
**Q:** Are there any other pain points in your workflow that we haven't discussed?

### 12.2 Concerns
**Q:** What are your biggest concerns about implementing an automated system?  
**Q:** Do you worry about losing control or flexibility?  
**Q:** Are there aspects of scheduling that should NEVER be automated?

### 12.3 Collaboration
**Q:** Would you be willing to be a design partner and give us frequent feedback?  
**Q:** Can we observe your scheduling process for a day?  
**Q:** Would you introduce us to a few radiologists to get their perspective?

---

## 📊 Post-Meeting Action Items

After the meeting, document:

### Immediate Actions
- [ ] Clarify any conflicting rules or ambiguities
- [ ] Collect sample historical data (if available)
- [ ] Define concrete success metrics
- [ ] Establish communication cadence

### Follow-Up Questions
- [ ] Questions that came up during the meeting
- [ ] Items Mike needs to check with others
- [ ] Data/documents he's going to send

### Next Steps
- [ ] Schedule follow-up meeting
- [ ] Create prototype based on feedback
- [ ] Demo specific features Mike is most interested in
- [ ] Define pilot scope and timeline

---

## 💡 Key Things to Listen For

As Mike talks, listen for:

1. **Emotional Language:** What makes him frustrated, relieved, anxious, excited?
2. **Time Sinks:** Where does he mention spending "hours" or "forever"?
3. **Conflict Stories:** Real examples reveal hidden requirements
4. **Workarounds:** "We usually just..." = opportunity for improvement
5. **Hesitations:** "I'm not sure if..." = areas needing clarity
6. **Unwritten Rules:** "Everyone knows that..." = document these!
7. **Power Users:** Who does he mention by name as key stakeholders?
8. **Red Lines:** "We could never..." = hard constraints

---

## 🎯 Meeting Goals Summary

By the end of this meeting, you should know:

✅ **Validated:** Vacation rules and constraints are correct  
✅ **Prioritized:** Which features matter most (MVP vs. nice-to-have)  
✅ **Quantified:** Current process costs (time, money, frustration)  
✅ **De-risked:** Technical feasibility, data availability, adoption concerns  
✅ **Committed:** Next steps, timeline, decision criteria  
✅ **Aligned:** Shared understanding of success

---

**Good luck with the meeting! Remember:**
- Listen more than you talk (80/20 rule)
- Ask "why" and "tell me more about that" frequently
- Don't defend or explain the system yet - just learn
- Take detailed notes or record (with permission)
- Validate understanding by paraphrasing back

**Most important:** Build trust and demonstrate that you understand their world before proposing solutions.

