require 'watir-webdriver'
require 'rspec'
require 'rspec/autorun'

# base URI of app

$HOME = "http://localhost:3000/"

# list of the text on the primary grid tabs at the bottom of the main view

$TABS = ["Nodes","Alarms","Links","Trails","Logs"]

# the iframe src attribute corresponding to the grids displayed in each tab

$IFRAME_SRCS = ['/framednodegrid', '/framedalarmgrid', '/framedlinkgrid', '/framedtrailgrid', '/framedloggrid']

def openapp

    $b = Watir::Browser.new :firefox

    $b.goto 'http://localhost:3000/login'

    $b.div(:class => 'master-page-body').wait_until_present

    $b.div(:class => 'master-page-body').element(:css => 'input[data-element="username"]').send_keys 'admin'

    $b.div(:class => 'master-page-body').element(:css => 'input[data-element="password"]').send_keys 'adminpw'

    $b.div(:class => 'master-page-body').element(:css => 'button[data-element="submit"]').click

    Watir::Wait.until(timeout=30,message='login failed') do
        $b.url == $HOME
    end

end

def clickTableRow(grid, index)

  # given a kendo grid selector, click the given row of the content table ( the header and other elements may also be tables !)

  gcontent = grid.div(:class => 'k-grid-content')

  gcontent.wait_until_present

  row = gcontent.table[index]

  row.wait_until_present

  row.click

end

def testAlarmViewer(count)


  # wait for i-framed viewer to become present

  frame = $b.frame(:src => '/framedalarmviewer')

  frame.wait_until_present

  # look for the alarm viewer in the given iframe and verify that there is the given number of panels present

  viewer = frame.element(:css => 'div[data-tsclass="CyAlarmViewer"]')

  viewer.wait_until_present

  # wait for alarm panels

  viewer.div(:class => 'cy-alarm-panels').wait_until_present

  # we expect there to be only one

  expect(viewer.divs(:class => 'cy-alarm-panels').length).to eq(count)

  # close the alarm panel

  viewer.a(:class => 'alarm-viewer-close').click

end

def testLinksGrid(grid)

  p 'Testing Links Grid Ornaments'

  # double check that master page body is alive and well

  $b.div(:class => 'master-page-body').wait_until_present

  # wait for toolbar

  toolbar = grid.div(:class => 'k-grid-toolbar')

  toolbar.wait_until_present

  # look for filter box

  toolbar.element(:css => 'div[data-tsclass="CyInputBox"]').wait_until_present

  # check affected services window will appear

  services_button = grid.button(:class => 'cyan-show-affected-trail-button')

  services_button.wait_until_present

  # find and select the first row in the node table ( we should have already testing that the rows are full )

  clickTableRow(grid, 0)

  # now click the services button and observe that the Affected Services window appears

  services_button.click

  title = $b.span(:class => 'k-window-title', :text => 'Affected Services')

  title.wait_until_present

  # find close button and click it

  close = $b.span(:class => 'k-i-close', :text => 'Close')

  close.wait_until_present

  close.click


end

def testAlarmGrid(grid)

  p 'Testing Alarm Grid Ornaments'

  # double check that master page body is alive and well

  $b.div(:class => 'master-page-body').wait_until_present

  # wait for toolbar

  toolbar = grid.div(:class => 'k-grid-toolbar')

  toolbar.wait_until_present

  # look for filter box

  toolbar.element(:css => 'div[data-tsclass="CyInputBox"]').wait_until_present

  # look for acknowledge button

  ack_button = toolbar.button(:class => 'cyan-alarmgrid-ack-button')

  ack_button.wait_until_present

  # look for alarm view button

  viewer_button = toolbar.button(:class => 'cyan-alarmgrid-viewer-button')

  viewer_button.wait_until_present

  # find and select the first row in the node table ( we should have already testing that the rows are full )

  clickTableRow(grid, 0)

  # now click the alarm viewer button

  viewer_button.click

  # verify that a single alarm viewer was displayed

  testAlarmViewer(1)

end

def testNodeGrid(grid)

    p 'Testing Node Grid Ornaments'

    # double check that master page body is alive and well

    master = $b.div(:class => 'master-page-body').wait_until_present

    # now verify that the toolbar widgets are visible include various buttons and the filter box

    # toolbar itself

    toolbar = grid.div(:class => 'k-grid-toolbar')

    toolbar.wait_until_present

    # alarm viewer button

    view_button = grid.button(:class => 'cyan-nodegrid-viewer-button')

    view_button.wait_until_present

    services_button = grid.button(:class => 'cyan-show-affected-trail-button')

    services_button.wait_until_present

    filter_box = grid.input(:class => 'cyan-autocomplete-input')

    filter_box.wait_until_present

    # find and select the first row in the node table ( we should have already testing that the rows are full )

    clickTableRow(grid, 0)
    
    # now click the alarm viewer button

    view_button.click

    # verify that a single alarm viewer was displayed

    testAlarmViewer(1)

    # now click the services button and observe that the Affected Services window appears

    services_button.click

    title = $b.span(:class => 'k-window-title', :text => 'Affected Services')

    title.wait_until_present

    # find close button and click it

    close = $b.span(:class => 'k-i-close', :text => 'Close')

    close.wait_until_present

    close.click

end

describe "Test Tabbed Grids" do

    before(:all) do

        openapp

    end

    after(:all) do

        #$b.close
        
    end

    it "Check Tabs" do

        $TABS.each do |txt| 

            p "Testing Node Tab"

            d = $b.div(:text => 'Nodes', :class => 'tabHeaderButton')

            d.wait_until_present

        end
    end

    it "Exercise Tabs" do

        # iterate each tab, select it and test the grid contained

        idx = 0

        $TABS.each do |txt| 

            p "Testing Tab: #{txt}"

            # find and click the tab once present

            d = $b.div(:text => txt, :class => 'tabHeaderButton')

            d.wait_until_present

            d.click

            # search for a iframe containing the appropriate grid 

            iframe_src = $IFRAME_SRCS[idx]

            grid = $b.frame(:src => iframe_src).div(:class => 'k-grid')

            grid.wait_until_present

            # get table (the header for each grid is a separate table)

            expect(grid.tables.length).to eq(2)

            t = grid.tables[1]

            t.wait_until_present

            # wait until rows appear in the table

            row = t.tr

            row.wait_until_present

            # expect the total rows to be 25

            expect(t.trs.length).to eq(25)

            # test grid specific functionality 

            if txt == 'Nodes'
                testNodeGrid(grid)
            end

            if txt == 'Alarms'
                testAlarmGrid(grid)
            end

            if txt == 'Links'
              testLinksGrid(grid)
            end


            # next table

            idx += 1

        end 

    end

end
