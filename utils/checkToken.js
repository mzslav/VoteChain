import jwt from 'jsonwebtoken';

export default(res,req,next) => {
   
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if(token){

        try {
            const decoded = jwt.verify(token,process.env.JWT_CODE);
            req.metamaskAdress = decoded.metamaskAdress;
            next();

        }
         catch (error) {
            return res.status(403).json({
                message: 'token enspiredddd',
            });

        }
    }else{
        return res.status(403).json({
            message: 'token enspired',
        });
    }

}