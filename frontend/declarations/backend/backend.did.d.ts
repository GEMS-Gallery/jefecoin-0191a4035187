import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = {
    'ok' : { 'symbols' : Array<string>, 'winAmount' : bigint }
  } |
  { 'err' : string };
export interface _SERVICE {
  'getBalance' : ActorMethod<[], bigint>,
  'getSymbols' : ActorMethod<[], Array<string>>,
  'spin' : ActorMethod<[bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
