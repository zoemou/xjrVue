import user from './user';
import menu from './menu';
import crud from './crud';
/**
 * 模拟数据mock
 * 
 * mock是否开启模拟数据拦截
 */

user({ mock: false });

menu({ mock: false });

crud({ mock: false });