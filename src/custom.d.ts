declare module '@mui/x-data-grid' {
  export interface GridColDef {
    field: string;
    headerName?: string;
    width?: number;
    flex?: number;
    renderCell?: (params: GridRenderCellParams<any>) => React.ReactNode;
  }

  export interface GridRenderCellParams<T = any> {
    value: T;
    row: any;
    field: string;
  }

  export class DataGrid extends React.Component<any> {}
}

declare module 'framer-motion'; 