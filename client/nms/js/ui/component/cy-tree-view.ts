/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
/// <reference path="../../definitions/kendo.web.d.ts" />

import CyApp = require('../../cy-app');
import CyEvents = require('../../cy-events');
import CyTemplates = require('../../util/cy-templates');
import CyWidget = require('./cy-widget');

class CyTreeView extends CyWidget {
    /**
     * Constructor of CyTreeView
     * @param options
     */
    constructor(private options? : kendo.ui.TreeViewOptions) {
        super("CyTreeView");
    }

    /**
     * Build the component and return the outer jquery selector
     */
    public buildElement() : JQuery {
        var template = CyTemplates.cloneTemplate(CyTreeView.CyTreeViewTemplateName);

        template.kendoTreeView(this.options);
         
        this._kendoTreeView = template.data('kendoTreeView');

        return template;
    }

    /**
     * Dispose
     */
    public dispose() {
        super.dispose();

        if (this._kendoTreeView) {
            this._kendoTreeView.destroy();
        }
    }

    /****************************************************************************************************
     * append
     ****************************************************************************************************/

    /**
     * Append
     * @param nodeData
     * @param parentNode
     */
    public append(nodeData: any, parentNodeUID?: string): JQuery {
        if (!this._kendoTreeView) return null;

        var parentNode : JQuery = null;

        if (parentNodeUID) {
            parentNode = this._kendoTreeView.findByUid(parentNodeUID);
        }

        return this._kendoTreeView.append(nodeData, parentNode);
    }

    /****************************************************************************************************
     * collapse
     ****************************************************************************************************/

    /**
     * Collapse using JQuery selector
     * @param nodes
     */
    public collapse(nodes: JQuery): void {
        if (!this._kendoTreeView) return null;

        this._kendoTreeView.collapse(nodes);
    }

    /****************************************************************************************************
     * expand
     ****************************************************************************************************/

    /**
     * expand using JQuery selectors
     */
    public expand(nodes: JQuery): void {
        if (!this._kendoTreeView) return;

        this._kendoTreeView.collapse(nodes);
    }

    /****************************************************************************************************
     * dataItem
     ****************************************************************************************************/

    /**
     * Returns the data item
     *
     * See: http://docs.kendoui.com/api/web/treeview#methods-dataItem
     */
    public dataItem(nodes: JQuery): kendo.data.Node {
        if (!this._kendoTreeView) return null;

        return this._kendoTreeView.dataItem(nodes);
    }

    /****************************************************************************************************
     * detach
     ****************************************************************************************************/    

    /**
     * Removes a node from a TreeView, but keeps its jQuery.data() objects using JQuery selectors string
     */
    public detach(nodes: JQuery): JQuery {
        if (!this._kendoTreeView) return null;

        return this._kendoTreeView.detach(nodes);
    }

    /****************************************************************************************************
     * enable
     ****************************************************************************************************/

    /**
     * Enable nodes by JQuery selectors
     */
    public enable(nodes: JQuery): void {
        if (!this._kendoTreeView) return;

        this._kendoTreeView.enable(nodes, true);
    }

    /****************************************************************************************************
     * disable
     ****************************************************************************************************/

    /**
     * Disable nodes by JQuery selectors
     */
    public disable(nodes: JQuery): void {
        if (!this._kendoTreeView) return;

        this._kendoTreeView.enable(nodes, false);
    }

    /****************************************************************************************************
     * find
     ****************************************************************************************************/

    /**
     * Find by text
     */
    public findByText(text: string): JQuery {
        if (!this._kendoTreeView) return null;

        return this._kendoTreeView.findByText(text);
    }

    /**
     * Find by UID
     */
    public findByUid(text: string): JQuery {
        if (!this._kendoTreeView) return null;

        return this._kendoTreeView.findByText(text);
    }

    /****************************************************************************************************
     * insert
     ****************************************************************************************************/    

    /**
     * Insert after
     */
    public insertAfter(nodeData: any, referenceNodeUid: string): void {
        if (!this._kendoTreeView) return;

        var refNode = this._kendoTreeView.findByUid(referenceNodeUid);

        this._kendoTreeView.insertAfter(nodeData, refNode);
    }

    /**
     * Insert before
     */
    public insertBefore(nodeData: any, referenceNodeUid: string): void {
        if (!this._kendoTreeView) return;

        var refNode = this._kendoTreeView.findByUid(referenceNodeUid);

        this._kendoTreeView.insertBefore(nodeData, refNode);
    }

    /****************************************************************************************************
     * parent
     ****************************************************************************************************/

    /**
     * Parent of current node
     */
    public parent(nodes: JQuery): JQuery {
        if (!this._kendoTreeView) return null;

        return this._kendoTreeView.parent(nodes);
    }

    /****************************************************************************************************
     * remove
     ****************************************************************************************************/

    /**
     * Remove by jquery selector
     */
    public remove(nodes: JQuery): void {
        if (!this._kendoTreeView) return;

        this._kendoTreeView.remove(nodes);
    }

    /****************************************************************************************************
     * select
     ****************************************************************************************************/

    /**
     * Select node by JQuery
     */
    public select(node?: JQuery): void {
        if (!this._kendoTreeView) return;

        this._kendoTreeView.select(node);
    }

    /****************************************************************************************************
     * setDataSource
     ****************************************************************************************************/

    /**
     *
     */
    public setDataSource(dataSource: kendo.data.HierarchicalDataSource): void {
        if (!this._kendoTreeView) return;

        this._kendoTreeView.setDataSource(dataSource);
    }

    /****************************************************************************************************
     * text
     ****************************************************************************************************/

    /**
     * get or set text
     */
    public text(node: JQuery, newText?: string): string {
        if (!this._kendoTreeView) return null;

        return this._kendoTreeView.text(node, newText);
    }

    /****************************************************************************************************
     * toggle
     ****************************************************************************************************/

    /**
     * Toggle between expanded and collapsed states
     */
    public toggle(nodes: JQuery): void {
        if (!this._kendoTreeView) return;

        this._kendoTreeView.toggle(nodes);
    }

    /****************************************************************************************************
     * updateIndeterminate
     ****************************************************************************************************/

    /**
     * Updates the indeterminate state of the treeview checkboxes. Should be used for better performance when checking multiple checkboxes through code.
     *
     * http://docs.kendoui.com/api/web/treeview#methods-updateIndeterminate
     */
    public updateIndeterminate(node: JQuery): void {
        if (!this._kendoTreeView) return;

        this.updateIndeterminate(node);
    }


    /**
     * Kendo TreeView object
     */
    private _kendoTreeView : kendo.ui.TreeView;

    /**
     * Template name for cy-tree-view
     */
    public static CyTreeViewTemplateName : string = "tree-view-template";
}