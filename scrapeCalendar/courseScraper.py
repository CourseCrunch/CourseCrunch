# env
import os
from dotenv import load_dotenv
import requests
from bs4 import Tag, NavigableString, BeautifulSoup
import re
from neo4j import GraphDatabase
base = "https://student.utm.utoronto.ca/calendar//"
programs_url = ""
courses_url = ""
dept_base = "newdep_detail.pl?Depart="
course_base = "&Course="
departments = {}
dept_courses = {}
course_dept = {}
courses = {}
course_excl = {}
course_pre = {}
exclusion = 1
prereq = 0

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

def write_department_data(driver):
    with driver.session() as session:
        for dept in dept_courses:
            lst = []
            for course in dept_courses[dept]:
                session.write_transaction(add_course, course, dept)
                lst.append(course)
            

def write_course_prereqs(driver):
    with driver.session() as session:
        for course in course_pre:
            for reqs in course_pre[course]:
                for req in reqs.split("/"):
                    m = re.match(r"(\w?\w?\w?(\w)?(\d)?\d\d\w\d)", req.strip().replace(" ", ""))
                    if m:
                        session.write_transaction(add_relation, prereq, m.group(1), course)
                
                

def write_course_excl(driver):
    with driver.session() as session:
        for course in course_excl:
            for reqs in course_excl[course]:
                for req in reqs.split("/"):
                    m = re.match(r"(\w?\w?\w?(\w)?(\d)?\d\d)", req.strip().replace(" ", ""))
                    if m:
                        session.write_transaction(add_relation, exclusion, m.group(1), course)
                            
                
                

def add_relation(tx, excl_or_pre, course1, course2):
    if(excl_or_pre == exclusion):
        tx.run("MATCH (a:Course {code: $course1}), (b:Course {code: $course2}) \
            MERGE (a)-[r: ExclusionTo]->(b)", course1=course1, course2=course2)
    else:
        tx.run("MATCH (a:Course {code: $course1}), (b:Course {code: $course2}) \
            MERGE (a)-[r: PrereqTo]->(b)", course1=course1, course2=course2)


def add_course(tx, course, dept):
    tx.run("MERGE (c:Course {code: $code, department: $dept})", code=course, dept=dept)


if __name__ == "__main__":
    for link in navigation_list:
        if "List of Courses" in link.contents:
            courses_url = base + link["href"]
            break
    load_dotenv(os.getcwd() + "/config.env")
    driver = GraphDatabase.driver("bolt://localhost:7687", auth=(os.environ.get("DBUSER"),  os.environ.get("DBPWD")))
    getAllDepartments()
    print("Got all departments")
    populate_courses()
    print("Got all courses")
    get_reqs_all_courses()
    print("Got all reqs")
    write_department_data(driver)
    print("Wrote dept data")
    write_course_excl(driver)
    print("Wrote course excl")
    write_course_prereqs(driver)
    print("Wrote course prereqs")
    driver.close()
