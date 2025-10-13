// netlify/functions/api.js - The Lambda Handler
// const serverless = require('serverless-http');
import serverless from 'serverless-http'
import {app} from '../../server.js'

// Note: Mongoose connection should persist across function invocations in Netlify, 
// but if you experience issues, you might need a simple connection check here.

// Wrap the Express app to create a handler function
const handler = serverless(app);

// Export the handler
export default async (event, context) => {
    // Optionally: Log the event details for debugging
    // console.log("EVENT:", JSON.stringify(event, null, 2)); 

    // Set context.callbackWaitsForEmptyEventLoop = false 
    // to allow Lambda to send a response before the database connection closes.
    context.callbackWaitsForEmptyEventLoop = false; 

    return handler(event, context);
};