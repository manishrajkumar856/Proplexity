// import 'dotenv/config';

function handleError(err, req, res, next){
    console.log(err);
    const response = {
        message: err.message,
    }

    console.log("Error: ", err);
    console.log("Stack: ", err.stack);
    console.log("Status: ", err.status);

    if(process.env.NODE_ENVIRONMENT == 'development'){
        response.stack = err.stack;
    }

    return res.status(err.status).json(response);
}

export default handleError;