
export interface Meeting {
  id: string;
  who: string;
  where: string;
  when: Date;
  why: string;
  duration: number; // in minutes
}
