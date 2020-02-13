import requests
from bs4 import Tag, NavigableString, BeautifulSoup
import re
base = "https://student.utm.utoronto.ca/calendar//"
programs_url = ""
courses_url = ""
dept_base = "newdep_detail.pl?Depart="
course_base = "&Course="
departments = {}
dept_courses = {}
courses = {}
course_excl = {}
course_pre = {}

url = base + "calendar.pl"
homepage = requests.get(url)
soup = BeautifulSoup(homepage.content, 'html.parser')
navigation_list = soup.find_all("a", class_="bodyLink")



def getAllDepartments():
    pattern = r"newdep_detail.pl\?Depart=(\d+)";
    page = requests.get(courses_url)
    soup = BeautifulSoup(page.content, 'html.parser')
    tables = soup.findChildren("table", class_="normaltext")
    courseTable = tables[0]
    rows = courseTable.findChildren(["li"])
    for row in rows:
        link = row.find("a")
        if link and "href" in link.attrs: 
            match = re.search(pattern, link["href"])
            if(match):
                departments[link.contents[0]] = match.group(1)

def getCoursesForDept(dept):
    if(dept not in departments):
        print("Not a valid department")
        return
    else:
        department_url = base + dept_base + departments[dept]
        page = requests.get(department_url)
        soup = BeautifulSoup(page.content, 'html.parser')
        tables = soup.findChildren("table", class_="normaltext")
        if(tables == []):
            return 
        courseTable = tables[0]
        rows = courseTable.findChildren(["td"])
        for row in rows:
            link = row.find("a")
            if link:
                course_name = link.contents[0]
                courses[course_name] = link["href"]
                dept_courses.setdefault(dept, []).append(course_name)

def populate_courses():
    for dept in departments:
        if dept not in dept_courses:
            getCoursesForDept(dept)

def getCourseData(courseurl):
    page = requests.get(courseurl)
    soup = BeautifulSoup(page.content, 'html.parser')
    content = soup.find("div", class_="contentpos")
    c = content.contents[2]
    prereq_index = -1;
    excl_index = -1;
    for i in range(len(c.contents)):
        if type(c.contents[i]) == NavigableString:
            continue
        elif "Exclusion: " in c.contents[i].contents:
            excl_index = i
        if "Prerequisite: " in c.contents[i].contents:
            prereq_index = i
    excl = []
    pre  = []

    # if exclusions listed
    if(excl_index != -1): 
        i = excl_index + 1
        while i < len(c.contents) and str(c.contents[i]) != "<br/>":
            if(type(c.contents[i]) == Tag and c.contents[i].contents != []):
                excl.append(c.contents[i].contents[0])
            elif isinstance(c.contents[i], str) and c.contents[i].split(', ') != []:
                excl.extend([ch.strip() for ch in c.contents[i].split(', ') if ch.strip() != ""])
            i += 1

    # if prereqs listed        
    if(prereq_index != -1):
        i = prereq_index + 1
        while i < len(c.contents) and str(c.contents[i]) != "<br/>":
            if(type(c.contents[i]) == Tag and c.contents[i].contents != []):
                pre.append(c.contents[i].contents[0])
            elif isinstance(c.contents[i], str) and c.contents[i].split(', ') != []:
                pre.extend([ch.strip() for ch in c.contents[i].split(', ') if ch.strip() != ""])
            i += 1
    excl = clean_list(excl)
    pre = clean_list(pre)
    return excl, pre

def clean_list(lst):
    new_lst = []
    alt = 0
    for element in lst:
        if type(element) == Tag:
            continue;
        element = element.replace('(', "")
        element = element.replace(')', "")
        if "and" in element:
            element_lst = element.split("and")
        elif ";" in element:
            element_lst = element.split(";")
        elif "," in element:
            element_lst = element.split(",")
        else:
            element_lst = [element]
        for element in element_lst:
            element = element.strip()
            element = element.replace("or", "/")
            if(len(element) == 0):
                continue
            if (element[0] == '/' or len(element) < 8 or alt) and new_lst != []:
                new_lst[-1] += element
                alt = 0
    
            else:
                new_lst.append(element)

            if element != "" and "/"  == element[-1]:
                alt = 1 
    return new_lst



def get_reqs_all_courses():
    for course in courses:
        course_url = base + courses[course]
        reqs = getCourseData(course_url)
        course_excl[course] = reqs[0]
        course_pre[course] = reqs[1]

def write_department_data():
    with open("departments.csv", "w+") as file:
        for dept in dept_courses:
            lst = [dept, str(len(dept_courses[dept])), ', '.join(dept_courses[dept])]
            file.write("{}\n".format(', '.join(lst)))

def write_course_prereqs():
    with open("course-prereqs.csv", "w+") as file:
        for course in course_pre:
            lst = [course, str(len(course_pre[course])), ', '.join(course_pre[course])]
            file.write("{}\n".format(', '.join(lst)))

def write_course_excl():
    with open("course-excl.csv", "w+") as file:
        for course in course_excl:
            lst = [course, str(len(course_excl[course])), ', '.join(course_excl[course])]
            file.write("{}\n".format(', '.join(lst)))




if __name__ == "__main__":
    for link in navigation_list:
        if "List of Courses" in link.contents:
            courses_url = base + link["href"]
            break
    getAllDepartments()
    print("Got all departments")
    populate_courses()
    print("Got all courses")
    get_reqs_all_courses()
    print("Got all reqs")
    write_department_data()
    print("Wrote dept data")
    write_course_excl()
    print("Wrote course excl")
    write_course_prereqs()
    print("Wrote course prereqs")
