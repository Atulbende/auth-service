import bcrypt from 'bcryptjs';
import executeQuery from '../config/db/query.js';
import {generateTokens} from '../services/token.service.js';
const signup  = async (req, res) => {   
        try {
            const {email,userName,password } = req.body;
            const hashedPassword=await bcrypt.hash(password,10);
            console.log('hashedPassword:',hashedPassword);
            const result = await executeQuery('call SignupSave(?,?,?,@Per_Result);',[email,userName,hashedPassword]);
            console.log('hashedPassword:',result[0][0].Per_Result);

            if(result[0][0].Per_Result=='-1'){
                return res.status(409).json({message:'User already exist'});
            }else if(result[0][0].Per_Result=='1'){
                res.status(201).json({message:'User created successfully'});
        }
           
        
        } catch (err) {
            console.log('Singup Error:',err);
        }

}

const login = async (req, res) => {
    try {
        const {userName,password } = req.body;
        const result = await  executeQuery('call LoginAuth(?,@Per_Password,@Per_Roles,@Per_Status,@Per_UserId,@Per_RefreshToken);',[userName]);
        console.log('result:',result[0][0]);
        // if(!user){
        //     return res.status(404).json({message:'User not found'});
        // }
        // const isMatch=await bcrypt.compare(password,user.password);
        // if(!isMatch){
        //     return res.status(401).json({message:'Invalid credentials'});
        // }
        // const {accessToken,refreshToken}=generateTokens(user);
        // user.refreshToken=refreshToken;
        // await user.save();
        // res.cookie('accessToken',accessToken,{httpOnly:true,secure:true,sameSite:'none',maxAge:7*24*60*60*1000});
        // res.status(200).json({
        // accessToken,user:{
        //     userName:user.userName,role:user.role        }
        // })

    }catch (err) {
        console.log('Login Error:',err);
    }
}

export {signup ,login};