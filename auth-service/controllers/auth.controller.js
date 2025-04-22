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
     
        const {Per_Password,Per_Roles,Per_Status,Per_UserId,Per_RefreshToken} = result[0][0];
        if(Per_Status=='DeActive'){
            return res.status(401).json({message:'User is Deactivated'});
        }
        bcrypt.compare(password,Per_Password,async (err,isMatch)=>{
                    if(err){
                        return res.status(500).json({message:'Internal server error'});
                    }
                    if(!isMatch){
                        return res.status(401).json({message:'Invalid credentials'});
                    }
                    const {accessToken,refreshToken}=generateTokens({Per_UserId,Per_Roles});
                       
                    const [resultSets]= await executeQuery('CALL UserRefreshTokenUpdate(?, ?, @Per_Result);',[Per_UserId, refreshToken]);
                   

                    const Per_Result = resultSets[0]?.Per_Result;
                    
                    if (Per_Result === '1') {
                        res.cookie('accessToken', accessToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none',
                            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                        });
                        return res.status(200).json({ message: 'Login successful',role:Per_Roles });
                    } else {
                        return res.status(500).json({ message: 'Failed to update refresh token' });
                    }
                    
        });

        // if(result[0][0].Per_Status=='-1'){
        //     return res.status(401).json({message:'Invalid credentials'});
        // }
        // bcrypt.compare(password,result[0][0].Per_Password,async (err,isMatch)=>{
        //     if(err){
        //         console.log('error:',err);
        //         return res.status(500).json({message:'Internal server error'});
        //     }
        //     if(!isMatch){
        //         return res.status(401).json({message:'Invalid credentials'});
        //     }
        //     const {accessToken,refreshToken}=generateTokens(result[0][0]);
        //     const userId=result[0][0].Per_UserId;
        //     await executeQuery('call UpdateRefreshToken(?,?)',[userId,refreshToken]);
        //     res.cookie('accessToken',accessToken,{httpOnly:true,secure:true,sameSite:'none',maxAge:7*24*60*60*1000});
        //     res.status(200).json({
        //         accessToken,user:{
        //             userName:result[0][0].Per_UserName,role:result[0][0].Per_Roles
        //         }
        //     })
        // });
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