/// <reference path="../.././definitions/jquery.d.ts" />
/// <reference path="../.././definitions/underscore.d.ts" />
/// <reference path="../.././definitions/kendo.web.d.ts" />

import CyApp = require('../../cy-app');
import CyEvents = require('../../cy-events');
import CyTemplates = require('../../util/cy-templates');
import CyWidget = require('./cy-widget');

/**
 *  The split view class
 *
 *  @module CyUI
 *  @submodule Component
 *  @class CySplitter
 */
class CySplitter extends CyWidget {
    /**
     * Construct a split view class
     *
     * @class CySplitter
     * @constructor
     * @param owner : the owner of the splitter
     * @param parent : the parent split view of the view, null for root.
     * @param content {JQuery} : the content container for the view.
     * @param name {String} : the name of the split view for quick access.
     * @param orientation {String} : the orientation of the split view.
     * @optional
     */
    constructor(public owner:any, public parent:any, content:JQuery, public name:string, public orientation?:string) {
        super("CySplitter");

        if (!orientation) this.orientation = 'horizontal';

        this._e = content;

        // This method is not constructiong any DOM element so it's very lightweight.
        // It's added here to avoid calling this method in every attributes getters.
        this.buildElement();
    }

    /**
     * Build the element lazily
     *
     * @returns {JQuery}
     */
    public buildElement() : JQuery {
        // Add a custom class for the split view.
        this.element.addClass(CySplitter.kSPLIT_VIEW_CLASS);

        // Add a attribute to the content container for quick access of the content.
        this.element.attr(CySplitter.kSPLIT_VIEW_NAME_ATTR, this.name);

        // Bind the view to the jquery object. For example:
        //
        // var el = $('[cyan-split-view-name="root"]');     // instance of JQuery
        // var view = el.data('view');                      // instance of CySplitter
        this.element.data('CySplitter', this);

        // Initialize children array
        this.children = [];

        // Initialize the eventTokens
        this.eventTokens = new CyEvents.EventIDList(CyApp.I.eventBus);

        // Resize the tab window
        this.eventTokens.add(CyApp.I.eventBus.on(CyApp.kBROWSER_RESIZED, $.proxy(this.resize, this)));

        return this.element;
    }

    /**
     * Construct a split view from JSON input. The JSON should have the following structure.
     *
     * @example {
     * @example     name: <name> of the split view (optional),
     * @example     orientation: <orientation> of the split view (optional),
     * @example     children: [
     * @example         <child>,
     * @example         <child>
     * @example         ...
     * @example     ], // each child should follow the same JSON structure. (optional)
     * @example     options: [
     * @example         <option>,
     * @example         <option>
     * @example         ...
     * @example     ] // Optional setting for each of the child,
     * @example       // Please refer to http://docs.kendoui.com/api/web/splitter#configuration
     * @example       // If no option is provided, null is required to match the indexes.
     * @example       // This attribute is required if children is included.
     * @example }
     *
     * @method splitViewFromJSON
     * @static
     * @param owner Owner of the root node
     * @param content Split view container
     * @param json The JSON object that represent the structure of the split view.
     * @returns The constructed CySplitter object
     */
    public static splitViewFromJSON(owner:any, content:JQuery, json:any) : CySplitter {
        if (!json.name) json.name = Math.random().toString();

        var view:CySplitter = new CySplitter(owner, null, content, json.name, json.orientation);

        if (json.children && json.options && json.children.length === json.options.length) {
            json.children.forEach(function(childJson, index) {
                var option = json.options[index];

                if (!view.splitDiv || !view.splitter) {
                    view._init();
                } else {
                    view.splitter.append(option);
                }

                var child:CySplitter = CySplitter.splitViewFromJSON(owner, $('.k-pane', view.splitDiv).last(), childJson);

                child.parent = view;

                view.children.push(child);
            });
        }

        return view;
    }

    /**
     * Remove things that should be destroyed.
     *
     * @method destroy
     */
    public destroy() : void {
        // Remove self from parent
        if (this.parent) {
            var idx = this.parent.children.indexOf(this);

            if (idx != -1) this.parent._remove(idx);
            else throw 'Exception: child not found in parent in destroy().'
        }

        // Remove all children
        if (this.children && this.children.length) {
            this.children.forEach(function(child) {
                child.destroy();
            })
        };
        this.children.length = 0;

        // Reset all variables & attributes
        this.name = null;

        this.orientation = null;

        this.name = null;

        if (this.splitDiv && this.splitter) {
            this.splitter.unbind('resize', this.viewResized);

            this.splitter.destroy();

            this.splitDiv = null;
        }

        this.eventTokens.allOff();

        this.splitDiv = null;

        this.owner = null;

        this.parent = null;

        this._e = null;
    }

