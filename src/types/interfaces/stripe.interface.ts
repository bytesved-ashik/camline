export type CreatePaymentMethod = {
  data: CreatePaymentMethodData[];
  has_more: boolean;
  url: string;
};
export type CreatePaymentMethodData = {
  id: string;
  object: string;
  billing_details: {
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      postal_code: string;
      state: string;
    };
    email: string;
    name: string;
    phone: string;
  };
  card: {
    brand: string;
    checks: {
      address_line1_check: string;
      address_postal_code_check: string;
      cvc_check: string;
    };
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    generated_from: null;
    last4: string;
  };
  created: number;
  customer: string;
  livemode: false;
  type: string;
};
