export type DatasetType = {
  readonly id: string;
  readonly friendlyName: string;
  readonly labels: string[];
  readonly description: string;
};

export type TableType = {
  readonly id: string;
  readonly friendlyName: string;
  readonly labels: string[];
  readonly description: string;
  readonly schema: string;
};
