# CCI Session 3 -- Lesson 5: Text-to-SQL -- Talk to Your Data

**Estimated time:** 25 minutes (12 min content / 13 min lab)
**Lab mode:** Guided step-by-step (Google Colab)
**Prerequisites:** Sessions 1-2, Lessons 1-4 of this session (OpenAI API, structured output, memory/tool calling, CSV-to-SQL)

---

## Instructor Introduction

> "This is where everything comes together. You know the OpenAI API. You know SQL. Now imagine a nurse or oncologist asking a question in plain English -- 'How many patients had fever in the ICU this week?' -- and getting an instant answer from the database. That's what we're building right now."

---

## NotebookLM Summary

### The Text-to-SQL Pipeline

Text-to-SQL is a pattern that connects natural language to structured data. The pipeline has four stages: (1) a user asks a question in plain English or Arabic, (2) an LLM generates a SQL query that answers that question, (3) the query executes against a database, and (4) the raw results are formatted into a human-readable answer. At KHCC, this pipeline could allow oncologists, nurses, and quality officers to interrogate the vitals database without writing a single line of SQL. Instead of waiting for an informatics analyst to run a report, clinical staff could ask questions directly and receive answers in seconds.

### Describing Your Schema to the LLM

The LLM cannot see your database. It has no access to your tables, columns, or data. You must describe the schema explicitly in your system prompt so the model knows what it can query. For the vista_vitals database, your schema description should include the table name, every column name with its data type and a brief explanation, and a few sample rows so the model understands the format of values like RATE (which stores "98.6" for temperature but "120/80" for blood pressure) and HOSPITAL_LOCATION (which uses KHCC ward names like "ICU", "ONCOLOGY WARD 3", "PEDIATRIC ONCOLOGY"). Without this context, the LLM will guess column names and produce queries that fail.

### Prompt Engineering for SQL Generation

The system prompt is the most important component of a text-to-SQL system. It should contain three elements: (1) a clear role statement telling the model it is a SQL query generator for a clinical vitals database, (2) the complete schema description, and (3) few-shot examples pairing natural language questions with their correct SQL translations. For instance, including the example pair -- question: "How many temperature readings were taken in the ICU?" / SQL: `SELECT COUNT(*) FROM vitals WHERE VITAL_TYPE = 'TEMPERATURE' AND HOSPITAL_LOCATION = 'ICU'` -- teaches the model the exact column names, value formats, and query patterns it should follow. Three to five well-chosen examples covering different query types (filtering, aggregation, date ranges, subqueries) dramatically improve accuracy.

### Executing Generated SQL Safely

Running LLM-generated SQL against a real database demands caution. The first safeguard is to open your SQLite connection in read-only mode, which prevents any INSERT, UPDATE, DELETE, or DROP statements from executing. The second safeguard is wrapping every query execution in a try/except block so that malformed SQL returns a helpful error message rather than crashing your application. You should also validate that the generated output is actually a SQL query before executing it -- check that it starts with SELECT and does not contain dangerous keywords. In a production clinical system at KHCC, parameterized queries and role-based access controls would add further layers of protection against SQL injection and unauthorized data access.

### Formatting Results as Natural Language

Raw query results -- a list of tuples or a pandas DataFrame -- are not what a clinician wants to see. The final step in the pipeline sends the original question and the query results back to the LLM, asking it to compose a natural language answer. If the query returns `[(47,)]` for the question "How many patients had fever in the ICU?", the model should respond with something like "There were 47 fever readings recorded in the ICU during the specified period." This formatting step transforms a technical database interaction into a conversational experience that any clinical staff member can understand.

### Building a Conversational Interface

Wrapping the pipeline in a loop creates an interactive clinical data assistant. The user types a question, the system generates SQL, executes it, formats the answer, and then waits for the next question. Adding conversation memory (from Lesson 3) lets the system handle follow-up questions: after asking "How many fever readings were in the ICU?", a user could ask "What about the oncology ward?" and the system should understand from context that the user is still asking about fever readings.

### Using Tool Calling for a Cleaner Architecture

Rather than generating SQL as plain text and parsing it manually, you can define a `run_sql_query` tool using the function calling pattern from Lesson 3. The tool definition specifies that the LLM should produce a JSON object with a `query` field containing the SQL string. The OpenAI API returns a structured tool call, you extract the query, execute it, and return the results as a tool response. This approach is more robust than text parsing because the query is always in a predictable JSON field, and it integrates naturally with multi-tool agents that might also look up drug information, check lab results, or pull patient demographics.

