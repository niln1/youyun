import React from 'react';
import Root from './Root';

// Add Mobile header
$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />');

React.render(
	<Root />,
	document.getElementById('main-region')
);