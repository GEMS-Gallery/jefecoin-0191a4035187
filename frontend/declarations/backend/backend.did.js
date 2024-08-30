export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({
    'ok' : IDL.Record({ 'symbols' : IDL.Vec(IDL.Text), 'winAmount' : IDL.Nat }),
    'err' : IDL.Text,
  });
  return IDL.Service({
    'getBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'getSymbols' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'spin' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