### Common Failure Modes and How to Handle Them

Text-to-SQL systems fail in predictable ways. The most common error is incorrect column names -- the model invents a column like "patient_id" when the actual column is "MRN". This is solved by providing the schema in the system prompt. Wrong aggregations occur when the model uses AVG instead of COUNT or groups by the wrong column; few-shot examples reduce this. Ambiguous questions like "Show me the bad vitals" require the system to either ask for clarification or apply reasonable clinical defaults (temperature above 100.4 F, systolic BP above 140). Date handling is another challenge: the model must know the date format stored in your database to construct correct WHERE clauses. Building a robust system means anticipating these failures and adding validation, retry logic, and clear error messages.

### Clinical Examples with vista_vitals

The following examples demonstrate the kinds of questions KHCC clinical staff might ask and the SQL the system would generate:

- **"Which ward has the most critical temperature readings?"** generates a query filtering VITAL_TYPE = 'TEMPERATURE' with RATE > 100.4, grouped by HOSPITAL_LOCATION, ordered by count descending.
- **"Show me patient 4400123's vitals trend for the last week"** generates a query filtering by MRN and a date range, ordered by DATE_TIME_VITALS_TAKEN.
- **"How many blood pressure readings were dangerously high last month?"** requires parsing the systolic value from the RATE field (stored as "120/80") and filtering where it exceeds 140.
- **"Which nurse entered the most vitals yesterday?"** generates a GROUP BY ENTERED_BY query with a date filter and ORDER BY COUNT(*) DESC LIMIT 1.

Each of these questions represents a real operational or clinical need at KHCC -- from infection control monitoring to workload analysis to patient safety surveillance.

---

## Student Study Guide

### Before This Lesson

- **Review Lesson 1** (OpenAI API basics): you need to be comfortable making `chat.completions.create()` calls with system and user messages.
- **Review Lesson 3** (tool calling): the `run_sql_query` tool follows the same pattern you learned for defining and handling function calls.
- **Review Lesson 4** (CSV to SQL): your SQLite database with the vitals table must be ready. If you did not complete the Lesson 4 lab, run through the setup steps at the start of the Lesson 5 notebook.
- **Think of three clinical questions** that a nurse or oncologist at KHCC might ask about patient vitals. Write them down in plain English -- you will test them during the lab.

### During This Lesson

- **Follow the pipeline step by step**: schema description, system prompt construction, SQL generation, execution, and result formatting. Each stage builds on the previous one.
- **Read the system prompt carefully** -- notice how the schema, role, and few-shot examples work together. Small changes to wording can significantly affect the quality of generated SQL.
- **Test edge cases** during the lab. Try ambiguous questions, questions about data that does not exist, and questions that require complex joins or subqueries.
- **Compare the generated SQL** to what you would write by hand. Where does the model do well? Where does it struggle?
- **Pay attention to safety measures**: read-only connections, try/except blocks, and input validation. These are not optional in a clinical setting.

### After This Lesson

- **Extend the system** by adding more few-shot examples to the system prompt. Test whether additional examples improve accuracy on the question types that failed during the lab.
- **Try adding a second table** (such as a patient demographics table) and see if the model can generate JOIN queries when you update the schema description.
- **Experiment with different models** -- compare gpt-4o-mini to gpt-4o for SQL generation quality and speed.
- **Reflect on deployment**: what would it take to put a text-to-SQL system into production at KHCC? Consider data security, access controls, audit logging, and validation requirements.
- **Brainstorm with colleagues**: what other KHCC data sources (lab results, medication orders, appointment schedules) could benefit from a natural language query interface?

### Resources

| Resource | Link |
|---|---|
| OpenAI function calling guide | https://platform.openai.com/docs/guides/function-calling |
| OpenAI prompt engineering guide | https://platform.openai.com/docs/guides/prompt-engineering |
| SQLite read-only mode | https://www.sqlite.org/uri.html |
| Python `sqlite3` module | https://docs.python.org/3/library/sqlite3.html |
| pandas `read_sql_query` | https://pandas.pydata.org/docs/reference/api/pandas.read_sql_query.html |
| OWASP SQL injection prevention | https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html |
| Text-to-SQL survey (academic) | https://arxiv.org/abs/2406.11434 |
