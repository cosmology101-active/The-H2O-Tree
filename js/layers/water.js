addLayer("w", {
    name: "water", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 1, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    branches: ["h", "o"],
    effect() {
        return player[this.layer].points.sqrt().add(1);
    },
    effectDescription() {
        return "which is generating water vapor at " + String(player.w.vgain.round()) + "/sec";
    },
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
            v: new Decimal(0),
            vgain: new Decimal(0),
            dew: new Decimal(0),
        };
    },
    color: "#88BBFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account.
    resource: "water", // Name of prestige currency.
    baseResource: "H,2O", // Name of resource prestige is based on.
    baseAmount() { 
        if (player.h.points.lt(player.o.points.multiply(2))) return player.h.points;
        return player.o.points.multiply(2);
    }, // Get the current amount of baseResource.
    type: "normal", // 'normal': cost to gain currency depends on amount gained. 'static': cost depends on how much you already have.
    exponent: 0.5, // Prestige currency exponent.
    gainMult() { // Calculate the multiplier for main currency from bonuses.
        let mult = new Decimal(1);
        return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses.
        return new Decimal(1);
    },
    row: 1, // Row the layer is in on the tree (0 is the first row).
    doReset(resettingLayer){
        let keep=[];
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep);
        if (layers[resettingLayer].row > this.row){player.w.v=new Decimal(0);}
    },
    update(diff) {
        if(player.w.unlocked) {
            let basegain = player.w.points.mul(0.1);
            if (basegain == 0) {
                basegain = new Decimal(1)
            }
            let vmult = new Decimal(1);
            if (getBuyableAmount("w",11) !== 0) {
                basegain = basegain.add(buyableEffect("w", 11))
            }
            let tempvgain = new Decimal(0).plus(basegain).mul(vmult).times(diff)
            if (tempvgain >= player.w.vgain) {
                player.w.vgain = tempvgain
            }
            return player.w.v = player.w.v.plus(player.w.vgain.round())
        }
    },
    buyables: {
        11: {
            title: "Evaporation",
            cost(x) { return new Decimal(1).mul(x).pow(1.3).round(); },
            display() { return "Evaporate water and generate water vapor. \nCost: " + String(this.cost()) + "\nCurrently: " + String(buyableEffect("w", 11)) + " water vapor / tick"; },
            canAfford() { return player[this.layer].points.gte(this.cost()); },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            effect(x) { return new Decimal(1).mul(getBuyableAmount(this.layer, this.id)).mul(2); },
        },
    },
    milestones: {
        0: {
            requirementDescription: "5 water",
            effectDescription: "keep hydrogen upgrades on reset",
            done() { return player.w.points.gte(5); },
        },
        1: {
            requirementDescription: "10 water",
            effectDescription: "keep oxygen upgrades on reset",
            done() { return player.w.points.gte(10); },
        },
    },
    tabFormat: {
        "Water": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "display-text",
                "blank",
                "milestones",
                "blank",
            ],
        },
        "Water Cycle": {
            unlocked() {
                return true;
            },
            content: [
                "main-display",
                "blank",
                ["display-text",
                    function() { return 'You have ' + format(player.w.v) + ' water vapor, boosting vapor generation by ' + format(player.w.v.pow(0.7).add(9).log10()); },
                    { "font-size": "12px" },
                ],
                "blank",
                "blank",
                "buyables",
                "blank",
            ],
        },
    },
    hotkeys: [
        { key: "w", description: "W: Reset for water", onPress() { if (canReset(this.layer)) doReset(this.layer); } },
    ],
    layerShown() { 
        return hasUpgrade("o", 31) || hasAchievement("a", 14);
    },
});
