/// <reference path=".././definitions/jquery.d.ts" />
/// <reference path=".././definitions/underscore.d.ts" />

import CyGrunt = require("./cy-grunt");

class CyUtils {

    /**
     * get the file extension of the given string/uri. Assumes the file/uri is simple e.g.
     * /folder/file.jpg. The addition of query string parameters is not supported.
     * If the name does not contain an extension the entire string is returned.
     * If the input string is null/or undefined null is returned
     * The returned string is always lower case regardless of input format.
     *
     * @param {string} name is the file name or URI
     * @return {string||null} the file extension as lower case string
     *
     */
    public static getFileExtension(name:string):string {

        // null or undefined results in null return

        if (_.isNull(name) || _.isUndefined(name)) {
            return null;
        }

        // return last string after the last period

        return name.split('.').pop().toLowerCase();
    }


    /**
     * a very simple asserts. Writes failed descriptions to console and throws an error exception
     * @param {boolean} condition is the truthy value to test
     * @param {string} description is non optional description of the assert
     */
    public static assert (condition:any, description:string) : void {
        "use strict";

        if (!condition) {

            // show message as grunt

            CyGrunt.showGrunt(description, CyGrunt.kORANGE)
        }
    }

    /**
     * convert kendo pagination parameters to Cyan index/count
     * @param e
     */
    public static createPaginationQueryFromKendoQuery(e:any) : any {

        e.index = e.skip;

        e.count = e.take;

        delete e.take;
        delete e.page;
        delete e.pageSize;
        delete e.skip;
    }

    /**
     * we intercept out bounds requests from Kendo grids and convert them to more edible formats. This function
     * replaces the sort parameters ( in some funky php format ) and convert them to our sort_by=xxx,-yyy format
     * @param e is the out bounds parameters object which we modify in situ
     */
    public static createSortQueryFromKendoQuery(e:any) : any {

        // create sort parameters. This maps the slight complex kendo format to our own slightly simplier one:
        // e.g.
        // sort[0][field]=nodeId&sort[0][dir]=asc&sort[1][field]=id&sort[0][dir]=des
        // to
        // sort_by=nodeId,-id
        //

        if (e["sort"]) {

            // extract each field used for sorting and the direction of the sort

            var sorter:any = e.sort;

            var query:string = "";

            var fieldIndex:number = 0;

            var column:any = sorter[fieldIndex.toString()];

            while (column) {

                // get direction which is "-" for descending or empty for ascending

                var dir = column.dir === "asc" ? "" : "-";

                // if not the first field add a command

                if (query.length > 0) {
                    query += ",";
                }

                query = query + dir + column.field;

                // next sort field

                fieldIndex += 1;

                column = sorter[fieldIndex.toString()];
            }
            // add the sort query

            e.sort_by = query;

            // remove kendo sorting object

            delete e.sort;
        }
    }

    /**
     * This should be used instead of calling window.location.href directly so this can be mocked for testing
     * @param href
     */
    public static redirect(href) {
        window.location.href = href;
    }
}

export = CyUtils;
