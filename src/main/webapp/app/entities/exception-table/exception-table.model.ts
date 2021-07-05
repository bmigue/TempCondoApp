export interface IExceptionTable {
  id?: number;
  iDException?: number;
  message?: string | null;
  number?: number | null;
}

export class ExceptionTable implements IExceptionTable {
  constructor(public id?: number, public iDException?: number, public message?: string | null, public number?: number | null) {}
}

export function getExceptionTableIdentifier(exceptionTable: IExceptionTable): number | undefined {
  return exceptionTable.id;
}
