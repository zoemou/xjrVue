import { baseUrl } from '@/config/env';
import request from 'axios'
export const getIndexUrl = (systemId) => request({
    url: baseUrl + `/visual-homerelation/index-url`,
    method: 'get',
    params: {
        systemId
    }
});
  