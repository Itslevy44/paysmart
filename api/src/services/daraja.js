const axios = require('axios');
const moment = require('moment'); // You might need moment or just standard Date

// Environment variables should be loaded
// Environment variables should be loaded
const consumerKey = process.env.DARAJA_CONSUMER_KEY;
const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
const passkey = process.env.DARAJA_PASSKEY;
const shortCode = process.env.DARAJA_SHORTCODE;
const callbackUrl = process.env.DARAJA_CALLBACK_URL; // e.g., https://api.paysmart.co.ke/api/callbacks/mpesa
const env = process.env.DARAJA_ENV || 'sandbox'; // 'sandbox' or 'production'

const getBaseUrl = () => {
    return env === 'production'
        ? 'https://api.safaricom.co.ke'
        : 'https://sandbox.safaricom.co.ke';
};

// Function to get Access Token
const getAccessToken = async () => {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    try {
        const response = await axios.get(`${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Daraja Auth Error", error.response ? error.response.data : error.message);
        throw new Error('Failed to get access token');
    }
};

// Function to initiate STK Push
exports.initiateSTKPush = async (phoneNumber, amount, reference) => {
    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14); // YYYYMMDDHHmmss
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    const payload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline', // or CustomerBuyGoodsOnline
        Amount: amount,
        PartyA: phoneNumber, // Phone number sending money
        PartyB: shortCode,   // Shortcode receiving money
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: reference,
        TransactionDesc: 'Payment to PaySmart'
    };

    try {
        const response = await axios.post(`${getBaseUrl()}/mpesa/stkpush/v1/processrequest`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Daraja STK Push Error", error.response ? error.response.data : error.message);
        throw new Error('Failed to initiate STK Push');
    }
};
