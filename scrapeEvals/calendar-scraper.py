import requests
from bs4 import Tag, NavigableString, BeautifulSoup

base = "https://student.utm.utoronto.ca/calendar//"
programs_url = ""
courses_url = ""

url = "https://student.utm.utoronto.ca/calendar//calendar.pl"
page = requests.get(url)
soup = BeautifulSoup(page.content, 'html.parser')
navigation_list = soup.find_all("a", class_="bodyLink")

for link in navigation_list:
    if "List of Programs" in link.contents:
        programs_url = base + link["href"]
    elif "List of Courses" in link.contents:
        courses_url = base + link["href"]

department = "Computer Science"

def getDepartmentUrl(department):
    page = requests.get(courses_url)
    soup = BeautifulSoup(page.content, 'html.parser')
    tables = soup.findChildren("table", class_="normaltext")
    courseTable = tables[0]
    rows = courseTable.findChildren(["li"])
    for row in rows:
        link = row.find("a")
        if link and department in link.contents:
            return base + link['href']
    
def getCourseUrl(department, course):
    department_url = getDepartmentUrl(department)
    page = requests.get(department_url)
    soup = BeautifulSoup(page.content, 'html.parser')
    tables = soup.findChildren("table", class_="normaltext")
    courseTable = tables[0]
    rows = courseTable.findChildren(["td"])
    for row in rows:
        link = row.find("a")
        if link and course in link.contents:

            return base + link['href']

def getCourseData(courseurl):
    page = requests.get(courseurl)
    soup = BeautifulSoup(page.content, 'html.parser')
    content = soup.find("div", class_="contentpos")
    c = content.contents[2]
    prereq_index = -1;
    excl_index = -1;
    #print(content.contents)
    for i in range(len(c.contents)):
        if type(c.contents[i]) == NavigableString:
            continue
        elif "Exclusion: " in c.contents[i].contents:
            excl_index = i
        if "Prerequisite: " in c.contents[i].contents:
            prereq_index = i
    
    excl = []
    pre  = []
    i = excl_index + 1
    while str(c.contents[i]) != "<br/>":
        if(type(c.contents[i]) == Tag):
            excl.append(c.contents[i].contents[0])
        elif c.contents[i].split(', ') != []:
            excl.extend([ch.strip() for ch in c.contents[i].split(', ') if ch.strip() != ""])

        i += 1
    
    i = prereq_index + 1
    while str(c.contents[i]) != "<br/>":
        if(type(c.contents[i]) == Tag):
            pre.append(c.contents[i].contents[0])
        elif c.contents[i].split(', ') != []:
            pre.extend([ch.strip() for ch in c.contents[i].split(', ') if ch.strip() != ""])
        
        i += 1
    
    return excl, pre
    
        

courseurl = getCourseUrl("Computer Science", "CSC108H5")
getCourseData(courseurl)





