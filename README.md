#### About

The script can be embedded into the page content using the [AddJS](https://chrome.google.com/webstore/detail/addjs/ikdcaklgiaookdchoncnfcidafmmlndm) extension. The script will collect links to video tutorials on the egghead.io page.

#### Usage

* Install [AddJS](https://chrome.google.com/webstore/detail/addjs/ikdcaklgiaookdchoncnfcidafmmlndm?hl=en-US) extension
* Run ```yarn get``` to create an inline script
* Add ```dist/deploy.js``` script to AddJS for domain egghead.io
* Click the ```o``` button in the upper left corner
* Click the copy button that appears if the page content is parsed successfully
* Create a new text file (for example list.txt) and paste the clipboard into it
* Run ```youtube-dl -a list.txt```
* All files in the list will be downloaded

#### Development

* Run ```yarn dev``` to develop.
    * copy the ```dist/deploy.js``` script content
    * paste into [AddJS](https://chrome.google.com/webstore/detail/addjs/ikdcaklgiaookdchoncnfcidafmmlndm?hl=en-US) extension on egghead.io domain
    * reload the webpage

* Run ```yarn get``` to build javascript file that you can embed. The generated deploy.js script is located in the dist folder.
