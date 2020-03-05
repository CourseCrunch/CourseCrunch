function constructQuery(columnList, paramList, uuid) {
    let query = 'UPDATE CC_USER_INFO SET ';
    return new Promise(((resolve, reject) => {
        try {
            if (columnList.length > 1) {
                query += '(';
                for (let i = 0; i < columnList.length; i += 1) {
                    if (i < (columnList.length - 1)) {
                        query += columnList[i];
                        query += ', ';
                    } else {
                        query += columnList[i];
                        query += ') = (\'';
                    }
                }

                for (let j = 0; j < paramList.length; j += 1) {
                    if (j < (paramList.length - 1)) {
                        query += paramList[j];
                        query += '\', \'';
                    } else {
                        query += paramList[j];
                        query += '\') WHERE ID = \'';
                    }
                }
            } else {
                query += columnList[0];
                query += ' = \'';
                query += paramList[0];
                query += '\' WHERE ID = \'';
            }

            query += uuid;
            query += '\' ';
            resolve(query);
        } catch (e) {
            reject(e);
        }
    }));
}
module.exports = {
    constructQuery,
};
