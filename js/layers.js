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
        },
        13: {
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
                if (hasAchievement("a", 11) && !hasAchievement("a", 12)) {
                    return player.h.points.divide(100);
                } else if (hasAchievement("a", 12)) {
                    if (player.h.points.gt(300) && player.o.points.gt(300)) {
                        return new Decimal(1);
                    } else if (player.h.points.gt(300) && !player.o.points.gt(300)) {
                        return player.o.points.divide(300).divide(2).add(0.5);
                    } else if (player.o.points.gt(300) && !player.h.points.gt(300)) {
                        return player.h.points.divide(300).divide(2).add(0.5);
                    } else {
                        return player.h.points.divide(300).divide(2).add(player.o.points.divide(300).divide(2));
                }
                } else {
                    return new Decimal(0);
                }
            },

            display() {
                if (hasAchievement("a",11) && !hasAchievement("a",12)) {
                    return "Reach 100 Hydrogen to unlock next reward"
                } else if (hasAchievement("a",12)) {
                    return "Reach 300 Hydrogen and Oxygen to unlock next reward"
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
            cost: new Decimal(150),
        },
        31: {
            title: "Triple Alpha Process",
            description: "Fuse three hydrogens to obtain the exotic...He, creating much energy in the process.",
            cost: new Decimal(750),
            effect() {
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id)) 
            },
            unlocked() {
                if (hasAchievement("a",12)) {
                    return true
                }
                else {
                    return false
                }
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
                if (hasUpgrade("h",21) || hasAchievement("a",11)) { return true }
                else { return false }
            },
            content: [
                "main-display",
                "blank",
                ["bar","progressBar"],
                "blank",
                "blank",
                ["upgrades","3"]
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
            keep.push("upgrades")}
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
            title: "SelfOxygen",
            description: "Oxygen boosts Oxygen gain",
            cost: new Decimal(30),
            effect() {
                return player.o.points.add(1).pow(0.25)
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id))
            },
        },
         22: {
            title: "CarOxySynergy",
            description: "Oxygen boosts Carbon gain",
            cost: new Decimal(270),
            effect() {
                return player.o.points.add(1).pow(0.25)
            },
            effectDisplay() { 
                return "^" + format(upgradeEffect(this.layer, this.id))
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
        if (hasUpgrade("h",22) || hasAchievement("a",13)) { return true }
        else { return false }
    }
})
addLayer("n", {
    name: "nitrogen", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 0, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
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
    row: 0, // Row the layer is in on the tree (0 is the first row).
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
    layerShown() {
        return true
    }
})
addLayer("c", {
    name: "carbon", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 0, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
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
        let keep=[];
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
        return true
    }
})
addLayer("co", {
    name: "carbon dioxide", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "CO", // This appears on the layer's node. Default is the id with the first letter capitalized.
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
        return true
    }
})
addLayer("aaa", {
    name: "aaaaaaaa", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "AAAAA", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 1, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    startData() { 
        return {
            unlocked: false,
            points: new Decimal(0),
        }
    },
    color: "#F17F3D",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account.
    resource: "aaaaaaaaaaaaaaaa", // Name of prestige currency.
    baseResource: "vapor", // Name of resource prestige is based on.
    baseAmount() { return new Decimal(0) }, // Get the current amount of baseResource.
    type: "normal", // 'normal': cost to gain currency depends on amount gained. 'static': cost depends on how much you already have.
    exponent: 0.5, // Prestige currency exponent.
    row: 2, // Row the layer is in on the tree (0 is the first row).
    layerShown() { 
        return "ghost"
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
    baseResource: "H,2O", // Name of resource prestige is based on.
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
    row: 2, // Row the layer is in on the tree (0 is the first row).
    milestones: {
        0: {
            requirementDescription: "5 water",
            effectDescription: "keep hydrogen upgrades on reset",
            done() { return player.w.points.gte(5) }
        },
        1: {
            requirementDescription: "10 water",
            effectDescription: "keep oxygen upgrades on reset",
            done() { return player.w.points.gte(10) }
        },
    },
    hotkeys: [
        { key: "w", description: "W: Reset for water", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { 
        if (hasUpgrade("o",31) || hasAchievement("a",13)) { return true }
        else { return false }
    }
})
