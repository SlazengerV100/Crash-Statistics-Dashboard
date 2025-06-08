# Usability Test Plan – Crash Statistics NZ Dashboard

## Testing Overview (Anthony)

This document outlines the expected process for conducting a usability test of the **Crash Statistics NZ dashboard**.

To evaluate the effectiveness and usability of our dashboard, we will conduct a usability test with a sample of university peers who closely align with our target user personas: **Anton Marcus** and **Sophie Bennett** (engineering and data science fields, respectively).

### Goal

To assess how intuitive and user-friendly the dashboard is and identify any barriers users face across the three core pages:

- **Homepage** – crash heatmap with a year slider
- **Regional Comparison Page** – interactive filters
- **Factors Page** – sunburst diagrams

Participants will complete tasks while thinking aloud. Observers will note any confusion. Afterwards, participants will complete a **System Usability Scale (SUS)** questionnaire to gather quantitative data.

---

## Methodology (Kahu)

### Participants

- 12 university students selected for convenience and persona alignment (STEM fields)

### Format

- 3 group sessions, each lasting 30–45 minutes
- Each group contains 4 participants
- 9 tasks designed to cover key dashboard features

### Key Features Covered

- Crash heatmap and time slider
- Region filters and comparisons
- Sunburst visualisations

### Data Collected

- Task completion time
- Error rate (e.g., incorrect filters, misreading graphs)
- Think-aloud user comments
- SUS scores
- Post-test qualitative feedback

---

## Roles (Alex)

### Session Schedule

#### Jackie’s Group (Starts at 1pm)

| Time   | Facilitator | Note Taker | Participant |
|--------|-------------|------------|-------------|
| 1:00pm | Zarn        | Kahu       | A           |
| 1:00pm | Alex        | Anthony    | B           |
| 1:15pm | Zarn        | Kahu       | C           |
| 1:15pm | Alex        | Anthony    | D           |

#### Arnav’s Group (Starts at 2pm)

| Time   | Facilitator | Note Taker | Participant |
|--------|-------------|------------|-------------|
| 2:00pm | Zarn        | Kahu       | A           |
| 2:00pm | Alex        | Anthony    | B           |
| 2:15pm | Zarn        | Kahu       | C           |
| 2:15pm | Alex        | Anthony    | D           |

#### Jacob’s Group (Starts at 3pm)

| Time   | Facilitator | Note Taker | Participant |
|--------|-------------|------------|-------------|
| 3:00pm | Zarn        | Kahu       | A           |
| 3:00pm | Alex        | Anthony    | B           |
| 3:15pm | Zarn        | Kahu       | C           |
| 3:15pm | Alex        | Anthony    | D           |

### Responsibilities

**Facilitator (Zarn and Alex)**  
- Schedule testing times and prepare materials  
- Brief participants and answer questions  
- Record task completion time  

**Note Taker (Kahu and Anthony)**  
- Record observations and errors  
- Support facilitator  
- Capture audio and participant comments  

**Data Analyst (All Members)**  
- Analyse qualitative and quantitative data  
- Suggest improvements based on trends  

**Test Subjects**  
- Execute tasks from the script  
- Complete the post-test questionnaire  

---

## Script (Anthony)

> Thank you for joining us today. We are conducting a usability test for a dashboard we have developed to visualise vehicle crash statistics in New Zealand. It includes several interactive graphs and maps designed to help users explore crash data in different ways.

> The homepage visualisation is a heatmap of New Zealand displaying crashes by year, which includes a slider to change the year and a play button to animate through the years since 2000.

> The regional comparison visualisation can be used to interactively display crashes by region, with filters for weather conditions, vehicles involved, crash severity and more.

> The factors visualisation shows both the proportion of different types of vehicles and obstacles involved in crashes.

> The purpose of this test is to understand how users interact with the dashboard, not to test you. There are no right or wrong answers. Any feedback you give us will help improve the tool, so please express your thought process as much as you can throughout the study.

> You will be asked to complete a series of short tasks within our application. Once you have completed each task, we will ask you to complete a short survey about your experience during the completion of the task.

> Your responses will be kept anonymous and used solely for the purposes of improving our application. To complete the study, we require you to fill out the Usability Test Consent Form.

---

## Tasks (Z’Arn)

1. **Navigate to a page showing crash data for Auckland, Christchurch and Wellington.**  
   Change the filter to bike crashes for the 2009 to 2025 period.

2. **Find the sunburst chart and identify the 3rd most obstacle.**  
   Expected: "Fence and post or pole" (~2.25% of crashes)

3. **Compare the frequency of crashes between Southland and Otago in 2009–2014.**

4. **Find the number of crashes in the Basin Reserve in 2020.**  
   Use cluster map (~15 dots depending on count)

5. **Find the number of crashes in snowy conditions in New Zealand.**  
   Requires time series insight and possible misconceptions.

6. **Find the number of non-injury crashes in Featherston in 2024.**  
   Answer: 3 crashes using cluster map.

7. **Find what proportion of single car crashes involve a van.**  
   Requires combining values: (7.13% / 42.5%) ≈ 16.8%

8. **Based on the heatmap, find the area with the highest concentration of crashes.**  
   Ambiguous — unclear from visualisation.

9. **Find the number of crashes on Cable Street.**  
   Another cluster map challenge, potentially hard to locate.

---

## Metrics (Z’Arn)

### During the Test (Synchronous)

- **Task Completion Time**  
  - Timer starts when task is revealed  
  - Target: ≤ 90 seconds for experienced users

- **Error Rate**  
  - Incorrect selections or misunderstandings  
  - Benchmark: ≤ 2 errors per task

- **Think-Aloud Observations**  
  - Verbalisations recorded  
  - Confusion, hesitations, workarounds noted

### After the Test (Asynchronous)

- **System Usability Scale (SUS)**  
  - 10-item questionnaire  
  - Scored using Brooke (1996) method  
  - Target average: ≥ 68 (industry benchmark)

- **Post-Test Interview**  
  - Open-ended feedback  
  - Pain points and improvement suggestions

---

## Usability Goals (Z’Arn)

### During the Test

- **Task Completion Time**  
  - Target: ≤ 90 seconds  
  - Visualised as histogram/boxplot

- **Error Rate**  
  - Target: ≤ 2 errors  
  - Visualised as histogram

- **Think-Aloud Feedback**  
  - Identify key confusion or satisfaction points

### After the Test

- **SUS Score**  
  - Target: Average ≥ 68, Minimum 50, Ideal 75+  
  - Shown in distribution charts

- **Interview Feedback**  
  - At least 2 suggestions for improvement  
  - 2 key pain points, coded into themes

---

## Problem Severity (Kahu)

### Classification of Issues

**Critical**  
- App crashes, freezes, or loses data  
- Cannot complete major functions  
- Examples:
  - Crash when clicking button
  - Inaccurate value calculation

**Moderate**  
- Impacts user perception or flow  
- Examples:
  - Poor colour contrast hides links
  - Accessibility issue

**Minor**  
- Styling or aesthetic only  
- Examples:
  - Misaligned items
  - Inconsistent colours

**Won’t Fix**  
- Design choices the team stands by  
- Based on research, values, or business logic  
- Examples:
  - Alternative placements that aren’t bugs
