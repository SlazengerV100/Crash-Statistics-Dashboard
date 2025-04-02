## Project structure
- Create a Single Page Application (SPA) with three visualizations.
- Ensure the visualizations are visually appealing and easy to understand, even for a general audience.
- data hooked up to a backend

## CSV data to transfer to SQL
- Transfer file to SQL database (unsure what type yet) which will be local
- Make a schema for the database

## Technology Choices
- **Database:** maybe SQLite instead of PostgreSQL for its lightweight nature and ease of setup.
- **Frontend:** Use JavaScript and React, leveraging team members’ experience.
- **Visualization Libraries:**
    - D3.js
    - Recharts
    - Flexibility to choose based on developer preference and visualisation we are making.

## Development Considerations
- Keep both the backend and frontend simple for faster development.
- Use SQLite for easy local database management, avoiding PostgreSQL’s complexities (MAYBE).
- Plan for handling data migration and modifications within SQLite.

## meeting conclusion
after me (kahu) and zarn had a discussion about the project we decided to go with the following plan for the following reasons
- **Database:** SQLite is lightweight and easy to set up, making it ideal for our project.
- **Frontend:** JavaScript and React are familiar to the team, making development easier.
- **Visualization Libraries:** D3.js and Recharts are flexible and can be chosen based on the developer’s preference and the visualisation being created.

**reason for database overall**: working with a csv file with ~900,000 and trying to parse that in a frontend application and selctioning and querying the data would be a nightmare. 
So we decided to go with a database to store the data and then query it from the frontend, this would make it easier to section and work with the data effectively.
Overall increasing technical overhead in the short term to reduce it heavily in the long term and speed up the process and efficiency fo the app.
## Next Steps
- **Kahu:** Set up a database schema and backend choice to populate a backend from the CSV file.
- **Zarn:** Migrate the frontend to JavaScript.  
