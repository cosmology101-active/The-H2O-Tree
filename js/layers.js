addLayer("c", {
    name: "carbon", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 0, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    branches: ["h"],
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#C9C9C9",
    nodeStyle: {
        "background-image": "radial-gradient(circle, #CFCFCF, #272727)"
    },
    requires: new Decimal(1250), // Can be a function that takes requirement increases into account.
    resource: "carbon", // Name of prestige currency.
    baseResource: "hydrogen", // Name of resource prestige is based on.
    baseAmount() { return player.h.points }, // Get the current amount of baseResource.
    type: "normal", // 'normal': cost to gain currency depends on amount gained. 'static': cost depends on how much you already have.
    exponent: 0.75, // Prestige currency exponent.
    gainMult() { // Calculate the multiplier for main currency from bonuses.
        let mult = new Decimal(1)
        if (hasUpgrade("o",22)) {
            mult = mult.times(upgradeEffect("o",22))
        }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses.
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row).
    hotkeys: [
        { key: "c", description: "C: Reset for carbon", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    doReset(resettingLayer){
        let keep=[]
        if(hasMilestone("co",0)){
            keep.push("upgrades")}
        if(layers[resettingLayer].row>this.row) layerDataReset(this.layer,keep)
    },
    upgrades: {
        11: {
            title: "Carbon Heating",
            description: "Carbon boosts generation of vapor",
            cost: new Decimal(2),
            effect() {
                return player.points.add(1).pow(0.01)
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id))
            },
        },
    },
    layerShown() {
        if (hasUpgrade("h",33)) {
            return true
        } else {
            return false
        }
    }
})
addLayer("w", {
    name: "water", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 1, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    branches: ["h", "o"],
    effect() {
        return player[this.layer].points.sqrt().add(1);
    },
    effectDescription() {
        return "which is boosting vapor generation by " + String(player[this.layer].points.sqrt().add(1).multiply(100).round().divide(100)) + "x";
    },
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
            v: new Decimal(0),
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
            let basegain = player.w.points.mul(1.5);
            let vmult = new Decimal(1);
            if (getBuyableAmount("w",11) !== 0) {
                basegain = basegain.add(buyableEffect("w", 11))
            }
            return; player.w.v = player.w.v.plus(new Decimal(0).plus(basegain).mul(mult).times(diff));
        }
    },
    buyables: {
        11: {
            title: "Evaporation",
            cost(x) { return new Decimal(1).mul(x).pow(1.3); },
            display() { return "Evaporate water and generate water vapor. \nCurrently: " + buyableEffect("w", 11) + " water vapor / tick"; },
            canAfford() { return player[this.layer].points.gte(this.cost()); },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            effect(x) { return new Decimal(1).mul(x).mul(2); },
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
                    function() { return 'You have ' + format(player.w.v) + ' water vapor, boosting vapor generation by ' + format(player.w.v.pow(0.4).log10()); },
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
addLayer("nh", {
    name: "ammonia", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: `<img src="resources/icon/nh3.png" alt="NH" class="icon-img">`, // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 0, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    branches: ["n","h"],
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#8622D5",
    nodeStyle: {
        "background-image": "radial-gradient(circle, #E7E995, #9B3EE4)"
    },
    requires: new Decimal(125), // Can be a function that takes requirement increases into account.
    resource: "ammonia", // Name of prestige currency.
    baseResource: "H,3N", // Name of resource prestige is based on.
    baseAmount() { if (player.h.points.lt(player.n.points.multiply(3))) return player.h.points
                 return player.n.points.multiply(3) 
    },
    type: "static", // 'normal': cost to gain currency depends on amount gained. 'static': cost depends on how much you already have.
    exponent: 0.3, // Prestige currency exponent.
    gainMult() { // Calculate the multiplier for main currency from bonuses.
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses.
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row).
    hotkeys: [
        { key: "nh", description: "Shift+N: Reset for Ammonia", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    upgrades: {
        11: {
            title: "Greenhouse gas",
            description: "Carbon Dioxide boosts vapor and oxygen generation",
            cost: new Decimal(2),
            effect() {
                return player.points.times(1.02).add(1).pow(0.2)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
        },
    },
    milestones: {
        0: {
            requirementDescription: "2 ammonia",
            effectDescription: "keep nitrogen upgrades on reset",
            done() { return player.nh.points.gte(2) }
        },
    },
    layerShown() { 
        if (hasAchievement("a",22)) {
            return true
        } else {
            return false
        }
    }
})
addLayer("co", {
    name: "carbon dioxide", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: `<img src="resources/icon/co2.png" alt="CO" class="icon-img">`, // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 2, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    branches: ["c","o"],
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#EA8751",
    nodeStyle: {
        "background-image": "radial-gradient(circle, #EA8751, #A5E557)"
    },
    requires: new Decimal(25), // Can be a function that takes requirement increases into account.
    resource: "carbon dioxide", // Name of prestige currency.
    baseResource: "O,2C", // Name of resource prestige is based on.
    baseAmount() { if (player.o.points.lt(player.c.points.multiply(2))) return player.o.points
                 return player.c.points.multiply(2) 
    },
    type: "normal", // 'normal': cost to gain currency depends on amount gained. 'static': cost depends on how much you already have.
    exponent: 0.75, // Prestige currency exponent.
    gainMult() { // Calculate the multiplier for main currency from bonuses.
        let mult = new Decimal(1)
        if (hasUpgrade("co",12)) {
            mult = mult.pow(upgradeEffect("co",12))
        }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses.
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row).
    hotkeys: [
        { key: "co", description: "Shift+C: Reset for CO2", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    upgrades: {
        11: {
            title: "Greenhouse gas",
            description: "Carbon Dioxide boosts vapor and oxygen generation",
            cost: new Decimal(2),
            effect() {
                return player.points.times(1.02).add(1).pow(0.2)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
        },
        12: {
            title: "Fossil fuels",
            description: "Carbon dioxide generation is increased by carbon",
            cost: new Decimal(250),
            effect() {
                return player.c.points.times(1).add(1).pow(1.02)
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id)) 
            },
        },
    },
    milestones: {
        0: {
            requirementDescription: "8 carbon dioxide",
            effectDescription: "keep carbon upgrades on reset",
            done() { return player.w.points.gte(8) }
        },
    },
    layerShown() { 
        if (hasAchievement("a",22)) {
            return true
        } else {
            return false
        }
    }
})
