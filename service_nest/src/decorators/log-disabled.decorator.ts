import { SetMetadata } from '@nestjs/common';
import { LOG_DISABLED_KEY_METADATA } from 'src/guards/constants/admin.contants';

/**
 * 日志记录禁用
 */
export const LogDisabled = () => SetMetadata(LOG_DISABLED_KEY_METADATA, true);
