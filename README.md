# Team 3 - Assignment 1 Project

## Change Log
- **Group Project Due:** 23:59 Friday 11 April 2025  
- **Weight:** 40%  
- **Submission System:** [ECS Submission](https://apps.ecs.vuw.ac.nz/submit/SWEN422)  
- **Extensions:** See notes on Slip Days and Extensions.  

## Submission Details

| Assessment Component        | Weighting | Due Date |
|-----------------------------|-----------|-----------|
| Individual Final Report    | 25%       | 23:59 Friday 11 April 2025 |
| Group Project Code         | 15%       | 23:59 Friday 11 April 2025 |

---

## 1. Introduction  
Assignment 1 is worth **40% of the overall course grade** and involves implementing an **information visualization software prototype** using **D3 or Unity**. This group project consists of two main deliverables:  
- **25%** - Individual report on the visualization design, implementation, and critique.  
- **15%** - Group project assessed on the quality of the visualization, codebase, and accompanying video.

The project is expected to take approximately **40 hours per individual**.

---

## 2. Dataset:

[NZ Crash Analysis System](https://opendata-nzta.opendata.arcgis.com/datasets/8d684f1841fa4dbea6afaefc8a1ba0fc_0/explore?location=-39.509339%2C176.882313%2C14.05)


---

## 3. Development Tools 
- The prototypes for our designs will be created with **Figma** [SWEN422 A1 Prototypes](https://www.figma.com/design/181flhWNbnQZYzVdjHhDSP/SWEN422-A1-Prototypes?node-id=0-1&t=geMkkD2KuGIUkiin-1)
- The visual system will implemented using **D3.js** ([d3js.org](https://d3js.org/))
- We will use **React** as the front end framwork 

The visualization system will be indirectly assessed through the **final report and project video**.

---

## 6. Assignment Timeline  

| Week  | Task |
|-------|------|
| **1 & 2** | Attend lectures on InfoVis techniques, submit team formation. |
| **3** | Meet team, select dataset, experiment with D3/Unity, create paper prototypes, set up GitLab issues. |
| **4** | Create personas, create use cases, create paper prototypes, develop designs using **Figma**. |
| **5-6** | Implement and test visualizations, draft individual reports. |
| **7** | Finalize reports, create project video, submit final deliverables. |

---

## 7. Grading  

### 7.1 Team Project Code - Group Grade (15%)  
The group will receive an overall grade based on:  
- **Visualizations (60%)**  
- **Code Base (20%)**  
- **Project Video (20%)**  

Each group must submit a **video demonstration** (YouTube/Vimeo link) showcasing the project.  
🚫 **Do not commit the video file to GitLab.**

---

### 7.2 Individual Final Report - Individual Grade (25%)  
Each member submits a **2,500-3,000 word report** covering:  
- **Key design/implementation decisions**  
- **Justifications & alternative designs**  
- **Critique of visualizations and tools (D3, Unity, Unreal, frameworks used, etc.)**  
- **Use of citations and references from course readings**  

#### Prerequisites for report'
| Report must include | Action Required |
|---------------------|-----------------|
|Justification of design choices like the use of visual variable | Read the readings and do research to come up with design choices that can be backed up |
| Discussion of alternative designs | Do more Figma prototypes for designs than number of designs we will implement and also we need to sit down and justify why we chose the ones we did |
| Critique of our final design| Keep a log of critiques and failures of our design with justifications to refer back to for report |
| Critique of the development tools | Keep a log of critiques of decvelopement tools to refer back to for report |

#### Report Formatting  
- **Filename:** `SWEN422-Assignment-1-final-username.pdf`  
- **Length:** Max **3,500 words** (excluding images, tables, and references)  
- **Submission:** **PDF only** via the ECS online submission system  

### Individual Grade Breakdown  
| Component | Weighting |
|-----------|----------|
| Written Communication | 25% |
| Key Design Decisions | 25% |
| Justifications & Alternative Designs | 25% |
| Visualization & Development Tools Critique | 25% |

---

## Adding Population Data to Region Table

To enable per capita crash statistics, you'll need to add population data to the region table. Follow these steps:

1. Open SQLite database (using SQLite CLI or your preferred SQLite tool)
```bash
sqlite3 your_database.db
```

2. Add the population column to the region table:
```sql
ALTER TABLE region ADD COLUMN population INTEGER;
```

3. Insert population data for each region:
```sql
UPDATE region 
SET population = 
    CASE region_name
        WHEN 'Auckland Region' THEN 1718982
        WHEN 'Bay of Plenty Region' THEN 355890
        WHEN 'Canterbury Region' THEN 651060
        WHEN 'Gisborne Region' THEN 52110
        WHEN 'Hawke''s Bay Region' THEN 178470
        WHEN 'Manawatu-Whanganui Region' THEN 238797
        WHEN 'Marlborough Region' THEN 51730
        WHEN 'Nelson Region' THEN 54590
        WHEN 'Northland Region' THEN 201500
        WHEN 'Otago Region' THEN 246740
        WHEN 'Southland Region' THEN 102400
        WHEN 'Taranaki Region' THEN 123010
        WHEN 'Tasman Region' THEN 57240
        WHEN 'Waikato Region' THEN 496710
        WHEN 'Wellington Region' THEN 547000
        WHEN 'West Coast Region' THEN 32550
    END;
```

4. Verify the data was added correctly:
```sql
SELECT region_name, population FROM region ORDER BY region_name;
```

### Population Data Source
Population numbers are based on 2022/2023 estimates from Stats NZ. If you need to update these numbers, modify the values in the UPDATE statement above.

### Troubleshooting
If you encounter any issues:
1. Make sure your database is writable
2. Verify region names match exactly (including 'Region' suffix)
3. Check that the population column was added successfully:
```sql
.schema region
```

### Using Per Capita Data
Once the population data is added:
1. The toggle switch for "Crashes per 100,000 people" will be functional
2. Per capita calculations will use these population values
3. The graph will automatically update to show crashes per 100,000 people when toggled

Note: If you need to update population numbers in the future, you can run the UPDATE statement again with modified values.