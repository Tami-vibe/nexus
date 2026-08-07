export interface CheckoutInput {
  holdId: string;
  tenantId: string;
  amountCents: number;
  currency: string;
  customerPhone: string;
}

export interface CheckoutResult {
  provider: "mock" | "stripe";
  status: "MOCK_PAID" | "REQUIRES_PAYMENT" | "PAID" | "FAILED";
  payment_intent_id?: string;
  client_secret?: string;
  checkout_url?: string;
}

export interface PaymentProvider {
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
}

export class MockPaymentProvider implements PaymentProvider {
  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    return {
      provider: "mock",
      status: "MOCK_PAID",
      payment_intent_id: `mock_${input.holdId}`,
    };
  }
}

/** Stripe Connect seam — activates when STRIPE_SECRET_KEY is present. */
export class StripeConnectProvider implements PaymentProvider {
  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return new MockPaymentProvider().createCheckout(input);
    }

    const params = new URLSearchParams({
      amount: String(input.amountCents),
      currency: input.currency,
      "metadata[hold_id]": input.holdId,
      "metadata[tenant_id]": input.tenantId,
      "automatic_payment_methods[enabled]": "true",
    });
    if (process.env.STRIPE_CONNECT_ACCOUNT_ID) {
      params.set(
        "transfer_data[destination]",
        process.env.STRIPE_CONNECT_ACCOUNT_ID,
      );
    }

    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!res.ok) {
      return { provider: "stripe", status: "FAILED" };
    }

    const data = (await res.json()) as {
      id: string;
      client_secret: string;
      status: string;
    };

    return {
      provider: "stripe",
      status: data.status === "succeeded" ? "PAID" : "REQUIRES_PAYMENT",
      payment_intent_id: data.id,
      client_secret: data.client_secret,
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  if (process.env.STRIPE_SECRET_KEY) return new StripeConnectProvider();
  return new MockPaymentProvider();
}
