import Blob "mo:base/Blob";
import Int "mo:base/Int";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Random "mo:base/Random";
import Result "mo:base/Result";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Nat8 "mo:base/Nat8";

actor SlotMachine {
  stable var playerBalance : Nat = 1000; // Initial balance of 1000 JefeCoins
  let symbols = ["🍒", "🍋", "🍊", "🍇", "💰", "7️⃣", "🎰", "🃏", "🎲"];
  var currentSymbols : [Text] = ["", "", ""];

  public query func getBalance() : async Nat {
    playerBalance
  };

  public query func getSymbols() : async [Text] {
    currentSymbols
  };

  public shared func spin(bet : Nat) : async Result.Result<{symbols: [Text]; winAmount: Nat}, Text> {
    if (bet > playerBalance) {
      return #err("Insufficient balance");
    };

    playerBalance -= bet;

    let randomBlobResult = await Random.blob();
    let randomGenerator = Random.Finite(randomBlobResult);

    func getRandomSymbol() : Text {
      switch (randomGenerator.byte()) {
        case (?byte) {
          symbols[Nat.abs(Float.toInt(Float.floor(Float.fromInt(Nat8.toNat(byte)) / 256.0 * Float.fromInt(symbols.size()))))]
        };
        case null { "🍒" }; // Fallback to cherry if we run out of entropy
      }
    };

    currentSymbols := Array.tabulate<Text>(3, func(_) { getRandomSymbol() });

    let winAmount = calculateWin(bet, currentSymbols);
    playerBalance += winAmount;

    #ok({ symbols = currentSymbols; winAmount = winAmount })
  };

  func calculateWin(bet : Nat, symbols : [Text]) : Nat {
    if (Array.equal<Text>(symbols, ["7️⃣", "7️⃣", "7️⃣"], func(a, b) { a == b })) {
      return bet * 10;
    } else if (Array.equal<Text>(symbols, ["💰", "💰", "💰"], func(a, b) { a == b })) {
      return bet * 5;
    } else if (symbols[0] == symbols[1] and symbols[1] == symbols[2]) {
      return bet * 3;
    } else if (symbols[0] == symbols[1] or symbols[1] == symbols[2]) {
      return bet * 2;
    };
    0
  };
}
