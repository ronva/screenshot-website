import Logger from 'bunyan';
import bunyanFormat from 'bunyan-format';
import { name } from '../package';

export const logger = new Logger({
  name,
  level: process.env.LOG_LEVEL || 'info',
  stream: bunyanFormat({ outputMode: process.env.LOG_FORMAT || 'short' }, process.stderr)
});
