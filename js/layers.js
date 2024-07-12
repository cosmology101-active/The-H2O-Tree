addLayer("a", {
    name: "achievements", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 0, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#EFCC04",
    resource: "achievements", // Name of prestige currency.
    type: "none", // 'normal': cost to gain currency depends on amount gained. 'static': cost depends on how much you already have.
    row: "side", // Row the layer is in on the tree (0 is the first row).
    layerShown() { 
        return true
    },
    achievements: {         
        11: {
            name: "Science!",
            done() {
                if (hasUpgrade("h",21)) {
                    return true
                }
                else {
                    return false
                }
            },
            tooltip: "Unlock Scientific Discovery",
            onComplete() {
                player.a.points = player.a.points.add(1)
            },
        },
        12: {
            name: "Stellar Inspiration",
            done() {
                if (hasAchievement("a",11) && (player.h.points.gte(100))) {
                    return true
                }
                else {
                    return false
                }
            },
            tooltip: "Reach 100 hydrogen in scientific discovery.",
            onComplete() {
                player.a.points = player.a.points.add(1)
            },
            unlocked() {
                if (hasAchievement("a",11)) {
                    return true
                } else {
                    return false
                }
            },
        },
        13: {
            name: "Oxygen?",
            done() {
                if (layerShown("o")) {
                    return true
                }
                else {
                    return false
                }
            },
            tooltip: "Unlock Oxygen Layer",
            onComplete() {
                player.a.points = player.a.points.add(1)
            },
            unlocked() {
                if (hasAchievement("a",12)) {
                    return true
                } else {
                    return false
                }
            },
        },
        14: {
            name: "Cleaning fluid",
            done() {
                if (player.h.points.gte(300) && player.o.points.gte(300)) {
                    return true
                }
                else {
                    return false
                }
            },
            tooltip: "Reach 300 hydrogen & 300 oxygen for hydrogen peroxide",
            onComplete() {
                player.a.points = player.a.points.add(1)
            },
            unlocked() {
                if (hasAchievement("a",13)) {
                    return true
                } else {
                    return false
                }
            },
        },
        15: {
            name: "It's H2O",
            done() {
                if (layerShown("w")) {
                    return true
                }
                else {
                    return false
                }
            },
            tooltip: "Unlock Water Layer",
            onComplete() {
                player.a.points = player.a.points.add(1)
            },
            unlocked() {
                if (hasAchievement("a",14)) {
                    return true
                } else {
                    return false
                }
            },
        },
        21: {
            name: "Water Power",
            done() {
                if (player.w.points.gte(50)) {
                    return true
                }
                else {
                    return false
                }
            },
            tooltip: "Get 50 water",
            onComplete() {
                player.a.points = player.a.points.add(1)
            },
            unlocked() {
                if (hasAchievement("a",15)) {
                    return true
                } else {
                    return false
                }
            },
        },
        22: {
            name: "CNO Death Star",
            done() {
                if (hasUpgrade("h",34)) {
                    return true
                }
                else {
                    return false
                }
            },
            tooltip: "Get the hydrogen upgrade 'CNO Cycle' and obtain gases",
            onComplete() {
                player.a.points = player.a.points.add(1)
            },
            unlocked() {
                if (hasAchievement("a",21)) {
                    return true
                } else {
                    return false
                }
            },
        },
    },
})
addLayer("h", {
    name: "hydrogen", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 0, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#B4DCDF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account.
    resource: "hydrogen", // Name of prestige currency.
    baseResource: "vapor", // Name of resource prestige is based on.
    baseAmount() { return player.points }, // Get the current amount of baseResource.
    type: "normal", // 'normal': cost to gain currency depends on amount gained. 'static': cost depends on how much you already have.
    exponent: 0.5, // Prestige currency exponent.
    softcap: new Decimal(1e9),
    softcapPower: new Decimal(0.02),
    gainMult() { // Calculate the multiplier for main currency from bonuses.
        let mult = new Decimal(1)
        if (hasUpgrade('h', 13)) {
            mult = mult.times(upgradeEffect('h', 13))
        }
        if (hasUpgrade('h', 23)) {
            mult = mult.times(0.95)
        }
        if (hasUpgrade('o', 11)) {
            mult = mult.times(upgradeEffect('o', 11))
        }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses.
        return new Decimal(1)
    },
    doReset(resettingLayer){
        let keep=[]
        if (hasMilestone("w",0)){
            // keep.push("milestones")
            keep.push("upgrades")
        }
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
        if (layerShown("n") || layerShown("w") || layerShown("c") || layerShown("nh") || layerShown("co")){
            player.h.upgrades = player.h.upgrades.concat([31,32,33,34])
        }
    },
    bars: {
        0: {
            direction: RIGHT,
            width: 600,
            height: 50,
            textStyle: {
                "color": "#009918"
            },
            baseStyle: {
                "color": "#272727"
            },
            fillStyle: {
                "color": "#B4DCDF"
            },
            progress() { 
                if (!hasUpgrade("h",33)) {
                    return player.h.points.divide(100)
                } else if (hasUpgrade("h",33) && !hasUpgrade("h",34)) {
                    if (player.h.points.gt(300) && player.o.points.gt(300)) {
                        return new Decimal(1)
                    } else if (player.h.points.gt(300) && !player.o.points.gt(300)) {
                        return player.o.points.divide(300).divide(2).add(0.5)
                    } else if (player.o.points.gt(300) && !player.h.points.gt(300)) {
                        return player.h.points.divide(300).divide(2).add(0.5)
                    } else {
                        return player.h.points.divide(300).divide(2).add(player.o.points.divide(300).divide(2))
                    }
                } else if (hasUpgrade("h",34)) {
                    if (player.w.points.gt(50)) {
                        return new Decimal(1)
                    } else {
                        return player.w.points.divide(50)
                    }
                } else {
                    return new Decimal(0)
                }
            },
            display() {
                if (!hasUpgrade("h",33)) {
                    return "Reach 100 Hydrogen to unlock next reward"
                } else if (hasUpgrade("h",33) && !hasUpgrade("h",34)) {
                    return "Reach 300 Hydrogen and Oxygen to unlock next reward"
                } else if (hasUpgrade("h",34)) {
                    return "Reach 50 Water to unlock next reward"
                } else {
                    return "Complete"
                }
            },
            unlocked() {
                return true
            }
        },
    },
    upgrades: {
        11: {
            title: "Basic Boost",
            description: "Increases vapor gain by a whopping 2x",
            cost: new Decimal(1),
            effectDisplay() { 
                return "2x" 
            },
        },
        12: {
            title: "Gaseous Vapor",
            description: "Boost vapor based on hydrogen currently owned.",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x" 
            },
        },
        13: {
            title: "Higher Temperature",
            description: "Lowers hydrogen requirement and boosts vapor based on vapor",
            cost: new Decimal(5),
            effect() {
                return player.points.add(10).log10().pow(0.4)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x" 
            },
        },
        21: {
            title: "Nuclear Fusion",
            description: "Successfully test fusion, fueling scientific discovery.",
            cost: new Decimal(15),
            unlocked() {
                return true
            },
        },
        22: {
            title: "Vapor Inertia",
            description: "Vapor gain slightly increased and raised to the power of ^1.02",
            currencyDisplayName: "hydrogen and 101 vapor",
            canAfford() {
                return player.points.gte(101) && player.h.points.gte(10);
            },
            pay() {
                player.h.points = player.h.points.minus(10)
                player.points = player.points.minus(101)
            },
            cost: new Decimal(10),
            effect() {
                if (hasUpgrade("h", 24)) {
                    return new Decimal(1.02).times(upgradeEffect("h", 24))
                } else {
                    return new Decimal(1.02)
                }
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id))
            },
        },
        23: {
            title: "Gas Heating",
            description: "Use burning of hydrogen to fuel the heating of more vapor but consume hydrogen",
            cost: new Decimal(60),
            effect() {
                if (hasUpgrade("h", 24)) {
                    return player.h.points.add(1).pow(0.05).times(1.5).times(upgradeEffect("h", 24))
                } else {
                    return player.h.points.add(1).pow(0.05).times(1.5)
                }
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
        },
        24: {
            title: "Row Synergy",
            description: "The number of upgrades in row 1 boosts row 2 upgrades",
            cost: new Decimal(200),
            effect() {
                let upgradeCount = new Decimal(0)
                if (hasUpgrade("h", 11)) {
                    upgradeCount = upgradeCount.add(1)
                }
                if (hasUpgrade("h", 12)) {
                    upgradeCount = upgradeCount.add(1)
                }
                if (hasUpgrade("h", 13)) {
                    upgradeCount = upgradeCount.add(1)
                }
                return upgradeCount.times(0.05).add(1)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
        },
        31: {
            title: "Triple Alpha Process",
            description: "Fuse three hydrogens to obtain the exotic...He, creating much energy in the process.",
            cost: new Decimal(150),
            effect() {
                return player.h.points.add(1).pow(0.1)
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked() {
                return hasAchievement("a", 12)
            },
        },
        32: {
            title: "Proton-Proton",
            description: "Unlock another way to create energy from pure hydrogen. Boost vapor gain by 3x",
            cost: new Decimal(255),
            effect() {
                return new Decimal(3)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
            unlocked() {
                return hasUpgrade("h",31)
            },
        },
        33: {
            title: "Stellar Fusion",
            description: "Using the same process as a supernova this will unlock...",
            cost: new Decimal(550),
            unlocked() {
                return hasUpgrade("h",32)
            },
        },
        34: {
            title: "CNO Cycle",
            description: "Using the CNO cycle of stars we can find new elements.",
            cost: new Decimal(2250),
            unlocked() {
                return hasAchievement("a", 21)
            },
        },
    },
    tabFormat: {
        "Hydrogen": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "display-text",
                "blank",
                "milestones",
                "blank",
                "blank",
                ["upgrades", "1"],
                ["upgrades", "2"]
            ]
        },
        "Discovery": {
            unlocked() {
                return (hasUpgrade("h", 21) || hasAchievement("a", 11))
            },
            content: [
                "main-display",
                "blank",
                ["bar", "0"],
                "blank",
                "blank",
                ["upgrades", "3"]
            ]
        },
    },
    row: 0, // Row the layer is in on the tree (0 is the first row).
    hotkeys: [
        { key: "h", description: "H: hydrogen", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return true }
})
addLayer("o", {
    name: "oxygen", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "O", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 1, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#F17F3D",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account.
    resource: "oxygen", // Name of prestige currency.
    baseResource: "vapor", // Name of resource prestige is based on.
    baseAmount() { return player.points }, // Get the current amount of baseResource.
    type: "normal", // 'normal': cost to gain currency depends on amount gained. 'static': cost depends on how much you already have.
    exponent: 0.5, // Prestige currency exponent.
    gainMult() { // Calculate the multiplier for main currency from bonuses.
        let mult = new Decimal(1)
        if (hasUpgrade("o",21)) {
            mult = mult.pow(upgradeEffect("o",21))
        }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses.
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row).
    hotkeys: [
        { key: "o", description: "O: Reset for oxygen", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    doReset(resettingLayer){
        let keep=[]
        if(hasMilestone("w",2)){
            keep.push("points")}
        if(hasMilestone("w",1)){
            keep.push("upgrades")}
        if(hasMilestone("n",0)){
            keep.push("upgrades")}
        if(layers[resettingLayer].row>this.row) layerDataReset(this.layer,keep)
    },
    upgrades: {
        11: {
            title: "Nuclear Fission",
            description: "Oxygen boosts hydrogen gain",
            cost: new Decimal(2),
            effect() {
                return player.o.points.add(1).pow(0.45)
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id))
            },
        },
         12: {
            title: "Vaporization",
            description: "Oxygen boosts vapor gain",
            cost: new Decimal(5),
            effect() {
                return player.o.points.add(1).pow(0.25)
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id))
            },
         },
         21: {
            title: "Oxygen Generation",
            description: "Oxygen boosts Oxygen gain",
            cost: new Decimal(30),
            effect() {
                return player.o.points.add(2).pow(0.3)
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id))
            },
        },
        22: {
            title: "Carbonic Oxygen?!",
            description: "Oxygen boosts Carbon gain",
            cost: new Decimal(270),
            effect() {
                return player.o.points.add(1).pow(0.15).times(4)
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked() {
                if (layerShown("c")) {
                    return true
                } else {
                    return false
                }
            },
        },
        31: {
            title: "Unlock Next Layer",
            description: "Unlocks next layer...what will it be?",
            cost: new Decimal(11570),
            effect() {
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x" 
            },
        },
    },
    layerShown() { 
        if (hasUpgrade("h",33) || hasAchievement("a",13)) { return true }
        else { return false }
    }
})
addLayer("n", {
    name: "nitrogen", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 1, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    branches: ["o"],
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#C7F391",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account.
    resource: "nitrogen", // Name of prestige currency.
    baseResource: "100O,V", // Name of resource prestige is based on.
    baseAmount() { if (player.points.lt(player.o.points.multiply(100))) return player.points
                 return player.o.points.multiply(100) 
    }, // Get the current amount of baseResource.
    type: "normal", // 'normal': cost to gain currency depends on amount gained. 'static': cost depends on how much you already have.
    exponent: 0.2, // Prestige currency exponent.
    gainMult() { // Calculate the multiplier for main currency from bonuses.
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses.
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row).
    hotkeys: [
        { key: "n", description: "N: Reset for nitrogen", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    upgrades: {
        11: {
            title: "Nitro",
            description: "Multiplies Hydrogen gain by 35",
            cost: new Decimal(5),
            effect() {
                return player.o.points.add(1).pow(0.25)
            },
        },
         12: {
            title: "Volatility",
            description: "Raise gain of oxygen and nitrogen ^1.5",
            cost: new Decimal(15),
            effect() {
                return new Decimal(1.5)
            },
        },
    },
    milestones: {
        0: {
            requirementDescription: "2 nitrogen",
            effectDescription: "Keep oxygen upgrades on reset",
            done() { return player.n.points.gte(2) }
        },
    },
    doReset(resettingLayer){
        let keep=[]
        if(hasMilestone("nh",0)){
            keep.push("upgrades")}
        if(layers[resettingLayer].row>this.row) layerDataReset(this.layer,keep)
    },
    layerShown() {
        if (hasUpgrade("h",33)) {
            return true
        } else {
            return false
        }
    }
})
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
            vGain: new Decimal(0),
            v: new Decimal(0),
            condensation: new Decimal(0),
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
    update(diff){
        player.w.vGain = buyableEffect("w", 11);
        if(!player.w.unlocked)return;
        player.w.v=player.w.v.plus(player.w.vGain.times(diff));},
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
            effect(x) { return new Decimal(1).mul(x).pow(1.4); },
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
