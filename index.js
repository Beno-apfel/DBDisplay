import PogObject from "PogData"
import { DraggableGui } from "../Atomx/draggable/DraggableGui"
import Dungeon from "../BloomCore/Dungeons/Dungeon";

const data = new PogObject("DBDisplay", {
    pos: { x: 0, y: 0, scale: 1 },
    toggled: true,
    firstInstall: true
})

const editGui = new DraggableGui(data, data.pos).setCommand("dbmove")

let chargesText = "&fWaiting..."
let dungbslot = -1
let chargesMatch = null

const isInHotbar = (slot) => slot >= 0 && slot < 8

editGui.onRender(() => {
    Renderer.retainTransforms(true)
    Renderer.translate(editGui.getX(), editGui.getY())
    Renderer.scale(editGui.getScale())
    Renderer.drawStringWithShadow(chargesText, 0, 0)
    Renderer.retainTransforms(false)
    Renderer.finishDraw()
})

const thing = register("step", () => {
    if (!World.isLoaded()) return
    if (!data.firstInstall) return thing.unregister()

    ChatLib.chat("&f[&aDB Display&f]\n&aUse command &6/dbmove &ato move the display\n&6/db &ato toggle the display")
    data.firstInstall = false
    data.save()

    thing.unregister()
}).setFps(1)

register("step", () => {
    const dungbid = [278]
    dungbslot = Player.getInventory().getItems().findIndex(item => dungbid.includes(item?.getID()))

    if (dungbslot === -1 || !isInHotbar(dungbslot)) {
        chargesMatch = null
        chargesText = "&cNo Dungeobreaker found\n &cin your inventory"
        return
    }

    const item = Player.getInventory().getStackInSlot(dungbslot)
    if (item && item.getLore()) {
        const loreText = item.getLore().join("\n")
        chargesMatch = loreText.match(/§7Charges: §e(\d+)§7\/§e\d+§c⸕/)
        if (chargesMatch) {
            const charges = parseInt(chargesMatch[1])
            let color = "&c"
            if (charges > 15) color = "&a"
            else if (charges > 7) color = "&e"
            chargesText = `&fCharges:\n${color}${charges}/20`
        } else {
            chargesText = "&cUnable to read charges"
        }
    } else {
        chargesMatch = null
        chargesText = "&cNo Dungeobreaker found in your inventory"
    }
}).setFps(0.2)


register("renderOverlay", () => {
    if (!data.toggled || !Dungeon.inDungeon) return
    if (!World.isLoaded() || editGui.isOpen()) return

    Renderer.retainTransforms(true)
    Renderer.translate(editGui.getX(), editGui.getY())
    Renderer.scale(editGui.getScale())
    Renderer.drawStringWithShadow(chargesText, 0, 0)
    Renderer.retainTransforms(false)
    Renderer.finishDraw()
})

register("command", (...args) => {
  switch(args[0]) {
    case "toggle":
      data.toggled = !data.toggled;
      data.save();
      ChatLib.chat(`&f[&aDB Display&f] &fis now ${data.toggled ? "&aenabled" : "&cdisabled"}`);
      break;
    default:
      ChatLib.chat(`&f[&aDB Display&f]\n&aUse command &6/dbdmove &ato move the display\n&6/db toggle &ato toggle the display`);
      break;
  }
}).setName("dbd").setAliases(["db"]);