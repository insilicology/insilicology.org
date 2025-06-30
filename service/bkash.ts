"use server";
import supabase from "@/lib/supabase";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface BkashConfig {
  base_url: string | undefined;
  username: string | undefined;
  password: string | undefined;
  app_key: string | undefined;
  app_secret: string | undefined;
  grant_token_url: string | undefined;
  create_payment_url: string | undefined;
  execute_payment_url: string | undefined;
}

interface PaymentDetails {
  amount: number; // your product price
  callbackURL: string; // your callback route
  orderID: string; // your orderID
  reference: string;
  name: string;
  email: string;
  phone: string;
}

export async function createPayment(
  bkashConfig: BkashConfig,
  paymentDetails: PaymentDetails
) {
  try {
    const { amount, callbackURL, orderID, reference } = paymentDetails;
    
    if (!amount) {
      return {
        statusCode: 2065,
        statusMessage: "amount required",
      };
    } else {
      if (amount < 1) {
        return {
          statusCode: 2065,
          statusMessage: "minimum amount 1",
        };
      }
    }

    if (!callbackURL) {
      return {
        statusCode: 2065,
        statusMessage: "callbackURL required",
      };
    }

    // First, get the token
    const token = await grantToken(bkashConfig);
    if (!token) {
      return {
        statusCode: 500,
        statusMessage: "Failed to get authentication token",
      };
    }

    // Create payment with the token
    const response = await axios.post(
      bkashConfig.create_payment_url || `${bkashConfig?.base_url}/tokenized/checkout/create`,
      {
        mode: "0011",
        payerReference: reference || "01000000000",
        callbackURL: callbackURL,
        merchantAssociationInfo: "MI05MID54RF09123456One",
        amount: amount.toString(),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: orderID || "Inv0124"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": token,
          "X-App-Key": bkashConfig?.app_key
        },
      }
    );

    return response?.data;
  } catch (e) {
    console.error("Create Bkash Payment Error:", e);
    return e;
  }
}

export async function executePayment(
  bkashConfig: BkashConfig,
  paymentID: string
) {
  try {
    // Get token for execute payment
    const token = await grantToken(bkashConfig);
    if (!token) {
      return {
        statusCode: 500,
        statusMessage: "Failed to get authentication token",
      };
    }

    const response = await axios.post(
      bkashConfig.execute_payment_url || `${bkashConfig?.base_url}/tokenized/checkout/execute`,
      {
        paymentID,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": token,
          "X-App-Key": bkashConfig?.app_key
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Error from bkash executePayment: ", error);
    return null;
  }
}

const grantToken = async (bkashConfig: BkashConfig) => {
  try {
    // Check if we have a valid cached token
    const findToken = await supabase.from("bkash").select("*").single();

    if (findToken?.data && findToken.data?.updated_at < new Date(Date.now() - 3600000)) {
      // Token is still valid (less than 1 hour old)
      return findToken.data?.authToken;
    }

    // Get new token
    return await setToken(bkashConfig);
  } catch (e) {
    console.log("Error in grantToken:", e);
    return await setToken(bkashConfig);
  }
};

const setToken = async (bkashConfig: BkashConfig) => {
  try {
    console.log("Requesting new bKash token...");
    console.log("Using URL:", bkashConfig.grant_token_url);
    
    const response = await axios.post(
      bkashConfig.grant_token_url || `${bkashConfig?.base_url}/tokenized/checkout/token/grant`,
      {
        app_key: bkashConfig?.app_key,
        app_secret: bkashConfig?.app_secret
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "username": bkashConfig?.username,
          "password": bkashConfig?.password
        },
      }
    );

    console.log("Token response:", response?.data);

    if (response?.data?.id_token) {
      // Cache the token
      const findToken = await supabase.from("bkash").select("*").single();
      
      if (findToken?.data) {
        await supabase.from("bkash").update({
          authToken: response?.data?.id_token,
          updated_at: new Date().toISOString()
        }).eq('id', findToken.data.id);
      } else {
        await supabase.from("bkash").insert({
          authToken: response?.data?.id_token,
          updated_at: new Date().toISOString()
        });
      }
      
      return response?.data?.id_token;
    }
    
    return null;
  } catch (error) {
    console.error("Error setting token:", error);
    return null;
  }
};