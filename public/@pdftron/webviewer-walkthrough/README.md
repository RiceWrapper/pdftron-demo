# WebViewer Walkthrough

[WebViewer](https://www.pdftron.com/webviewer) is a powerful JavaScript-based PDF Library that's part of the [PDFTron PDF SDK](https://www.pdftron.com). It allows you to view and annotate PDF files on your web app with a fully customizable UI.

This is an addon for WebViewer that allows you to create WebViewer Walkthroughs or step-by-step tutorials how to use WebViewer.

<img src="http://pdftron.s3.amazonaws.com/custom/websitefiles/web/webviewer-walkthrough.png">

## Initial setup

Before you begin, make sure your development environment includes [Node.js and npm](https://www.npmjs.com/get-npm).

## Install

```
npm install @pdftron/webviewer-walkthrough
```

## How to use

Here is an example of how WebViewer and WebViewer-video could be integrated into your application.

```javascript
import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import { initializeWalkthrough } from '@pdftron/webviewer-walkthrough';

const App = () => {
  const viewer = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/PDFTRON_about.pdf',
      },
      viewer.current
    ).then((instance) => {
      const { start, exit } = initializeWalkthrough(
        viewer.current,
        [
          {
            dataElement: 'leftPanelButton',
            header: 'Page Thumbnails',
            text: 'You can see all of the page thumbnails here.'
          },
          {
            dataElement: 'pageNavOverlay',
            text: 'Navigate pages'
          },
          {
            dataElement: 'toolbarGroup-Annotate',
            header: 'Annotate',
            text: 'In here you can find all the different tools you need to work with document.'
          },
          {
            dataElement: 'toggleNotesButton',
            text: 'Here you can see all of the comments on the document.'
          },
        ],
        () => {
          console.log('tutorial complete...');
        }
      );

      start();
    });
  }, []);

  return (
    <div className="App">
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
```

### Customizing the appearance

You can customize the appearance of the card as well, by passing `options` object containing colors:

```javascript
  const options = {
    focusColor: '#FA4E32',
    backgroundColor: '#FA4E32',
    headerColor: '#36110B',
    textColor: '#1F0D06',
    iconColor: '#fff'
  };
  const { start, exit } = initializeWalkthrough(
    // First 3 arguments
    options,
  );

  start();
```

## Documentation

```typescript
/**
 * Initializes the app walkthrough.
 * @static
 * @param {HTMLDivElement} viewerElement the element WebViewer is mounted on.
 * @param {Step[]} steps an array of objects that contains data-element and tip text top be shown
 * @param {Options} [options] customization options
 * @returns {WalkthroughFunctions} an object that contains functions to start the walkthrough and to finish it early.
 */

/**
 * @typedef {Object} WalkthroughFunctions
 * @property {function} start
 * Starts the walkthrough from the beginning.
 * @property {function} exit
 * You can exit the walkthrough before it is finished.
 */

/**
 * @typedef {Object} Step
 * @property {string} dataElement
 * data-element property of the element you want to focus on.
 * @property {string} [header]
 * Header text to display for this step.
 * @property {string} [text]
 * Text body to display for this step.
 */

/**
 * @typedef {Object} Options
 * @property {string} [focusColor]
 * Color for focus on the data-element for the step. Default is #9fdef9.
 * @property {string} [backgroundColor]
 * Background color for the step. Default is #9fdef9.
 * @property {string} [headerColor]
 * Header text color for the step. Default is #192c64.
 * @property {string} [textColor]
 * Text color for the step. Default is #2f546b.
 * @property {string} [iconColor]
 * Icon & step counter color for the step. Default is #334758.
 */
```
## License

For more information on licensing, please visit our [website](https://www.pdftron.com/licensing/).
