import os
import requests
import json
import re
from html.parser import HTMLParser
import threading
import pprint

class courseparse(HTMLParser):
    def __init__(self,out,attrs):
        HTMLParser.__init__(self)
        self.out = out
        self.att = attrs
    def handle_data(self, data):
        self.out.append(data)

schools = {
    'utm': {'subject':'{"strUiCulture":"en-US","datasourceId":"4520","colId":"1","ddlId":"ddlFbvSubjectsValues","maxItemsParPage":"1000","pageCourante":1,"strFiltre":"","boolPleaseSelect":"true","boolAll":"true","intBlocId":"2480","clearHTML":"false","userid":"YieFNIJw38oVrv55lcluAvIbMYJxAf4UhqAu"}', 
            'data': '{"strUiCultureIn":"en-US","datasourceId":"4520","blockId":"2480","subjectColId":"1","subjectValue":"%s","detailValue":"____[-1]____","gridId":"fbvGrid","pageActuelle":1,"strOrderBy":["col_1","asc"],"strFilter":["","","ddlFbvColumnSelectorLvl1",""],"sortCallbackFunc":"__getFbvGrid","userid":"YieFNIJw38oVrv55lcluAvIbMYJxAf4UhqAu","pageSize":2000}'},
    'aands': {'subject':'{"strUiCulture":"en-US","datasourceId":"7160","colId":"1","ddlId":"ddlFbvSubjectsValues","maxItemsParPage":"1000","pageCourante":1,"strFiltre":"","boolPleaseSelect":"true","boolAll":"true","intBlocId":"2330","clearHTML":"false","userid":"8ImF_6RW3lO1rIudLcxUIvUBUnJK_n45Hz_u"}', 
            'data': '{"strUiCultureIn":"en-US","datasourceId":"7160","blockId":"2330","subjectColId":"1","subjectValue":"%s","detailValue":"____[-1]____","gridId":"fbvGrid","pageActuelle":1,"strOrderBy":["col_1","asc"],"strFilter":["","","ddlFbvColumnSelectorLvl1",""],"sortCallbackFunc":"__getFbvGrid","userid":"8ImF_6RW3lO1rIudLcxUIvUBUnJK_n45Hz_u","pageSize":2000}'},
    'utsc': {'subject':'{"strUiCulture":"en-US","datasourceId":"5070","colId":"1","ddlId":"ddlFbvSubjectsValues","maxItemsParPage":"1000","pageCourante":1,"strFiltre":"","boolPleaseSelect":"true","boolAll":"true","intBlocId":"2420","clearHTML":"false","userid":"8ImF_6RW3lO1rIudLcxUIvUBUnJK_n45Hz_u"}', 
            'data': '{"strUiCultureIn":"en-US","datasourceId":"5070","blockId":"2420","subjectColId":"1","subjectValue":"%s","detailValue":"____[-1]____","gridId":"fbvGrid","pageActuelle":1,"strOrderBy":["col_1","asc"],"strFilter":["","","ddlFbvColumnSelectorLvl1",""],"sortCallbackFunc":"__getFbvGrid","userid":"8ImF_6RW3lO1rIudLcxUIvUBUnJK_n45Hz_u","pageSize":2000}'},
    'asande': {'subject':'{"strUiCulture":"en-US","datasourceId":"7490","colId":"1","ddlId":"ddlFbvSubjectsValues","maxItemsParPage":"1000","pageCourante":1,"strFiltre":"","boolPleaseSelect":"true","boolAll":"true","intBlocId":"2460","clearHTML":"false","userid":"8ImF_6RW3lO1rIudLcxUIvUBUnJK_n45Hz_u"}', 
            'data': '{"strUiCultureIn":"en-US","datasourceId":"7490","blockId":"2460","subjectColId":"1","subjectValue":"%s","detailValue":"____[-1]____","gridId":"fbvGrid","pageActuelle":1,"strOrderBy":["col_1","asc"],"strFilter":["","","ddlFbvColumnSelectorLvl1",""],"sortCallbackFunc":"__getFbvGrid","userid":"8ImF_6RW3lO1rIudLcxUIvUBUnJK_n45Hz_u","pageSize":2000}'},
    'asande_grad': {'subject':'{"strUiCulture":"en-US","datasourceId":"5180","colId":"1","ddlId":"ddlFbvSubjectsValues","maxItemsParPage":"1000","pageCourante":1,"strFiltre":"","boolPleaseSelect":"true","boolAll":"true","intBlocId":"2390","clearHTML":"false","userid":"8ImF_6RW3lO1rIudLcxUIvUBUnJK_n45Hz_u"}', 
            'data': '{"strUiCultureIn":"en-US","datasourceId":"5180","blockId":"2390","subjectColId":"1","subjectValue":"%s","detailValue":"____[-1]____","gridId":"fbvGrid","pageActuelle":1,"strOrderBy":["col_1","asc"],"strFilter":["","","ddlFbvColumnSelectorLvl1",""],"sortCallbackFunc":"__getFbvGrid","userid":"8ImF_6RW3lO1rIudLcxUIvUBUnJK_n45Hz_u","pageSize":2000}'},
    'sw': {'subject':'{"strUiCulture":"en-US","datasourceId":"6610","colId":"6","ddlId":"ddlFbvSubjectsValues","maxItemsParPage":"1000","pageCourante":1,"strFiltre":"","boolPleaseSelect":"true","boolAll":"true","intBlocId":"2470","clearHTML":"false","userid":"8ImF_6RW3lO1rIudLcxUIvUBUnJK_n45Hz_u"}', 
            'data': '{"strUiCultureIn":"en-US","datasourceId":"6610","blockId":"2470","subjectColId":"6","subjectValue":"%s","detailValue":"____[-1]____","gridId":"fbvGrid","pageActuelle":1,"strOrderBy":["col_6","asc"],"strFilter":["","","ddlFbvColumnSelectorLvl1",""],"sortCallbackFunc":"__getFbvGrid","userid":"8ImF_6RW3lO1rIudLcxUIvUBUnJK_n45Hz_u","pageSize":2000}'},
    'info': {'subject':'{"strUiCulture":"en-US","datasourceId":"7380","colId":"6","ddlId":"ddlFbvSubjectsValues","maxItemsParPage":"1000","pageCourante":1,"strFiltre":"","boolPleaseSelect":"true","boolAll":"true","intBlocId":"2400","clearHTML":"false","userid":"exvFBeH63YWTrOkmJc90xv_q0lJl7c4IPoau"}', 
            'data': '{"strUiCultureIn":"en-US","datasourceId":"7380","blockId":"2400","subjectColId":"6","subjectValue":"%s","detailValue":"____[-1]____","gridId":"fbvGrid","pageActuelle":1,"strOrderBy":["col_6","asc"],"strFilter":["","","ddlFbvColumnSelectorLvl1",""],"sortCallbackFunc":"__getFbvGrid","userid":"exvFBeH63YWTrOkmJc90xv_q0lJl7c4IPoau","pageSize":2000}'},
}

