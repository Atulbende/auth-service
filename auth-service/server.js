

import './loadenv.js';
import {app} from './app.js';
import sequelize from './config/db.config.js';
sequelize.sync({alter:true}).then((data)=>{
    console.log('database connected');
    const PORT=process.env.PORT || 3306;
app.listen(PORT,()=>console.log(`Auth service run on port ${PORT}`));
})
