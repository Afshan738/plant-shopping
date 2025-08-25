const axios = require("axios");
const User = require("../model/user");
const crypto = require("crypto");
const getPaymentKey = async (amountInPKR, orderId, userId) => {
  const apiKey = process.env.PAYMOB_API_KEY;
  const integrationId = process.env.PAYMOB_INTEGRATION_ID;

  try {
    const authResponse = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      {
        api_key: apiKey,
      }
    );
    const authToken = authResponse.data.token;

    const orderResponse = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: amountInPKR * 100,
        currency: "EGP",
        merchant_order_id: orderId,
      }
    );
    const paymobOrderId = orderResponse.data.id;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found for billing data.");
    }

    const billingData = {
      first_name: user.name.split(" ")[0] || "NA",
      last_name: user.name.split(" ").slice(1).join(" ") || "NA",
      email: user.email,
      phone_number: "+921111111111",
      apartment: "NA",
      floor: "NA",
      street: "NA",
      building: "NA",
      shipping_method: "NA",
      postal_code: "NA",
      city: "NA",
      country: "NA",
      state: "NA",
    };

    const paymentKeyResponse = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: authToken,
        amount_cents: amountInPKR * 100,
        expiration: 3600,
        order_id: paymobOrderId,
        billing_data: billingData,
        currency: "EGP",
        integration_id: integrationId,
        lock_order_when_paid: "false",
      }
    );

    return paymentKeyResponse.data.token;
  } catch (error) {
    console.error(
      "Error during Paymob handshake:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to initiate payment with Paymob.");
  }
};

module.exports = {
  getPaymentKey,
};
const verifyCallback = (callbackData) => {
  console.log("--- Verifying Paymob HMAC signature ---");
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  const receivedHmac = callbackData.hmac;

  const data =
    callbackData.obj.amount_cents.toString() +
    callbackData.obj.created_at +
    callbackData.obj.currency +
    callbackData.obj.error_occured.toString() +
    callbackData.obj.has_parent_transaction.toString() +
    callbackData.obj.id.toString() +
    callbackData.obj.integration_id.toString() +
    callbackData.obj.is_3d_secure.toString() +
    callbackData.obj.is_auth.toString() +
    callbackData.obj.is_capture.toString() +
    callbackData.obj.is_refunded.toString() +
    callbackData.obj.is_standalone_payment.toString() +
    callbackData.obj.is_voided.toString() +
    callbackData.obj.order.id.toString() +
    callbackData.obj.owner.toString() +
    callbackData.obj.pending.toString() +
    callbackData.obj.source_data.pan +
    callbackData.obj.source_data.sub_type +
    callbackData.obj.source_data.type +
    callbackData.obj.success.toString();

  const calculatedHmac = crypto
    .createHmac("sha512", hmacSecret)
    .update(data)
    .digest("hex");

  if (receivedHmac === calculatedHmac) {
    console.log(" > HMAC signature is VALID.");
    return true;
  } else {
    console.error(
      " > HMAC signature is INVALID. Callback might be fraudulent."
    );
    return false;
  }
};

module.exports = {
  getPaymentKey,
  verifyCallback,
};
