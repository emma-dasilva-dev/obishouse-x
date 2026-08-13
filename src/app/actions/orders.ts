'use server';

export type CreateOrderInput = {
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  order: {
    ticketId: string;
    quantity: number;
    notes?: string;
  };
  payment: {
    currency: string;
    provider: string;
  };
};

export type CreateOrderResult =
  | { ok: true; transactionId: string; amount: number }
  | {
      ok: false;
      error: 'missing_api_url' | 'invalid_response' | 'request_failed';
      message?: string;
    };

function getApiBase(): string {
  return (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
}

async function parseOrderApiErrorBody(res: Response): Promise<string | undefined> {
  try {
    const body = (await res.json()) as {
      message?: string;
      errors?: Array<{ message?: string }>;
    };
    if (body.errors?.length) {
      const msg = body.errors.map((e) => e.message).filter(Boolean).join(' ');
      if (msg) return msg;
    }
    if (body.message) return body.message;
  } catch {
    // ignore
  }
  return undefined;
}

export async function createOrderAction(input: CreateOrderInput): Promise<CreateOrderResult> {
  const apiBase = getApiBase();
  if (!apiBase) {
    return { ok: false, error: 'missing_api_url' };
  }

  try {
    const res = await fetch(`${apiBase}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const message = await parseOrderApiErrorBody(res);
      return { ok: false, error: 'request_failed', message };
    }

    const json = (await res.json()) as {
      data?: {
        paymentIntent?: {
          transactionId?: string;
          amount?: number | string;
        };
      };
    };
    const transactionId = json.data?.paymentIntent?.transactionId;
    const rawAmount = json.data?.paymentIntent?.amount;
    const amount =
      typeof rawAmount === 'number'
        ? rawAmount
        : rawAmount != null
          ? Number(rawAmount)
          : NaN;

    if (!transactionId || !Number.isFinite(amount) || amount <= 0) {
      return { ok: false, error: 'invalid_response' };
    }
    return { ok: true, transactionId, amount };
  } catch(error) {
    console.error(error);
    return { ok: false, error: 'request_failed' };
  }
}
