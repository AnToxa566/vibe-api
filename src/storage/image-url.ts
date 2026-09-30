import { ValueTransformer } from 'typeorm';

export const getImageUrl = (key: string): string =>
  `${process.env.STORAGE_PUBLIC_URL.replace(/\/+$/, '')}/${key}`;

// В БД лежит только имя файла, наружу отдаётся абсолютный URL.
// process.env читается при вызове: к моменту импорта сущностей .env ещё не загружен.
export const imageUrlTransformer: ValueTransformer = {
  from: (key?: string) => (key ? getImageUrl(key) : key),
  to: (value?: string) => value,
};
