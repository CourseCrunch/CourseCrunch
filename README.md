# CourseCrunch
A web application that allows students at the University of Toronto to plan their courses by looking an information about course difficulty,
Professor reviews, and space-availability.

### Installation

`Step 1`: Clone our repo:

```bash
git clone https://github.com/CourseCrunch/CourseCrunch.git
```

`Step 2`: cd in the repo:

```bash
cd CourseCrunch
```

`Step 3`: run our setup script which will run all our microservices after using `npm install` in all the subdirectories

```bash
./setup.sh
```

In browser, open [http://localhost:3000](http://localhost:3000)

## Main Features:

- [x] Instructor View: This feature allows seeing instructor reviews from course evaluations and Rate my Professor
- [x] Course Recommendations: This feature allows seeing courses with the least work load (according to course reviews) that can fit in a
user's schedule and can be taken after the courses that the user has previously taken
- [x] Waitlist watcher: This feature allows a user to add/remove courses that they want to watch for space. As soon as the course has space,
the user is sent an email notification

