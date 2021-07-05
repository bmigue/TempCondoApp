import * as dayjs from 'dayjs';

export interface ISysLog {
  id?: number;
  iDSysLog?: number;
  logDateTime?: dayjs.Dayjs | null;
  action?: string | null;
}

export class SysLog implements ISysLog {
  constructor(public id?: number, public iDSysLog?: number, public logDateTime?: dayjs.Dayjs | null, public action?: string | null) {}
}

export function getSysLogIdentifier(sysLog: ISysLog): number | undefined {
  return sysLog.id;
}
