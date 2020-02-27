import os
from pymongo import MongoClient
from csv import DictReader

client = MongoClient(os.environ.get('CONNECTSTR'))

db = client['evals']

for scl in ('aands','asande', 'asande_grad', 'sw', 'info', 'utm', 'utsc'):
    collection = db[scl]
    collection.drop()
    pth = scl + '/'
    for dpt_p in os.listdir(pth):
        dpt_name = dpt_p[:-4]
        print("{0} {1} start".format(scl, dpt_name))
        with open(pth+dpt_p, newline='') as csvfile:
            eval_reader = [dict(i) for i in DictReader(csvfile)]
            for row in eval_reader: row['Department'] = dpt_name
            collection.insert_many(eval_reader)
                            