    /**
     * Since Kendo UI doesn't allow a splitter view with 0 subviews,
     * this method is called in append instead to initialize the splitter.
     *
     * @method init
     * @param name
     * @param options
     * @private
     * @returns {null}
     */
    private init(name?:string, options?:any) : CySplitter {
        if (!name) name = Math.random().toString();

        var childContent = this.element.children().remove();

        this._init(options);

        var newChild = new CySplitter(this.owner, this, $('.k-pane', this.splitDiv).last(), name);

        this.children.push(newChild);

        newChild.element.append(childContent);

        this.splitter.bind('resize', $.proxy(this.viewResized, this));

        return null;
    }

    /**
     * Initialize the splitter view, a helper method to init
     *
     * @method _init
     * @param options
     * @private
     */
    private _init(options?:any) : void {
        if (!options) options = {
            collapsible: false
        };

        this.splitDiv = CyTemplates.cloneTemplate('cyan-split-view-template');

        this.splitDiv.appendTo(this.element);

        this.splitDiv.kendoSplitter({
            orientation: this.orientation,
            panes: [options]
        });
    }

    /**
     * Append a new pane to current view.
     * If this view doesn't have children, this method will add a child and move everything
     * in this.element to this.children[0].element.
     *
     * @method append
     * @param name
     * @optional
     * @param options
     * @optional
     * @returns {*}
     */
    public append(name?: string, options?:any) : CySplitter {
        if (this.children.length) {
            if (!name) name = Math.random().toString();

            this.splitter.append(options);

            var newChild = new CySplitter(this.owner, this, $('.k-pane', this.splitDiv).last(), name);

            this.children.push(newChild);

            return newChild;
        } else {
            return this.init(name, options);
        }
    }

    /**
     * Insert a new pane to current view before current index
     *
     * @method insertBefore
     * @param idx
     * @param name
     * @param options
     */
    public insertBefore(idx:number, name?: string, options?:any) : CySplitter {
        if (idx >= this.children.length || idx < 0) {
            throw "Index exception: Can't insert before pane " + idx;
        }

        if (this.children.length) {
            if (!name) name = Math.random().toString();

            var oldChild = this.element.children().children('.k-pane').eq(idx);

            this.splitter.insertBefore(options, oldChild);

            var newChild = new CySplitter(this.owner, this, $('.k-pane', this.splitDiv).eq(idx), name);

            this.children.splice(idx, 0, newChild);

            return newChild;
        } else {
            return this.init(name, options);
        }
    }

    /**
     * Insert a new pane to current view after current index
     *
     * @method insertAfter
     * @param idx
     * @param name
     * @param options
     * @return {CySplitter} insertedView
     */
    public insertAfter(idx:number, name?: string, options?:any) : CySplitter {
        if (idx == this.children.length - 1) return this.append(name, options);
        else return this.insertBefore(idx + 1, name, options);
    }

    /**
     * Remove child at index 'idx' or child from current view.
     *
     * @method remove
     * @param input {any}
     */
    public remove(input: any) : void {
        // Remove a CySpliltter child
        if (input instanceof CySplitter) {
            var idx = this.children.indexOf(input);

            if (idx != -1) this.remove(idx)
            else throw 'Exception: Child not found.'

        // Remove child at index
        } else if ((typeof input) === 'number') {

            if (input >= 0 && input < this.children.length) {
                var child = this.children[input];
                child.destroy();
            } else {
                throw "Index Exception: Can't remove subview for an invalid index."
            }
        } else {
            throw "Exception: Unrecognized input in method remove."
        }
    }

    /**
     * Remove child at index.
     * Called by destroy
     *
     * @method _remove
     * @param idx {number}
     * @private
     */
    private _remove(idx: number) {
        if (this.children.length > 1) {
            var count = this.children.length;

            if (idx < count) {
                // Removing last pane
                this.children.splice(idx, 1);

                var panesToRemove:JQuery = $('[' + CySplitter.kSPLIT_VIEW_NAME_ATTR + '="' + this.name + '"]').children().children('.k-pane').eq(idx);

                var that = this.splitter;
                if (panesToRemove.length) {
                    kendo.destroy(panesToRemove);

                    panesToRemove.each(function(idx, element) {
                        that.options.panes.splice($(element).index('[' + CySplitter.kSPLIT_VIEW_NAME_ATTR + '="' + this.name + '"]'), 1);
                        $(element).remove();
                    })

                    that._removeSplitBars();

                    if (that.options.panes.length) {
                        that.trigger('resize');
                    }
                }
            } else {
                throw "Index exception: Can't remove pane at index " + idx + '.'
            }
        } else if (this.children.length == 1) {

            if (this.splitDiv && this.splitter) {
                this.splitter.unbind('resize');

                this.splitter.destroy();
            }

            this.children.length = 0;

            this.element.empty();

            this.splitDiv = null;

        } else {
            throw "Index Exception: Can't remove subview for an invalid index."
        }
    }

