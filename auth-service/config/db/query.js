import pool from './index.js';
const executeQuery = async (sql, values) => {
  
  try {
    return   new Promise((resolve,reject)=>{
      pool.query(sql,values,(err,result)=>{
         if(err){
            reject(result);
            return;
        }  
        resolve(result)
      })
    })
  } catch (error) {
    console.log('error:',error)
  }
  

};

export default executeQuery ;
