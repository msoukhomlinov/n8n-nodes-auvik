import { NodeOperationError } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';

const ISO_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME_NO_TZ_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export function assertIsoDateTime(this: IExecuteFunctions, value: string, fieldName: string): void {
  if (!ISO_DATETIME_REGEX.test(value)) {
    throw new NodeOperationError(this.getNode(), `Invalid ${fieldName}. Expected format YYYY-MM-DDTHH:mm:ss.SSSZ`);
  }
}

export function assertDate(this: IExecuteFunctions, value: string, fieldName: string): void {
  if (!DATE_REGEX.test(value)) {
    throw new NodeOperationError(this.getNode(), `Invalid ${fieldName}. Expected format YYYY-MM-DD`);
  }
}

export function assertDateTimeNoTz(this: IExecuteFunctions, value: string, fieldName: string): void {
  if (!DATETIME_NO_TZ_REGEX.test(value)) {
    throw new NodeOperationError(this.getNode(), `Invalid ${fieldName}. Expected format YYYY-MM-DD HH:mm:ss`);
  }
}


