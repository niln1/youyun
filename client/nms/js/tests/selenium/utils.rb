def openapp

  $HOME = 'http://localhost:3000/'

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