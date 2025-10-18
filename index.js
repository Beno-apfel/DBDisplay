import PogObject from "PogData"
import { DraggableGui } from "../Atomx/draggable/DraggableGui"
import Dungeon from "../BloomCore/Dungeons/Dungeon";
import Settings from "./config";

register("command", () => {
    Settings.openGUI()
}).setName("db").setAliases(["dungeonbreakerdisplay", "dbd"])

const data = new PogObject("DBDisplay", {
    pos: { x: 0, y: 0, scale: 1 },
    firstInstall: true
})

const editGui = new DraggableGui(data, data.pos).setCommand("dbmove")

let chargesText = "&fWaiting..."
let dungbslot = -1
let chargesMatch = null

const isInHotbar = (slot) => slot >= 0 && slot < 8
const pickaxe = new Item("diamond_pickaxe");

function updateChargesText() {
    if (!Player.getInventory()) return

    const dungbid = [278]
    dungbslot = Player.getInventory().getItems().findIndex(item => dungbid.includes(item?.getID()))

    if (dungbslot === -1 || !isInHotbar(dungbslot)) {
        chargesMatch = null
        chargesText = "&cNo Dungeobreaker found\n&cin your inventory"
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
            chargesText = `${color}${charges}/20`
        } else {
            chargesText = "&cUnable to read charges"
        }
    } else {
        chargesMatch = null
        chargesText = "&cNo Dungeobreaker found\nin your inventory"
    }
}

editGui.onRender(() => {
    Renderer.retainTransforms(true)
    Renderer.translate(editGui.getX(), editGui.getY())
    Renderer.scale(editGui.getScale())
    if (!Settings.prefix) {
    Renderer.drawStringWithShadow("&fCharges:", 0, 0)}
    if (Settings.icon) {
    pickaxe.draw(-2, 8);
    Renderer.drawStringWithShadow(chargesText, 18, 4)}
    else {
    Renderer.drawStringWithShadow(chargesText, 0, 10)}
    Renderer.retainTransforms(false)
    Renderer.finishDraw()
})

const thing = register("step", () => {
    if (!World.isLoaded()) return
    if (!data.firstInstall) return thing.unregister()

    ChatLib.chat("&f[&aDB Display&f]\n&aUse command &6/db to open the config")
    data.firstInstall = false
    data.save()

    thing.unregister()
}).setFps(1)

// run updates every 5s
register("step", updateChargesText).setFps(0.2)

// also trigger once after world load (fixes the /ct load issue)
register("worldLoad", () => {
    setTimeout(updateChargesText, 1000)
})

register("renderOverlay", () => {
    if (!Settings.toggle || !Dungeon.inDungeon) return
    if (!World.isLoaded() || editGui.isOpen()) return

    Renderer.retainTransforms(true)
    Renderer.translate(editGui.getX(), editGui.getY())
    Renderer.scale(editGui.getScale())
    if (!Settings.prefix) {
    Renderer.drawStringWithShadow("&fCharges:", 0, 0)}
    if (Settings.icon) {
    pickaxe.draw(-2, 8);
    Renderer.drawStringWithShadow(chargesText, 18, 4)}
    else {
    Renderer.drawStringWithShadow(chargesText, 0, 10)}
    Renderer.retainTransforms(false)
    Renderer.finishDraw()
})