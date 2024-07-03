addLayer("e", {
    name: "element", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized.
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
    baseResource: "Vapor", // Name of resource prestige is based on.
    baseAmount() { return player.points }, // Get the current amount of baseResource.
    type: "normal", // 'normal': cost to gain currency depends on amount gained. 'static': cost depends on how much you already have.
    exponent: 0.5, // Prestige currency exponent.
    gainMult() { // Calculate the multiplier for main currency from bonuses.
        let mult = new Decimal(1)
        if (hasUpgrade('e', 13)) {
            mult = mult.times(upgradeEffect('e', 13))
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
        "Main tab": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "display-text",
                "blank",
                ["toggle", ["e", "beep"]],
                "milestones",
                "blank",
                "blank",
                "upgrades"
            ] // Removed extra {} here.
        },
        "Other tab": {
            content: [] // Removed extra {} here.
        },
    },
    row: 0, // Row the layer is in on the tree (0 is the first row).
    hotkeys: [
        { key: "e", description: "E: Reset for prestige points", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() { return true }
})
