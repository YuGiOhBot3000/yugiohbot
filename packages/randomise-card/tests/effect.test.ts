import { parseEffect } from "../src/effect";

describe("Effect", () => {
  describe("parseEffect", () => {
    it.each([
      {
        cardType: "effect",
        effect:
          "Cannot be Normal Summoned/Set. Must be Special Summoned (from your hand) by shuffling 5 of your banished Dinosaur monsters into the Main Deck. Once per turn, when your opponent activates a Spell/Trap Card (Quick Effect): You can destroy 1 Dinosaur monster in your hand or face-up on your field, and if you do, negate the activation, and if you do that, destroy that card. If this card is sent to the GY by a card effect: You can add 1 'Evolution Pill' Spell from your Deck to your hand. You can only use this effect of 'Overtex Qoatlus' once per turn.\n",
        pendulumEffect: "",
        cardEffect:
          "Cannot be Normal Summoned/Set. Must be Special Summoned (from your hand) by shuffling 5 of your banished Dinosaur monsters into the Main Deck. Once per turn, when your opponent activates a Spell/Trap Card (Quick Effect): You can destroy 1 Dinosaur monster in your hand or face-up on your field, and if you do, negate the activation, and if you do that, destroy that card. If this card is sent to the GY by a card effect: You can add 1 'Evolution Pill' Spell from your Deck to your hand. You can only use this effect of 'Overtex Qoatlus' once per turn.\n",
      },
      {
        cardType: "pendulum effect",
        effect:
          " [ Pendulum Effect ] You can target 1 'Abyss Actor' Pendulum Monster you control and 1 monster your opponent controls; switch control of both monsters, then destroy this card. You can only use this effect of 'Abyss Actor - Comic Relief' once per turn.[ Monster Effect ] You take no battle damage from attacks involving this card. Once per turn, during your Standby Phase: Give control of this card to your opponent. Once per turn, if control of this face-up card changes: Activate this effect; the owner of this card can destroy 1 Set 'Abyss Script' Spell in their Spell & Trap Zone.\n",
        pendulumEffect:
          "You can target 1 'Abyss Actor' Pendulum Monster you control and 1 monster your opponent controls; switch control of both monsters, then destroy this card. You can only use this effect of 'Abyss Actor - Comic Relief' once per turn.",
        cardEffect:
          "You take no battle damage from attacks involving this card. Once per turn, during your Standby Phase: Give control of this card to your opponent. Once per turn, if control of this face-up card changes: Activate this effect; the owner of this card can destroy 1 Set 'Abyss Script' Spell in their Spell & Trap Zone.",
      },
      {
        cardType: "pendulum monster",
        effect:
          "[ Pendulum Effect ]Once, while this card is in your Pendulum Zone: You can target 1 card in a Pendulum Zone; destroy it.----------------------------------------[ Flavor Text ]'Luster Pendulum, the Dracoslayer' continues his journey to uncover the secrets of Dragon Alchemy, believing it is the key to dispelling his curse and restoring his memory. His power continues to grow... perhaps the same power used by the Dracofiends?\n",
        pendulumEffect:
          "Once, while this card is in your Pendulum Zone: You can target 1 card in a Pendulum Zone; destroy it.",
        cardEffect:
          "'Luster Pendulum, the Dracoslayer' continues his journey to uncover the secrets of Dragon Alchemy, believing it is the key to dispelling his curse and restoring his memory. His power continues to grow... perhaps the same power used by the Dracofiends?",
      },
    ])(
      "should parse the effect correctly",
      ({ cardEffect, effect, cardType, pendulumEffect }) => {
        expect(parseEffect(cardType, effect)).toEqual({
          pendulumEffect,
          cardEffect,
        });
      }
    );
  });
});
