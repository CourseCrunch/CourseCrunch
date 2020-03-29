CREATE TYPE course_session AS ENUM ('fall', 'winter', 'summer');

CREATE TABLE IF NOT EXISTS CC_USER_WAITLIST(
    ID UUID REFERENCES CC_CREDENTIALS(ID),
    CourseCode CHAR(8),
    Term course_session,
    CCYear SMALLINT,
    PRIMARY KEY (ID, CourseCode, CCYear, Term)
);