addLayer("d", {
    name: "discovery", // This is optional, only used in a few places. If absent, it just uses the layer id.
    symbol: `<img src="resources/icon/sciencebeaker.png" alt="D" class="icon-img">`, // This appears on the layer's node. Default is the id with the first letter capitalized.
    position: "side", // Horizontal position within a row. By default, it uses the layer id and sorts in alphabetical order.
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
    softcapPower: new Decimal(0.04),
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
        if (layerShown("w") && player.w.dew !== 0) {
            mult = mult.times(player.w.dew.plus(1).sqrt())
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
        12: {
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
        13: {
            title: "Stellar Fusion",
            description: "Using the same process as a supernova this will unlock...",
            cost: new Decimal(550),
            unlocked() {
                return hasUpgrade("h",32)
            },
        },
        14: {
            title: "CNO Cycle",
            description: "Using the CNO cycle of stars we can find new elements.",
            cost: new Decimal(2250),
            unlocked() {
                return hasAchievement("a", 21)
            },
        },
    },
    tabFormat: {
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
                "upgrades",
            ]
        },
    },
    row: 0, // Row the layer is in on the tree (0 is the first row).
    layerShown() { return true }
})
