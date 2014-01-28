/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/underscore.d.ts" />
/// <reference path="../definitions/kendo.web.d.ts" />
/// <reference path="../definitions/handlebars.d.ts" />

class CyTemplates {

    /**
     * clone the given template from the templates area of the document. We expect templates to be within
     * the element identified by templatesSelector. Additionally we expect each template to use the
     * attribute data-template="xxx" to identify it
     *
     *
     * div(data-templates="cyan-templates")
     *
     *   div(data-template="some-template")
     *      p Now is the time
     *
     *   You could call:
     *
     *   CyUtils.cloneTemplate('[data-template="some-template"]');
     *
     *   to clone the element and remove the template identifier.
     *
     * @param selector
     * @param removeAttr
     */
    public static cloneTemplate(templateName:string) : JQuery {

        // get clone of template

        var clone:JQuery = $('[data-template="' + templateName + '"]', CyTemplates.templates).clone();

        // remove identifying attribute

        clone.removeAttr(CyTemplates.templateAttr);

        return clone;
    }

    /**
     * Generates html from an underscore template.  Unlike cloneTemplate, no cloning is taking place.  This method just
     * returns the compiled template function.
     *
     * @param templateName
     * @returns {*}
     */
    public static compileTemplate(templateName:string) : ( params : any ) => string {

        var template = $('[data-template="' + templateName + '"]', CyTemplates.templates).html();

        return Handlebars.compile(template);
    }

    /**
     * Loads templates from an external file.  This must be called before using any other methods, at application start
     * for instance.
     *
     * @param path
     * @param callback
     */
    public static loadTemplate(path:string, callback?:any):JQueryXHR {

        return $.ajax({
            url: CyTemplates.templatePath + path,
            success: function (resp) {

                CyTemplates._templates = $('<html></html>').append(resp);

                if (callback) {
                    callback(CyTemplates._templates);
                }
            }
        });
    }

    /**
     * Loads css dynamically by appending link tag to the DOM.
     * Note: only used for testing at the moment
     * @param path
     * @param callback
     */
    public static loadCss(path:string, callback?:any) {

        $('head').append($("<link rel='stylesheet' href='" + CyTemplates.cssPath + path + "' />").load(function () {

            if (callback) {
                callback();
            }

        }));
    }

    /**
     * selector for the templates region of the document
     *
     * @method templates
     * @return {JQuery} templates
     */
    private static _templates:JQuery;
    public static get templates():JQuery {

        return CyTemplates._templates;
    }

    /**
     * selector for the body of the document
     *
     * @method body
     * @return {JQUERY} body
     */
    private static _body:JQuery;
    public static get body():JQuery {

        return CyTemplates._body || (CyTemplates._body = $('body'));
    }

    /**
     * selector for the content area of the page
     *
     * @method content
     * @return {JQuery} content
     */
    private static _content:JQuery;
    public static get content():JQuery {

        return CyTemplates._content || (CyTemplates._content = $('.master-page-body', CyTemplates.body));
    }

    /**
     * selector for the content area of the navigation bar
     *
     * @method imageStrip
     * @return {JQuery} imageStrip
     */
    private static _imageStrip:JQuery;
    public static get imageStrip():JQuery {

        return CyTemplates._imageStrip || (CyTemplates._imageStrip = $('.header-starfield', CyTemplates.body));
    }

    /**
     * identifying attribute of template
     */
    public static templateAttr:string = "data-template";

    private static templatePath:string = "/nms/tmpl/";
    private static cssPath:string = "/nms/css/";

}

export = CyTemplates;