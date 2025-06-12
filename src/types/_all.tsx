export interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  permissions: any[];
}

export type Transaction = {
  id: string;
  date: string;
  time: string;
  amount: string;
  fee: string;
  total: string;
  paymentMethod: string;
  recipient: string;
  status: string;
  authCode: string;
};
