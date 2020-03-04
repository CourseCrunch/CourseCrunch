import requests
from bs4 import Tag, NavigableString, BeautifulSoup
import re
base = "https://student.utm.utoronto.ca/calendar//"
dept_base = "program_group.pl?Group_Id="
programs_url = ""
departments = {}
depttoprogram = {}
programreqs = {}

def get_departments():
    pattern = r"program_group.pl\?Group_Id=(\d+)";
    page = requests.get(programs_url)
    soup = BeautifulSoup(page.content, 'html.parser')
    rows = soup.findChildren(["li"])
    for row in rows:
        link = row.find("a")
        if link and "href" in link.attrs: 
            match = re.search(pattern, link["href"])
            if(match):
                departments[link.contents[0]] = match.group(1)


def getProgramsForDept(dept):
    if dept not in departments:
        return "Not valid"
    dept_url = base + dept_base + departments[dept]
    page = requests.get(dept_url)
    soup = BeautifulSoup(page.content, 'html.parser')
    program_list = soup.findChildren("p", class_="title_program")
    start = 0
    for program in program_list:
        pname = tuple([content for content in program.contents if str(content) != "<br/>"]) 
        start = 0
        while program.next_sibling:
            if start: 
                if str(program) == "</table>":
                    break
                else:
                    if(type(program) == Tag and program.name == "table"):
                        programreqs[pname] = get_course_list_from_row(program)
                    

            if not start and (program.next_sibling.name == "table"):
                start = 1
           
            program = program.next_sibling
    

def get_course_list_from_row(table):
    rows = table.findChildren(["tr"])
   # print([element.contents[0] for element in elements])
    year_to_req = {}
    year = 1
    print("These are the rows: |{}|".format(rows))
    for row in rows:
        elements = row.findChildren(["td"])
        for element in elements:
            courses = element.findChildren(["a"])
            if(courses != []):
                add_courses(year_to_req, year, courses)
                year += 1
    return year_to_req

def add_courses(year_to_req, year, courses):
    year_to_req[year] = []
    for course in courses:
        if course.contents != []:
            if(len(course.contents[0]) < 8 and year_to_req[year] != []):
                year_to_req[year][-1] += "/" + course.contents[0]
            else:
                year_to_req[year].append(course.contents[0])

def write_to_file():
    with open("program-reqs.csv", "w+") as file:
        for program in programreqs:
            if(len(program) == 2):
                file.write("{}, {}".format(program[0], program[1]))
            else:
                file.write("{}, 'Name not found'".format(program[0]))
            for year, reqs in programreqs[program].items():
                file.write(", Year {}, {}, {}".format(year, str(len(reqs)), ', '.join(reqs)))
            file.write("\n")

if __name__ == "__main__":
    url = base + "calendar.pl"
    homepage = requests.get(url)
    soup = BeautifulSoup(homepage.content, 'html.parser')
    navigation_list = soup.find_all("a", class_="bodyLink")

    for link in navigation_list:
        if "List of Programs" in link.contents:
            programs_url = base + link["href"]
    print("Programs url: {}".format(programs_url))
    get_departments()
    print("Got departments")
    for dept in departments:
        getProgramsForDept(dept)
    print("Got programs")
    write_to_file()