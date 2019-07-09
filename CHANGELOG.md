# Changelog

## 1.3.0 / 9 Jul 2019

* Use the state to control and pass advertising
* window.requestBids added 2 new options: 
data passed via config.dataPrebid
sizeMappings (based on the gpt size mapping)
* Provider changes to use getDerivedStateFromProps to control if the component should reload (componentDidUpdate)
* Config.singleRequest to enable singleRequest for ads refresh (false by default).
* Provider props.shouldRefresh (false by default) to control if ads should be reload 
when the config file is edited. All ads will be refreshed. Not option know to control 
which slot will be enable on Prebid or refresh. future release planend to add 2 new options:
config.slot.enablePrebid and config.slot.enableRefresh
* Example app.js and config.js have been edited

## 1.2.1 / 9 Oct 2018

* Rubicon Demand Manager tool has been added.
* window.requestBids has been replace with window.pbjs.rp.requestBids that will create a request 
using a regex mapping between the DFP slot and the one hosted on prebid.js file hosted by Rubicon
config file doesn't need to have prebid bidders details anymore, just the details about DFP slots
* Provider has been updated if the component is reload (componentDidUpdate)
* Add a feature to look for the active props (true by default) in case config is defined after the component is render or refresh
* test and snapshots have been updated


## 1.0.9 / 9 Oct 2018

* dependency update to fix security issues found by npm audit

## 1.0.8 / 26 Jun 2018

* tests and other superfluous files excluded from npm package

## 1.0.7 / 26 Jun 2018

* removed obsolete prebid size mapping code that doesn't work with Prebid 1
* added `prebid.sizeConfig` to advertising config prop type
* added `prebid.bids.labelAny` and `prebid.bids.labelAll` to advertising slot config prop type

## 1.0.6 / 25 Jun 2018

*   added “displaySlots” to plugin lifecycle phases

## 1.0.5 / 25 Jun 2018

*   adjusted config prop type for size mapping config, now allowing string for named sizes (i.e. `fluid`)

## 1.0.4 / 25 Jun 2018

*   fixed critical issue with responsive ads size mappings; it did not work properly with prior versions

## 1.0.3 / 13 Jun 2018

*   adjusted prop types for slot config to allow passing just one size

## 1.0.2 / 13 Jun 2018

*   bug fix: GPT sizes are now added correctly

## 1.0.1 / 12 Jun 2018

*   adjusted advertising config prop type to allow specifying Prebid price granularity as object

## 1.0.0 / 24 Apr 2018

*   compatible with React 16.3 and greater

## 0.1.0 / 19 Apr 2018

Initial release

*   compatible with Prebid 1.x
*   compatible with React 15.x
