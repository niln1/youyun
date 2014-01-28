define(
    ['cy-abcd', 'cy-nodessf', 'cy-clientapi', 'util/cy-templates'],
    
    function(CyABCD, CyNodeSSF, CyClientApi, CyTemplates){
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // ***** Constants used in test are defined here *****
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        ptps = [
                    {name: "FAC-1-1-1"}, {name: "FAC-1-1-2"}, {name: "FAC-1-1-3"}, {name: "FAC-1-1-4"},
                    {name: "FAC-1-2-1"}, {name: "FAC-1-2-2"}, {name: "FAC-1-2-3"}, {name: "FAC-1-2-4"},
                    {name: "FAC-1-3-1"}, {name: "FAC-1-3-2"}, {name: "FAC-1-3-3"}, {name: "FAC-1-3-4"},
                    {name: "FAC-1-4-1"}, {name: "FAC-1-4-2"}, {name: "FAC-1-4-3"}, {name: "FAC-1-4-4"}
               ];
    
        /* representation of the network data object, should be geneic */
        var network = {
            nodes: [
                    {user_label: "10TestNode", resolved_ip_address: "127.0.0.1", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.1", ems_node_id: 1},
                    {user_label: "11TestNode", resolved_ip_address: "127.0.0.2", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.2", ems_node_id: 2},
                    {user_label: "12TestNode", resolved_ip_address: "127.0.0.3", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.3", ems_node_id: 3},
                    {user_label: "13TestNode", resolved_ip_address: "127.0.0.4", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.4", ems_node_id: 4},
                    {user_label: "14TestNode", resolved_ip_address: "127.0.0.5", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.5", ems_node_id: 5},
                    {user_label: "20TestNode", resolved_ip_address: "127.0.0.6", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.6", ems_node_id: 6},
                    {user_label: "21TestNode", resolved_ip_address: "127.0.0.7", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.7", ems_node_id: 7},
                    {user_label: "22TestNode", resolved_ip_address: "127.0.0.8", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.8", ems_node_id: 8},
                    {user_label: "23TestNode", resolved_ip_address: "127.0.0.9", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.9", ems_node_id: 9},
                    {user_label: "24TestNode", resolved_ip_address: "127.0.0.10", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.10", ems_node_id: 10},
                    {user_label: "30TestNode", resolved_ip_address: "127.0.0.11", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.11", ems_node_id: 11},
                    {user_label: "31TestNode", resolved_ip_address: "127.0.0.12", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.12", ems_node_id: 12},
                    {user_label: "32TestNode", resolved_ip_address: "127.0.0.13", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.13", ems_node_id: 13},
                    {user_label: "33TestNode", resolved_ip_address: "127.0.0.14", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.14", ems_node_id: 14},
                    {user_label: "34TestNode", resolved_ip_address: "127.0.0.15", alarm_status_label: "OK", communication_state_label: "connected", sw_version: "1.0.15", ems_node_id: 15}
                ],
                
            node_ports: {
                    "10TestNode": ptps, "11TestNode": ptps, "12TestNode": ptps, "13TestNode": ptps, "14TestNode": ptps, 
                    "20TestNode": ptps, "21TestNode": ptps, "22TestNode": ptps, "23TestNode": ptps, "24TestNode": ptps,
                    "30TestNode": ptps, "31TestNode": ptps, "32TestNode": ptps, "33TestNode": ptps, "34TestNode": ptps
            }
        };
        
        var RESPONSE_TIMEOUT = 50;
         
         // helper method that selects a certain row in a grid
	    function dbclickRow(grid, row) {
	        var cell = $('.k-grid-content table tr', grid.element).eq(row);
	        cell.dblclick();
	    }
	    
	    /*
	     * loads all templates which is necessary for testing
	     */
	    function loadTestTemplates(callback){
           CyTemplates.loadTemplate('abcd/createform.html', function () {
               callback();
           })
	    }
	    
	    
	    // This helper emulates server side for returning list
	    // of nodes
	    function filter_nodes(query){
			var nodesOnServer = network.nodes;
			
			if (typeof(query) == 'undefined'){
				return {objects: nodesOnServer};
			};
			
			var resList = [];
			for (var i in nodesOnServer){
				var node = nodesOnServer[i]; 
				if (node.user_label.search(query) != -1){
					resList.push(node);
				};
			};
	
			return {objects: resList};
	    }
	    
	    /*
	     * mock ajax requests for testing ABCD tunnel creation UI 
	     */
	    function abcdUMockAjaxRequests(config){
	        // TODO: should be possibility to switch it of
	        $.mockjaxSettings.logging = false;
            $.mockjaxSettings.responseTime = 0;
                
            $.mockjax({
                url: /\/api\/object\/node\?c=10&v=1&u=1&m=get&s=.+/,
                responseText: JSON.stringify(filter_nodes())
            });
            
            // get value of validity from config
            var validity = (config.invalid_endpoint)? false: true;
            $.mockjax({
                url: /\/api\/object\/routeRequest\?v=1&u=1&m=is_valid_endpoint&validendpointinput=.+/,
                responseText: JSON.stringify({"__name": "route_validendpointoutput", "message": "Success", "validity": validity})
            });
                
            for (var i in network.nodes){
                var node = network.nodes[i];
                var url_pattern = new RegExp("\\/api\\/object\\/node\\?c=10&v=1&u=1&m=get&filter=" + node.user_label + "&s=.+");
                $.mockjax({
                    url: url_pattern,
                    responseText: JSON.stringify(filter_nodes(node.user_label))
                });
            }
                
            for (var i in network.nodes){
                var node = network.nodes[i];
                var url_pattern = new RegExp("\\/api\\/object\\/routeRequest\\?nodename=" + node.user_label + "&c=10&v=1&u=1&m=get_tps&s=.+");
                $.mockjax({
                    url: url_pattern,
                    responseText: JSON.stringify({objects: network.node_ports[node.user_label]})
                });
            }
            
	    }
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // ***** UI part testing helpers *****
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        function helper_clickOnChooseNode(end_type){
            $('.choose_' + end_type + " button").click();
        }
        
        function helper_clickOnChoosePort(end_type){
            $('.choose_' + end_type + "_port button").click();
        }
        
        function helper_selectorSelectRow(row){
            var cell = $('.k-grid-content table tr', '.cy-dialog').eq(row).children('td').eq(0);
            cell.simulate('mousedown').simulate('mouseup');
            // click on the OK button
            var buttons = $("button.cyan-dialog-button", '.cy-dialog');
            for (var i in buttons){
                var button = buttons[i];
                if($(button).text().toLowerCase() == 'ok'){
                    $(button).click(); break;
                }
            }
        }
        
        function helper_selectEndNode(type, row, callback){
            helper_clickOnChooseNode(type);
            setTimeout(function(){
                // Choose some node here
                helper_selectorSelectRow(row);
                callback();
            }, 20)
        }
        
        function helper_selectAEndNode(row, callback){
            helper_selectEndNode('aend', row, callback);
        }
        
        function helper_selectZEndNode(row, callback){
            helper_selectEndNode('zend', row, callback);
        }
        
        
        function helper_defineEnds(aend_n, aend_p, zend_n, zend_p, callback){
            helper_clickOnChooseNode('aend');
            setTimeout(function(){
                helper_selectorSelectRow(aend_n);
                helper_clickOnChoosePort('aend');
                setTimeout(function(){
                    helper_selectorSelectRow(aend_p);
                    helper_clickOnChooseNode('zend');
                    setTimeout(function(){
                        helper_selectorSelectRow(zend_n);
                        helper_clickOnChoosePort('zend');
                        setTimeout(function(){
                            helper_selectorSelectRow(zend_p);
                            setTimeout(function(){
                                callback();
                            }, RESPONSE_TIMEOUT);
                        }, RESPONSE_TIMEOUT);
                    }, RESPONSE_TIMEOUT);
                }, RESPONSE_TIMEOUT);
            }, RESPONSE_TIMEOUT);
        }

        
        /*
         * This class provides facility to test path tables
         * @param type
         * may be both 'working' or 'protected'
         */
        function PathTableHelper(type){
            
            this.el = $('.' + type + '_path_table .k-grid-content'); // should be table element
            var self = this;
            
            this.clickCell = function(row, col){
                var cell = $('table tr', self.el).eq(row).children('td').eq(col);
                cell.simulate('mousedown').simulate('mouseup');
            }
            
            this.getCell = function(row, col){
                var cell = $('table tr', self.el).eq(row).children('td').eq(col);
                return cell;
            }
            
            this.rowsCount = function(){
                return $('table tr', self.el).length;
            }

        }
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // ***** Tests begins here *****
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         
        describe("GuaranteedBandwidthWidget", function (){

            afterEach(function(){
                $("#bandwidth").remove();
                $("select.bandwidth-select").remove();
            });
            
            it("shold be disabled/enabled", function(){
	            
	            // first create checkbox and selector element
	            var checkbox = $('<input type="checkbox" id="bandwidth" />');
	            var selectEl = $('<select class="bandwidth-select" />');
	            
	            selectEl.prop("disabled", true);
	            
	            $("body").append(checkbox);
	            $("body").append(selectEl);
	            
	            var manualAssignedIDWidget = new CyABCD.GuaranteedBandwidthWidget(); 
	            
	            // click it to enable
	            checkbox.click();
	            
	            expect(checkbox.prop("checked")).to.equal(true);
	            expect(selectEl.prop("disabled")).to.equal(false);
	            
	            // click again to disable
	            checkbox.click();
	            
	            expect(checkbox.prop("checked")).to.equal(false);
                expect(selectEl.prop("disabled")).to.equal(true);
            });
            
         });
         
         describe("ManualAssignedIDWidget", function (){
            afterEach(function(){
                $("#assign_id").remove();
                $("button.assign-id-btn").remove();
            });
            
            it("should be enabled/disabled", function(){
                var checkbox = $('<input type="checkbox" id="assign_id" />');
                var button = $('<button class="assign-id-btn" />');
                
                $("body").append(checkbox);
                $("body").append(button);
                
                button.prop("disabled", true);
                
                var widget = new CyABCD.ManualAssignedIDWidget();
                
                // click it to enable
                checkbox.click();
                
                expect(checkbox.prop("checked")).to.equal(true);
                expect(button.prop("disabled")).to.equal(false);
                
                // click again to disable
                checkbox.click();
                
                expect(checkbox.prop("checked")).to.equal(false);
                expect(button.prop("disabled")).to.equal(true);
                
            });
         });
         
         // PathTable tests go here
         describe("PathTable", function(){
            // create the table element
            
            
            var tableEl = null;
            
            beforeEach(function(){
            	tableEl = $('<table id="grid"> \
                <tr> \
                    <th>Node</th> \
                    <th>Ingress port</th> \
                    <th>Egress port</th> \
                    <th>Trail</th> \
                </tr> \
                </table>');
            });
         
            afterEach(function(){
            	// remove table
                $(".k-grid.k-widget").remove();
            });
         
            it("should be added a aNode to the PathTable", function(){
            	
            	var node = {
            		user_label: "TestANode"
            	}
                
                $("body").append(tableEl);
                
                var pathtable = new CyABCD.PathTable("#grid");
                pathtable.addAEndNode(node);
                expect(pathtable.aend_node.user_label).to.equal("TestANode");
                expect(pathtable.rows_count).to.equal(1);
            });
            
            it("should be added a zNode to the PathTable", function(){
            	$("body").append(tableEl);
                var node = {
            		user_label: "TestZNode"
            	}
                var pathtable = new CyABCD.PathTable("#grid");
              	pathtable.addZEndNode(node);
              	expect(pathtable.zend_node.user_label).to.equal("TestZNode");
                expect(pathtable.rows_count).to.equal(1);
            });
            
            it("should insert several nodes onto path table", function(){
            	$("body").append(tableEl);
            	var nodes = [
            		{user_label: "Nest1Node"},
            		{user_label: "Nest2Node"},
            		{user_label: "Nest3Node"}
            	];
            	var pathtable = new CyABCD.PathTable("#grid");
            	for (var i in nodes){
            		var node = nodes[i];
					
					pathtable.insertNodeToPath(i, node);
            	};
            	
            	expect(pathtable.rows_count).to.equal(3);
            	expect(pathtable.rows_data[2].node.user_label).to.equal("Nest3Node");
            	expect(pathtable.rows_data[0].node.user_label).to.equal("Nest1Node");
            	expect($("#grid tr")).to.have.length(3);
            });
            
         }
        );
        
		describe("CyClientAPI", function(){
			
			beforeEach(function(){
				$.mockjaxSettings.logging = false;
            	$.mockjaxSettings.responseTime = 0;
				
				$.mockjax({
	                url: /\/api\/whatever\?.+/,
	                responseText: JSON.stringify({
	                	hello: "world"
	                })
	            });
			});
			
			afterEach(function(){
				$.mockjaxClear();
			});
            
            it("should work in right way", function(done){
            	var callback = sinon.spy();
            		
            	CyClientApi.make_request("/api/whatever", "justdoit", callback);
		    	
		    	setTimeout(function () {
                	expect(callback.called).to.equal(true);
                	done();
            	}, 50);
		    	
            });
		});
		
		///////////////////////////////////////////////////////////////////////////////
        //  **** Here's business logic tests begin ****
        ///////////////////////////////////////////////////////////////////////////////
		describe("ABCD-feature-ui", function(){
		
            beforeEach(function(done){
                // to avoid some errors
                // clear some stuff which may appear ocasionally
                $('.k-widget, .k-window, .cy-dialog').remove();
            
                var moch_config = {};
                // moch_config is used for configuring ajax mochs
                // you may get name of the test from this.currentTest.title
                // and define some parametesr for generic moching 
                // 
                // parameters:
                // invalid_endpoint - if true - requests returns false for for endpoint validation
                if(this.currentTest.title == "should prevent choosing illegal a-endnode" ||
                    this.currentTest.title == "should prevent choosing illegal z-endnode"
                ){
                    moch_config.invalid_endpoint = true;
                }
                
                var page_body = $('<div class="master-page-body" />');
                abcdUMockAjaxRequests(moch_config);
                $("body").append(page_body);
                loadTestTemplates(function(){
                   var createform = CyTemplates.cloneTemplate('cyan-abcd-createform').appendTo(page_body);
                   var provision_log = CyTemplates.cloneTemplate('cyan-abcd-provisionlog').appendTo(page_body);
                   CyABCD.main(function(){
                       done();
                   });
                });
                
            });
            
            afterEach(function(){
                $.mockjaxClear();
                // clear test area from html content
                $(".master-page-body").remove();
                $('.k-widget, .k-window, .cy-dialog').remove();
            });
            
            it("should be unprotected by default", function(){
                // at the begin protection level should be UNPROTECTED
                var protection_level = $("select.protecting_level").val();
                protection_level = parseInt(protection_level); 
                expect(protection_level).to.equal(CyABCD.UNPROTECTED, "Default protection level is wrong");
            });
            
            it("should show or hide second table if protection level is changed", function(){
                var select_protection = $("select.protecting_level");
                //expect(true).to.equal(false, "some extra message");
                expect($('.protected_path_table').css('display')).to.equal('none', "by default it expected to be hidden")
                select_protection.val('' + CyABCD.PARTIALLY_PROTECTED);
                select_protection.change();
                expect($('.protected_path_table').css('display')).to.equal('block', "It shoild be shown if partially protected level chosen");
                select_protection.val('' + CyABCD.FULLY_PROTECTED);
                select_protection.change();
                expect($('.protected_path_table').css('display')).to.equal('block', "It shoild be shown if fully protected level chosen");
                select_protection.val('' + CyABCD.UNPROTECTED);
                select_protection.change();
                expect($('.protected_path_table').css('display')).to.equal('none');
            });
            
            it("should provide ability to choose a-node", function(done){
                helper_clickOnChooseNode('aend');
                var wt_helper = new PathTableHelper('working'); // working table helper
                var pt_helper = new PathTableHelper('protected'); // protected table helper
                setTimeout(function(){
                    // window for choosing node should appear
                    expect($('.cy-dialog')).to.have.length(1, "Choose window for A-End doesn't appear");
                    // Choose some node here
                    helper_selectorSelectRow(3);
                    var expected_aend = network.nodes[3].user_label;
                    var node = network.nodes[3];
                    expect($('.choose_aend input').val()).to.equal(expected_aend);
                    
                    expect($('.choose_aend span.aend_ip_address').text().indexOf(node.resolved_ip_address)).not.to.equal(-1, "User doesn'r read ip address");
                    expect($('.choose_aend span.aend_ip_address').text().indexOf(node.sw_version)).not.to.equal(-1, "User doesn'r read sw version");
                    expect(wt_helper.getCell(0, 0).text()).to.equal(" " + expected_aend);
                    expect(pt_helper.getCell(0, 0).text()).to.equal(" " + expected_aend);
                    done();
                }, RESPONSE_TIMEOUT) 
                
            });
            
            it("should provide ability to choose z-node", function(done){
                helper_clickOnChooseNode('zend');
                var wt_helper = new PathTableHelper('working'); // working table helper
                var pt_helper = new PathTableHelper('protected'); // protected table helper
                setTimeout(function(){
                    // window for choosing node should appear
                    expect($('.cy-dialog')).to.have.length(1, "Choose window for Z-End doesn't appear");
                    // Choose some node here
                    helper_selectorSelectRow(5);
                    var expected_zend = network.nodes[5].user_label;
                    var node = network.nodes[5];
                    expect($('.choose_zend input').val()).to.equal(expected_zend);
                    
                    expect($('.choose_zend span.zend_ip_address').text().indexOf(node.resolved_ip_address)).not.to.equal(-1, "User doesn'r read ip address");
                    expect($('.choose_zend span.zend_ip_address').text().indexOf(node.sw_version)).not.to.equal(-1, "User doesn'r read sw version");
                    expect(wt_helper.getCell(0, 0).text()).to.equal(" " + expected_zend);
                    expect(pt_helper.getCell(0, 0).text()).to.equal(" " + expected_zend);
                    done();
                    
                }, RESPONSE_TIMEOUT)
                
            });
            
            it("should provide ability to choose A-end node and port", function(done){
                helper_clickOnChooseNode('aend');
                var wt_helper = new PathTableHelper('working'); // working table helper
                var pt_helper = new PathTableHelper('protected'); // protected table helper
                setTimeout(function(){
                    helper_selectorSelectRow(3);
                    helper_clickOnChoosePort('aend');
                    setTimeout(function(){
                        helper_clickOnChoosePort();
                        helper_selectorSelectRow(4);
                        var expected_aend = network.nodes[3].user_label;
                        var expected_port = ptps[4].name;
                        expect(wt_helper.getCell(0, 0).text()).to.equal(" " + expected_aend);
                        expect(pt_helper.getCell(0, 0).text()).to.equal(" " + expected_aend);
                        expect($('.choose_aend_port input').val()).to.equal(expected_port);
                        setTimeout(
                            function(){
                                // check port validation
                                expect(wt_helper.getCell(0, 1).text()).to.equal(expected_port);
                                expect(pt_helper.getCell(0, 2).text()).to.equal(expected_port);
                                done();
                            },
                            RESPONSE_TIMEOUT
                        )
                    }, RESPONSE_TIMEOUT);
                }, RESPONSE_TIMEOUT)
            })

            it("should provide ability to choose Z-end node and port", function(done){
                helper_clickOnChooseNode('zend');
                var wt_helper = new PathTableHelper('working'); // working table helper
                var pt_helper = new PathTableHelper('protected'); // protected table helper
                setTimeout(function(){
                    helper_selectorSelectRow(1);
                    helper_clickOnChoosePort('zend');
                    setTimeout(function(){
                        helper_clickOnChoosePort();
                        helper_selectorSelectRow(6);
                        var expected_zend = network.nodes[1].user_label;
                        var expected_port = ptps[6].name;
                        expect(wt_helper.getCell(0, 0).text()).to.equal(" " + expected_zend);
                        expect(pt_helper.getCell(0, 0).text()).to.equal(" " + expected_zend);
                        expect($('.choose_zend_port input').val()).to.equal(expected_port);
                        setTimeout(
                            function(){
                                // check port validation
                                expect(wt_helper.getCell(0, 2).text()).to.equal(expected_port);
                                expect(pt_helper.getCell(0, 1).text()).to.equal(expected_port);
                                done();
                            },
                            RESPONSE_TIMEOUT
                        )
                    }, RESPONSE_TIMEOUT);
                }, RESPONSE_TIMEOUT)
            })
            
            it("should prevent choosing illegal a-endnode", function(done){
                helper_clickOnChooseNode('aend');
                var wt_helper = new PathTableHelper('working'); // working table helper
                var pt_helper = new PathTableHelper('protected'); // protected table helper
                setTimeout(function(){
                    helper_selectorSelectRow(7);
                    helper_clickOnChoosePort('aend');
                    
                    setTimeout(function(){
                        helper_selectorSelectRow(4);
                        var expected_port = ptps[4].name;
                        expect($('.choose_aend_port input').val()).to.equal(expected_port);
                        setTimeout(
                            function(){
                                // check port validation
                                expect(wt_helper.getCell(0, 1).text()).to.equal('');
                                expect(pt_helper.getCell(0, 2).text()).to.equal('');
                                done();
                            },
                            RESPONSE_TIMEOUT
                        )
                    }, RESPONSE_TIMEOUT);
                }, RESPONSE_TIMEOUT);
            });
           
            it("should prevent choosing illegal z-endnode", function(done){
                helper_clickOnChooseNode('zend');
                var wt_helper = new PathTableHelper('working'); // working table helper
                var pt_helper = new PathTableHelper('protected'); // protected table helper
                setTimeout(function(){
                    helper_selectorSelectRow(5);
                    helper_clickOnChoosePort('zend');
                    
                    setTimeout(function(){
                        helper_selectorSelectRow(8);
                        var expected_port = ptps[8].name;
                        expect($('.choose_zend_port input').val()).to.equal(expected_port);
                        setTimeout(
                            function(){
                                // check port validation
                                expect(wt_helper.getCell(0, 2).text()).to.equal('');
                                expect(pt_helper.getCell(0, 1).text()).to.equal('');
                                done();
                            },
                            RESPONSE_TIMEOUT
                        )
                    }, RESPONSE_TIMEOUT);
                }, RESPONSE_TIMEOUT);
            });
           
            it("should provide ability to choose both AEnd/ZEnd podes and ports", function(done){
                var wt_helper = new PathTableHelper('working'); // working table helper
                var pt_helper = new PathTableHelper('protected'); // protected table helper
                helper_defineEnds(1, 7, 9, 0, function(){
                    var expected_anode = network.nodes[1];
                    var expected_znode = network.nodes[9];
                    
                    var expected_aport = ptps[7];
                    var expected_zport = ptps[0];
                    
                    expect(wt_helper.getCell(0, 0).text()).to.equal(" " + expected_anode.user_label);
                    expect(pt_helper.getCell(1, 0).text()).to.equal(" " + expected_anode.user_label);
                    
                    expect(wt_helper.getCell(1, 0).text()).to.equal(" " + expected_znode.user_label);
                    expect(pt_helper.getCell(0, 0).text()).to.equal(" " + expected_znode.user_label);
                    
                    expect(wt_helper.getCell(0, 1).text()).to.equal(expected_aport.name, "a-port working");
                    expect(pt_helper.getCell(1, 2).text()).to.equal(expected_aport.name, "a-port protcted");
                    
                    expect(wt_helper.getCell(1, 2).text()).to.equal(expected_zport.name, "z-port working");
                    expect(pt_helper.getCell(0, 1).text()).to.equal(expected_zport.name, "z-port protected");
                    
                    done();
                });
            });
            /*
            it("", fucntion(done){
                var wt_helper = new PathTableHelper('working'); // working table helper
                var pt_helper = new PathTableHelper('protected'); // protected table helper
                helper_defineEnds(3, 4, 2, 7, function(){
                    
                });
            });
            */
		});
})
