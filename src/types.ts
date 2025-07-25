export interface Plan {
  name: string;
  slots: number;
  price: number;
  originalSlots?: number;
}

export enum Step {
  Hero = 0,
  Plans = 1,
  Contacts = 2,
  Payment = 3,
}
