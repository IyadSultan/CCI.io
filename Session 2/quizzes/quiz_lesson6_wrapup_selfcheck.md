# Session 2 Wrap-Up — Quick Self-Check (No-Code)

## Questions

1. What Python data type would you use to store a patient's entire record (name, MRN, labs, medications)?

2. In the 9-section notebook template, what goes in the Configuration section vs. the Functions section?

3. What does `self.hemoglobin` mean inside a class method?

4. You merge two DataFrames with `how='left'` and see NaN values. What happened?

5. Your colleague asks "what did you change in the lab alert notebook last Thursday?" — how do you find out using GitHub?

---

## Answers

1. A **dictionary** (for simple cases) or a **class instance** (for complex cases with methods).

2. **Configuration** holds constants/thresholds/paths that change between runs. **Functions** hold reusable logic that operates on data.

3. It refers to the hemoglobin attribute of the specific patient object calling the method.

4. Some rows in the left table had no matching key in the right table — those patients are missing data from the second source.

5. Go to the GitHub repo → click the file → click "History" to see all commits that changed that file, with dates and messages.
