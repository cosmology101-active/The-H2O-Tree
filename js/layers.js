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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses.
        return new Decimal(1)
    },
    upgrades: {
        11: {
            title: "this is useless",
            description: "buy this and you will have bought this <marquee>jk lol</marquee>",
            cost: new Decimal(1),
        },
        12: {
            title: "omg me degening worked",
            description: "buy this to support my efforts",
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
            description: "it broke right?",
            cost: new Decimal(3),
            effect() {
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() { 
                return format(upgradeEffect(this.layer, this.id)) + "x" 
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
            content: [] // Removed extra {} here.
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
    position: 0, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
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
    layerShown() { return true }
})
addLayer("w", {
    name: "water", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: 0, // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
    branches: ["h","o"],
    effect() {
        return player[this.layer].points.sqrt()
    },
    effectDescription: String(player.w.points.sqrt()),
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
    hotkeys: [
        { key: "w", description: "W: Reset for water", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return true }
})
