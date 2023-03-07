import {IConfig} from '../config';

export const setDynamic = (config: IConfig): IConfig => {
  config.isDynamic = true;

  return config;
};
