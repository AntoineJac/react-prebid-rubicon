**This repo is based on the (great job) done by Ebay on: https://github.com/technology-ebay-de/react-prebid**

**As a Rubicon employee, I have adapted it to make it work with Rubicon demand manager product**

**Do notice, it is NOT an official Rubicon product and Rubicon Project could not be liable for any use of this package**

**Please contact me for any further details or help on this package: ajacquemin@rubiconproject.com**

# react-prebid

A JavaScript library for ad placements with [Prebid](http://prebid.org) header bidding in [React](https://reactjs.org) applications.

**Integrate ads in your app the “React way”: by adding ad components to your JSX layout!**

* One central configuration file for all your GPT and Prebid placement config
* One provider component that handles all the “plumbing” with *googletag* and *pbjs*, nicely hidden away
* Ad slot components that get filled with creatives from the ad server when they mount to the DOM
* Works well in single page applications with multiple routes
* Suitable for server-side-rendering

[![Build Status](https://travis-ci.org/AntoineJac/react-prebid-rubicon.svg?branch=master)](https://travis-ci.org/AntoineJac/react-prebid-rubicon)
[![Coverage Status](https://coveralls.io/repos/github/AntoineJac/react-prebid-rubicon/badge.svg)](https://coveralls.io/github/AntoineJac/react-prebid-rubicon)

## Prerequisites

To use *react-prebid*, you need to have a [Doubleclick for Publishers](https://www.google.com/intl/en/doubleclick/publishers/welcome/)
(DFP) ad server set up, along with configuration to use Prebid in place. Please refer to the
[Prebid documentation](http://prebid.org/overview/intro.html) for details.

## Demo

You can view a demo of this library online on *CodeSandbox*:

*   [https://codesandbox.io/s/react-prebid-4t5wg](https://codesandbox.io/s/react-prebid-4t5wg)

The demo uses the same test Prebid configuration as the
[code examples from the official documentation](http://prebid.org/dev-docs/examples/basic-example.html).

## Documentation

You can find documentation on how to use this library in the project's wiki:

* [Usage](https://github.com/AntoineJac/react-prebid-rubicon/wiki/Usage)
* [API](https://github.com/AntoineJac/react-prebid-rubicon/wiki/API)
* [Configuration](https://github.com/AntoineJac/react-prebid-rubicon/wiki/Configuration)
* [Custom Events](https://github.com/AntoineJac/react-prebid-rubicon/wiki/Custom-Events)
* [Plugins](https://github.com/AntoineJac/react-prebid-rubicon/wiki/Plugins)

## License

[MIT licensed](LICENSE)

Copyright © 2018 mobile.de GmbH