cc = re.compile(r"'([A-Za-z]{3}\d\d\d(?:\d(?:H|Y)|(?:(?:H|Y)[\d\S]?)))'")
searcher = re.compile(r'"value": "([A-Za-z ]*)"')
header = re.compile(r'<a [^>]*>(?:<span[^<]*<\/span>)?([^<]+)')

def parse(header,body):
    code = cc.search(header).group(1)
    out,att= [],[]
    c = courseparse(out,att)
    c.feed(body)
    return ','.join([code] + out) + '\n'

def bound(scraped):
    return scraped.index('</tr>')

def getsubjects(school):
    payload = schools[school]['subject']
    r = requests.post('https://course-evals.utoronto.ca/BPI/fbview-WebService.asmx/getSubjectsValues', data=json.loads(payload))
    return [i.strip() for i in searcher.findall(r.text) if i.strip()]

def clean(string):
    string = string.strip().replace(',','').replace('.','').replace('’','').replace('/','_')
    if '-' in string:
        return string[string.find('-')+2:]
    return string


def scrape_header(school,department):
    departments = getsubjects(school)
    dump = (schools[school]['data'] % department).replace('2000','5')
    r = requests.post('https://course-evals.utoronto.ca/BPI/fbview-WebService.asmx/getFbvGrid', data=json.loads(dump))
    scraped = r.text.replace('&lt;','<').replace('&gt;','>').replace('&amp;','&')
    lim = bound(scraped)+1
    scraped = scraped[:lim]
    return ['Code']+[clean(i) for i in header.findall(scraped)]

def scrape_school(school, department, dump_s, header):
    r = requests.post('https://course-evals.utoronto.ca/BPI/fbview-WebService.asmx/getFbvGrid', data=json.loads(dump_s))
    scraped = r.text.replace('&lt;','<').replace('&gt;','>').replace('&amp;','&')
    lim = bound(scraped)+6
    scraped = scraped[lim:].split('\n')
    chunks = [scraped[x:x+2] for x in range(0, len(scraped), 2)]
    pth = '{0}/{1}_raw'.format(school, department)
    with open(pth, 'w') as f:
        f.write(','.join(header) + '\n')
        for i in chunks:
            try:
                f.write(parse(i[0],i[1]))
            except:
                pprint.pprint(i)
                break

def scrape_helper(school):
    departments = getsubjects(school)
    helper = scrape_header(school, departments[0])
    for department in departments:
        dump = schools[school]['data'] % department
        print(school, department)
        scrape_school(school, department, dump, helper)

for school in schools:
    if school != 'info': continue
    if not os.path.exists(school):
        os.makedirs(school)
    scrape_helper(school)