export type DatasetType = {
  id: string;
  friendlyName: string;
  labels: string[];
  description: string;
  tables?: TableType[];
};

export type TableReferenceType = {
  projectId: string;
  datasetId: string;
  tableId: string;
};

export type TableType = {
  id: string;
  tableReference: TableReferenceType;
};
