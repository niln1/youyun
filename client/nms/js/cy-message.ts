/**
 * This file serves as the main location for all event messages.  Currently, these strings are all over the place
 * within their respective classes from when they're generated.  This file should be updated with newer events from here
 * on out.
 */

class CyMessage {

    public static get kFORM_SUBMIT() : string {
        return "cyan-form-submit";
    }

    public static get kFORM_SUBMIT_SUCCESS() : string {
        return "cyan-form-submit-success";
    }

    public static get kFORM_SUBMIT_ERROR() : string {
        return "cyan-form-submit-error";
    }

    public static get kTOOLBAR_BUTTON_CLICKED() : string {
        return "cyan-toolbar-button-clicked";
    }

    public static get kNEW_SERVICES_CLICKED() : string {
        return "cyan-new-services-clicked";
    }

    public static get kCONNECTOR_DATA_CHANGED() : string {
        return "cyan-connector-data-changed";
    }

    public static get kGRID_SELECTION_DBLCLICKED() : string {
        return "cyan-grid-selection-dblclicked'";
    }

    public static get kUSER_MENU_ITEM_SELECTED() : string {
        return "cyan-user-menu-item-selected";
    }
}

export = CyMessage;
