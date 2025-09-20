import { INavData } from '@coreui/angular';

declare module '@coreui/angular' {
  interface INavData {
    permission?: string[]; // Permissão necessária para ver este item
  }
}