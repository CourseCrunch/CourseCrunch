CREATE TYPE session AS ENUM ('Fall', 'Spring', 'Summer_F', 'Summer_S', 'Year', 'Summer_Year');

CREATE TABLE IF NOT EXISTS CC_USER_WAITLIST(
    ID UUID REFERENCES CC_CREDENTIALS(ID),
    CourseCode CHAR(6),
    Term session,
    CCYear SMALLINT,
    PRIMARY KEY (ID, CourseCode, CCYear, Term);
);