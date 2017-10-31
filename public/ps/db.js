'use strict';

var myDB = {
    name: 'img_database',
    version: 4,
    db: null,
    storename: 'Imgstore',
    keypath: 'id'
};

var INDEXDB = {
    indexedDB: window.indexedDB || window.webkitindexedDB,
    IDBKeyRange: window.IDBKeyRange || window.webkitIDBKeyRange,
    openDB: function openDB() {
        //建立或打开数据库，建立对象存储空间(ObjectStore)
        var self = this;
        var request = self.indexedDB.open(myDB.name, myDB.version);
        request.onerror = function (e) {
            console.log(e.currentTarget.error.message);
        };
        var promise = new Promise(function (resolve) {
            request.onsuccess = function (e) {
                myDB.db = e.target.result;
                console.log('成功建立并打开数据库:' + myDB.name + ' version' + myDB.version);
                resolve();
            };
        });
        request.onupgradeneeded = function (e) {
            var db = e.target.result,
                transaction = e.target.transaction,
                store;
            if (!db.objectStoreNames.contains(myDB.storename)) {
                //没有该对象空间时创建该对象空间
                store = db.createObjectStore(myDB.storename, { autoIncrement: true });
                console.log('成功建立对象存储空间：' + myDB.storename);
            }
        };

        return promise;
    },
    getItemMount: function getItemMount(cb) {
        var store = myDB.db.transaction(myDB.storename, 'readonly').objectStore(myDB.storename);
        var cursor = store.openCursor();
        var mount = 0;
        var promise = new Promise(function (resolve) {
            cursor.onsuccess = function (evt) {
                var res = evt.target.result;
                if (res) {
                    mount++;
                    res.continue();
                } else {
                    resolve(mount);
                }
            };
        });
        promise.then(function (mount) {
            cb(mount);
        });
    },
    getLastitem: function getLastitem(cb) {
        //获取最近一个条目
        //要不就遍历到最后一个 要不就拿第一个然后倒着取
        var store = myDB.db.transaction(myDB.storename, 'readonly').objectStore(myDB.storename);
        var cursor = store.openCursor();
        var lastval = null;
        cursor.onsuccess = function (evt) {
            var res = evt.target.result;
            if (res) {
                lastval = res;
                console.log('获取indexedDB中的条目。。。注意超过10个会清空', lastval);
                res.continue();
            } else {
                lastval ? cb ? cb(lastval.value) : null : null;
            }
        };
    },
    deletedb: function deletedb() {
        //删除数据库
        var self = this;
        self.indexedDB.deleteDatabase(myDB.name);
        console.log(myDB.name + '数据库已删除');
    },
    closeDB: function closeDB() {
        //关闭数据库
        myDB.db.close();
        console.log('数据库已关闭');
    },
    addData: function addData(data) {
        //添加数据，重复添加会报错
        //如果达到上限 清空所有操作记录（下次进来还有上次记录，因为下面要存储，不用去掉提示）
        INDEXDB.getItemMount(function (mount) {
            if (mount >= 10) {
                INDEXDB.clearData();
            }
            for (var i = 0; i < data.length; i++) {
                var store = store = myDB.db.transaction(myDB.storename, 'readwrite').objectStore(myDB.storename),
                    request;
                request = store.add(data[i]);
                request.onerror = function () {
                    console.error('add添加数据库中已有该数据');
                };
                request.onsuccess = function () {
                    console.log('add添加数据已存入数据库');
                    alert('保存成功！');
                };
            }
        });
    },
    putData: function putData(data, cb) {
        //添加数据，重复添加会更新原有数据
        var store = store = myDB.db.transaction(myDB.storename, 'readwrite').objectStore(myDB.storename),
            request;
        for (var i = 0; i < data.length; i++) {
            request = store.put(data[i]);
            request.onerror = function () {
                console.error('put添加数据库中已有该数据');
            };
            request.onsuccess = function () {
                cb ? cb() : null;
                console.log('put添加数据已存入数据库');
            };
        }
    },
    getDataByKey: function getDataByKey(key, cb) {
        //根据存储空间的键找到对应数据
        var store = myDB.db.transaction(myDB.storename, 'readwrite').objectStore(myDB.storename);
        var request = store.get(key);
        request.onerror = function () {
            console.error('getDataByKey error');
        };
        request.onsuccess = function (e) {
            var result = e.target.result;
            cb ? cb(result) : null;
            console.log('查找数据成功');
            console.log(result);
        };
    },
    deleteData: function deleteData(key) {
        //删除某一条记录
        var store = store = myDB.db.transaction(myDB.storename, 'readwrite').objectStore(myDB.storename);
        store.delete(key);
        console.log('已删除存储空间' + myDB.storename + '中' + key + '记录');
    },
    clearData: function clearData() {
        //删除存储空间全部记录
        var store = myDB.db.transaction(myDB.storename, 'readwrite').objectStore(myDB.storename);
        store.clear();
        console.log('已删除存储空间' + myDB.storename + '全部记录');
    }
};
function save(data) {
    // var imgData = [{
    //     id: 1001,
    //     name: "Byron",
    //     age: 24
    // }, {
    //     id: 1002,
    //     name: "Frank",
    //     age: 30
    // }, {
    //     id: 1003,
    //     name: "Aaron",
    //     age: 26
    // }];
    INDEXDB.addData(data);
}
// INDEXDB.openDB();