export interface Prestamo {
  id?: number;
  clientId: number | null;
  gameId: number | null;
  clientName?: string;
  gameTitle?: string;
  startDate: Date;
  endDate: Date;
}
