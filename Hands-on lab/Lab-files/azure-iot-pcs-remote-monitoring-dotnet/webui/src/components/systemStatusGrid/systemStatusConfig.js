// Copyright (c) Microsoft. All rights reserved.

import moment from 'moment';
import lang from '../../common/lang';
import { EMPTY_FIELD_VAL, DEFAULT_TIME_FORMAT, gridValueFormatters } from '../pcsGrid/pcsGridConfig';

const { checkForEmpty } = gridValueFormatters;

export const DEFAULT_SYSTEM_GRID_PAGE_SIZE = 6;

const getStatusCode = value => {
  switch (value) {
    case 1: return lang.ENQUEUED;
    case 2: return lang.RUNNING;
    case 3: return lang.COMPLETED;
    case 4: return lang.FAILED;
    case 5: return lang.CANCELLED;
    case 6: return lang.SCHEDULED;
    default: return lang.QUEUED;
  }
}

/** A collection of column definitions for the systemStatusGrid */
export const systemStatusColumnDefs = {
  jobId: {
    headerName: lang.JOBNAME,
    field: 'jobId'
  },
  deviceIdAffected: {
    headerName: lang.DEVICE_ID_AFFECTED,
    field: 'deviceId'
  },
  status: {
    headerName: lang.STATUS,
    field: 'status',
    valueFormatter: ({ value }) => getStatusCode(value)
  },
  lastReturnMessage: {
    headerName: lang.LAST_RETURN_MESSAGE,
    field: 'status',
    valueFormatter: ({ value, data }) => {
       return `${data.methodName} ${getStatusCode(value)}`;
    }
  },
  type: {
    headerName: lang.OPERATION,
    field: 'type',
    valueFormatter: ({ value, data }) => {
      if (value === 3) {
        return data.methodParameter && data.methodParameter.name;
      } else if (value === 4) {
        if (data.updateTwin && data.updateTwin.tags && Object.keys(data.updateTwin.tags).length) {
          return lang.TAG;
        } else {
          return lang.RECONFIGURE;
        }
      }
      return '';
    }
  },
  deviceCount: {
    headerName: lang.NO_OF_DEVICES,
    field: 'resultStatistics.deviceCount',
    valueFormatter: ({ value }) => checkForEmpty(value, 0)
  },
  succeededCount: {
    headerName: lang.SUCCEEDED_CAPITAL,
    field: 'resultStatistics.succeededCount',
    valueFormatter: ({ value }) => checkForEmpty(value, 0)
  },
  failedCount: {
    headerName: lang.FAILED_CAPITAL,
    field: 'resultStatistics.failedCount',
    valueFormatter: ({ value }) => checkForEmpty(value, 0)
  },
  startTime: {
    headerName: lang.START_TIME,
    field: 'startTimeUtc',
    valueFormatter: ({ value }) => {
      if (!value) return EMPTY_FIELD_VAL;
      const time = moment.utc(value);
      return time.unix() < 0 ? EMPTY_FIELD_VAL : time.format(DEFAULT_TIME_FORMAT);
    }
  },
  endTime: {
    headerName: lang.END_TIME,
    field: 'endTimeUtc',
    valueFormatter: ({ value }) => {
      if (!value) return EMPTY_FIELD_VAL;
      const time = moment.utc(value);
      return time.unix() < 0 ? EMPTY_FIELD_VAL : time.format(DEFAULT_TIME_FORMAT);
    }
  }
};

export const getSoftSelectId = ({ jobId }) => jobId;

/** Shared device grid AgGrid properties */
export const systemStatusGridProps = {
  multiSelect: true,
  rowSelection: 'multiple',
  enableColResize: true,
  pagination: true,
  paginationPageSize: DEFAULT_SYSTEM_GRID_PAGE_SIZE
};
