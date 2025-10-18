import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty, @SliderProperty, @TextProperty, @ColorProperty, Color } from "../Vigilance/index"

@Vigilant('DBDisplay', 'DBDisplay', {
    getCategoryComparator: () => (a, b) => {
        const categories = ['General'];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    @SwitchProperty({
        name: "Toggle Display",
        description: "Toggles the Dungeonbreaker Charge Display",
        category: "General"
    })
    toggle = true;

    @SwitchProperty({
        name: "Hide Prefix",
        description: "Hides the Charges Text",
        category: "General"
    })
    prefix = false;

    @SwitchProperty({
        name: "Show icon",
        description: "Shows a Dungeonbreaker icon before the amount of charges you have",
        category: "General"
    })
    icon = true;

    @ButtonProperty({
        name: "Move Dungeonbreaker Display",
        description: "Moves the Dungeonbreaker Charge GUI",
        category: "General",
        placeholder: "Move"
    })
    MoveGui() {
        Client.currentGui.close()
        ChatLib.command("dbmove", true)
    };

    constructor() {
        this.initialize(this);

    }
}

export default new Settings();