import { laptopRules } from './laptop';
import { hpRules } from './hp';
import { pcRules } from './pc';

export const rules = [
  ...laptopRules,
  ...hpRules,
  ...pcRules
];
