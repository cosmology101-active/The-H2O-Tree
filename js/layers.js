addLayer("a", {
    name: "achievements", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: "side", // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#EFCC04",
    resource: "achievements", // Name of prestige currency.
    type: "none", // 'normal': cost to gain currency depends on amount gained. 'static': cost depends on how much you already have.
    row: 0, // Row the layer is in on the tree (0 is the first row).
    layerShown() { 
        return true
    }
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
    gainMult() { // Calculate the multiplier for main currency from bonuses.
        let mult = new Decimal(1)
        if (hasUpgrade('h', 13)) {
            mult = mult.times(upgradeEffect('h', 13))
        }
        if (hasUpgrade('o', 11)) {
            mult = mult.pow(upgradeEffect('o', 11))
        }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses.
        return new Decimal(1)
    },
    doReset(resettingLayer){
        let keep=[];
        if(hasMilestone("w",0)){
        //    keep.push("milestones")
            keep.push("upgrades")}
        if(layers[resettingLayer].row>this.row) layerDataReset(this.layer,keep)
    },
    bars: {
        progressBar: {
            direction: RIGHT,
            width: 600,
            height: 50,
            progress() { 
                if (hasUpgrade("h",31) == false ) {
                    return player.h.points.divide(200)
                }
                else {
                    return 0
                }
            },
            display() {
                return "Reach 200 Hydrogen to unlock next reward"
            },
            unlocked() {
                return true
            }
        },
    },
    upgrades: {
        11: {
            title: "this is useless",
            description: "buy this and you will have bought this <marquee>jk lol it doubles vapor gain</marquee>",
            cost: new Decimal(1),
            effectDisplay() { 
                return "2x" 
            },
        },
        12: {
            title: "omg me degening worked",
            description: "buy this to support my efforts and boost vapor gain based on hydrogen",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x" 
            },
        },
        13: {
            title: "idk",
            description: "it broke right? (lowers hydrogen requirement and boosts vapor gain based on vapor)",
            cost: new Decimal(3),
            effect() {
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x" 
            },
        },
        21: {
            title: "Nuclear Fusion",
            description: "Successfully test fusion, fueling scientific discovery.",
            cost: new Decimal(10),
        },
        22: {
            title: "Stellar Fusion",
            description: "Using the same process as a supernova this will unlock...",
            cost: new Decimal(400),
        },
        31: {
            title: "Triple Alpha Process",
            description: "Fuse three hydrogens to obtain the exotic...He, creating much energy in the process.",
            cost: new Decimal(1250),
            effect() {
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id)) 
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
                "upgrades"
            ] // Removed extra {} here.
        },
        "Discovery": {
            unlocked() {
                if (hasUpgrade("h",21)) { return true }
                else { return false }
            },
            content: [
                "main-display",
                "blank",
                ["bar","progressBar"],
            ] // Removed extra {} here.
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
        let keep=[];
        if(hasMilestone("w",2)){
            keep.push("points")}
        if(hasMilestone("w",1)){
            keep.push("milestones")}
        if(layers[resettingLayer].row>this.row) layerDataReset(this.layer,keep)
    },
    upgrades: {
        11: {
            title: "Nuclear Fission",
            description: "Oxygen boosts hydrogen gain",
            cost: new Decimal(2),
            effect() {
                return player.o.points.add(1).pow(0.25)
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id))
            },
        },
        21: {
            title: "Unlock Next Layer",
            description: "Unlocks next layer...what will it be?",
            cost: new Decimal(3),
            effect() {
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x" 
            },
        },
    },
    layerShown() { 
        if (hasUpgrade("h",22)) { return true }
        else { return false }
    }
})
addLayer("w", {
    name: "water", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 0, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    branches: ["h","o"],
    effect() {
        return player[this.layer].points.sqrt().add(1)
    },
    effectDescription() {return "which is boosting vapor generation by "+String(player[this.layer].points.sqrt().add(1).multiply(100).round().divide(100)) + "x"},
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#88BBFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account.
    resource: "water", // Name of prestige currency.
    baseResource: "min(h,2o)", // Name of resource prestige is based on.
    baseAmount() { if (player.h.points.lt(player.o.points.multiply(2))) return player.h.points
                 return player.o.points.multiply(2)
    }, // Get the current amount of baseResource.
    type: "normal", // 'normal': cost to gain currency depends on amount gained. 'static': cost depends on how much you already have.
    exponent: 0.5, // Prestige currency exponent.
    gainMult() { // Calculate the multiplier for main currency from bonuses.
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses.
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row).
    milestones: {
        0: {
            requirementDescription: "5 water",
            effectDescription: "keep hydrogen upgrades on reset",
            done() { return player.w.points.gte(5) }
        },
        1: {
            requirementDescription: "10 water",
            effectDescription: "keep oxygen updrages on reset",
            done() { return player.w.points.gte(10) }
        },
        2: {
            requirementDescription: "15 water",
            effectDescription: "keep oxygen on reset",
            done() { return player.w.points.gte(15) }
        },
    },
    hotkeys: [
        { key: "w", description: "W: Reset for water", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { 
        if (hasUpgrade("o",21)) { return true }
        else { return false }
    }
})
