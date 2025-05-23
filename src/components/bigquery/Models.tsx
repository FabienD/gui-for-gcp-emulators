export type DatasetIdType = {
  id: string;
}

export type TableIdType = {
  id: string;
}

export type DatasetType = DatasetIdType & {
  friendlyName: string;
  labels: string[];
  description: string;
  tables?: TableType[];
};

export type TableReferenceType = {
  projectId: string;
  datasetId: DatasetIdType;
  tableId: TableIdType;
};

export type SchemaType = {
  fields: {
    name: string;
    type: string;
    mode: string;
    description: string;
    fields?: SchemaType[];
  }[];
  [key: string]: any;
};

export type TableType = TableIdType & {
  tableReference: TableReferenceType;
  schema: SchemaType;
  friendlyName: string;
  kind: string
  type: string;
  creationTime: string;
  lastModifiedTime: string;
  selfLink: string;
};
