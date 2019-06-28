/* 
    promise 解决回调地狱
    1.顺序执行
    2.并发执行
*/
const fs = require('fs');
/* 1.顺序执行 */
function read( url ) {
    return new Promise( (resolve,reject ) => {
        fs.readFile( url,'utf8',( err,data ) => {
            if( err ) reject( err );
            resolve( data );
        })
    })
};
read(A).then( ( data ) => {
    return read(B)
}).then( ( data => {
    return read(C)
})).catch( ( reason ) => {
    console.log( reason)
});
/* 2.并发执行 */
    /* 使用发布订阅/观察者模式 */
let pubsub = {
    arry:[],
    emit(){
        this.arry.forEach( fn => fn() );
    },
    on(fn){
        this.arry.push(fn);
    }
};
let data = [];
pubsub.on( () => {
    if( data.length === 3 ){
        console.log( data )
    }
});
fs.readFile('./A.txt','utf-8',( err,value ) => {
    data.push( value );
    pubsub.emit();
});
fs.readFile('./B.txt','utf-8',( err,value ) => {
    data.push( value );
    pubsub.emit();
});
fs.readFile('./C.txt','utf-8',( err,value ) => {
    data.push( value );
    pubsub.emit();
});
    /* 使用Promise.all */
Promise.all([
    read('./A.txt'),
    read('./B.txt'),
    read('./C.txt'),
]).then( data => {
    console.log( data )
}).catch( err => console.lof( err ));
    /* 使用async */
async function readAsync() {
    let data = await ProcessingInstructionmise.all([
        read('./A.txt'),
        read('./B.txt'),
        read('./C.txt'),
    ]);
    return data;
};
readAsync().then( data => console.log( data ));
/* 如何实现 promise.race */
Promise.race = function (promises) {
    //promises 必须是一个可遍历的数据结构，否则抛错
    return new Promise((resolve, reject) => {
        if (typeof promises[Symbol.iterator] !== 'function') {
            //真实不是这个错误
            Promise.reject('args is not iteratable!');
        }
        if (promises.length === 0) {
            return;
        } else {
            for (let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then((data) => {
                    resolve(data);
                    return;
                }, (err) => {
                    reject(err);
                    return;
                });
            }
        }
    });
}