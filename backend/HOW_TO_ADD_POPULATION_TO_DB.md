
## Adding Population Data to Region Table

To enable per capita crash statistics, you'll need to add population data to the region table. Follow these steps:

1. Open SQLite database 
```bash
sqlite3 my_database.db
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