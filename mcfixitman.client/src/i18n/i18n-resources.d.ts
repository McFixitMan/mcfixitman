import { LiteralUnion } from '../types/typescriptHelpers';
import { defaultNS } from './config';
import en from './locales/en/translations.json';


// Utility type to get recursive nested keys of objects
// This is technically dangerous because it can recurse infinitely and cause problems for the
//   ts compiler. In fact, it's only not throwing an error here because we're in a d.ts file
//   with skipLibCheck turned on in our tsconfig. 
// Working well enough for now, will add some depth limiting later for more protection
// See: https://medium.com/xgeeks/typescript-utility-keyof-nested-object-fa3e457ef2b2
type NestedKeyOf<ObjectType extends Record<string, unknown>> =
    { [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends Record<string, unknown>
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`
    }[keyof ObjectType & (string | number)];

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: typeof defaultNS;
        resources: {
            translations: Record<LiteralUnion<NestedKeyOf<typeof en>, string>, string>;
        }
    }
}