    /**
     * Remove all panes and set current view to be a content view.
     *
     * @method removeAll
     */
    public removeAll() : void {

        if (this.children && this.children.length) {
            this.children.forEach(function(child) {
                child.destroy();
            })
        };

        this.children.length = 0;

        this.element.empty();

        if (this.splitDiv && this.splitter) {
            this.splitter.unbind('resize');

            this.splitter.destroy();
        }

        this.splitDiv = null;
    }

    /**
     * Set the orientation of the split view.
     *
     * @method setOrientation
     * @param orientation
     */
    public setOrientation(orientation:string) {
        if (this.children.length) {
            if (orientation === 'horizontal' || orientation === 'vertical') {
                this.orientation = orientation;

                this.splitter.orientation = this.splitter.options.orientation = orientation;

                // A hack to get the splitter to work after setting the orientation
                // http://www.kendoui.com/forums/kendo-ui-web/splitter/is-it-possible-to-change-splitter-orientation-.aspx

                this.splitDiv.children(".k-splitbar").remove();

                this.splitDiv.children(".k-pane").css({width: "", height: "", top: "", left: ""});

                var panes = this.splitter.options.panes;

                this.splitter.destroy();

                this.splitDiv.kendoSplitter({
                    orientation: orientation,
                    panes: panes
                });
            } else {
                throw "Exception: Unrecognized orientation."
            }
        } else {
            this.orientation = orientation;
        }
    }

    /**
     * Toggle the orientation
     *
     * @method toggleOrientation
     */
    public toggleOrientation() : void {
        this.setOrientation(this.orientation === "vertical" ? "horizontal" : "vertical");
    }

    /**
     * Resize the splitter view
     *
     * @method resize
     */
    public resize() : void {
        if (this.children.length) {
            this.splitDiv.children(".k-splitbar").remove();

            this.splitDiv.children(".k-pane").css({width: "", height: "", top: "", left: ""});

            this.splitter.trigger('resize');

            this.viewResized();
        }
    }

    /**
     * @method viewResized
     * @private
     */
    private viewResized() : void {
        CyApp.I.eventBus.trigger(CySplitter.kSPLIT_VIEW_RESIZED, {
            sender : this,
            width  : $(window).width(),
            height : $(window).height()
        });
    }

    /**
     * Set a new name for current split view.
     *
     * @method setName
     * @param name
     */
    public setName(name:string) : void {
        this.name = name;
        this.element.attr(CySplitter.kSPLIT_VIEW_NAME_ATTR, this.name);
    }

    /**
     * Get split view by its name
     *
     * @method findSplitViewByName
     * @example
     $.findSplitViewByName('root');
     * @param name
     * @param context
     * @returns {*}
     */
    public static findSplitViewByName(name: string, context?:JQuery) {
        var viewJQuery = $('[' + CySplitter.kSPLIT_VIEW_NAME_ATTR + '="' + name + '"]', context ? context : null);
        return viewJQuery.length ? viewJQuery.data('CySplitter') : null;
    }

    /**
     * Obtain the splitter instance
     *
     * @method splitter
     * @returns {kendo.ui.Splitter} splitter
     */
    public get splitter() : kendo.ui.Splitter {
        return this.splitDiv.data("kendoSplitter");
    }

    /**
     * Return true if this view doesn't have any children (that's used as a content container).
     *
     * @method isContentView
     * @returns boolean
     */
    public get isContentView() : boolean {
        return this.children && this.children.length == 0;
    }

    /**
     * Return true if this view doesn't have any content
     *
     * @method isEmpty
     * @returns boolean
     */
    public get isEmpty() : boolean {
        return this.element && this.element.children().length == 0;
    }

    /**
     * @property {JQuery} splitDiv
     */
    public splitDiv :JQuery;

    /**
     * @property {Array} children
     */
    public children:CySplitter[];

    /**
     * @static
     * @property {String} kSPLIT_VIEW_CLASS
     */
    public static kSPLIT_VIEW_CLASS = "cyan-split-view";

    /**
     * @static
     * @property {String} kSPLIT_VIEW_NAME_ATTR
     */
    public static kSPLIT_VIEW_NAME_ATTR = "cyan-split-view-name";

    /**
     * @static
     * @property {String} kSPLIT_VIEW_RESIZED
     */
    public static kSPLIT_VIEW_RESIZED = "cyan-split-view-resized";

    /**
     * lookup for tracking event subscriptions to the main event bus
     *
     * @property {CyEvents.EventIDList} eventTokens
     * @private
     */
    private eventTokens:CyEvents.EventIDList;
}

export = CySplitter;

/**
 * Add findSplitViewByName to JQuery if it is defined.
 */
if ($) {
    $.findSplitViewByName = CySplitter.findSplitViewByName;
}