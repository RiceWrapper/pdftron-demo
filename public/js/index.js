// @link WebViewerInstance: https://www.pdftron.com/api/web/WebViewerInstance.html
// @link WebViewerInstance.registerTool: https://www.pdftron.com/api/web/WebViewerInstance.html#registerTool__anchor
// @link WebViewerInstance.unregisterTool: https://www.pdftron.com/api/web/WebViewerInstance.html#unregisterTool__anchor
// @link WebViewerInstance.setHeaderItems: https://www.pdftron.com/api/web/WebViewerInstance.html#setHeaderItems__anchor
// @link WebViewerInstance.setToolMode: https://www.pdftron.com/api/web/WebViewerInstance.html#setToolMode__anchor

// @link Header: https://www.pdftron.com/api/web/Header.html
// @link Header.get: https://www.pdftron.com/api/web/Header.html#get__anchor
// @link Header.getHeader: https://www.pdftron.com/api/web/Header.html#getHeader__anchor
// @link Header.insertBefore: https://www.pdftron.com/api/web/Header.html#insertBefore__anchor
let dropPoint = {};
let productSets = {};
// let productSet = [
//   { name: 'Deadbolt', src: './images/deadbolt.png', items: [] },
//   { name: 'Leverset', src: './images/leverset.png', items: [] }
// ];

$(document).ready(function () {
  (function (exports) {
    // const TRIANGLE_TOOL_NAME = 'AnnotationCreateTriangle';
    WebViewer({
      path: '@pdftron/WebViewer/public',
      // config: "js/alzkWebviewer.js",
      // custom: JSON.stringify({ message: 'tiger check here' }),
      // disabledElements: ['searchButton']
    }, document.getElementById('viewer'))
      .then(async instance => {
        setupWebViewer(instance);
        const { docViewer, annotManager } = instance;
        const response = await fetch("/loadPDF");
        const myBlob = await response.blob();
        docViewer.loadDocument(myBlob, { filename: "mydoc.pdf" });

        instance.setHeaderItems(header => {
          header.push({
            type: 'actionButton',
            title: 'Save',
            dataElement: 'saveButton',
            img: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
          </svg>`,
            onClick: async () => {
              const doc = docViewer.getDocument();
              const xfdfString = await annotManager.exportAnnotations();
              const options = { xfdfString };
              const data = await doc.getFileData(options);
              const arr = new Uint8Array(data);
              const blob = new Blob([arr], { type: "application/pdf" });

              const formData = new FormData();
              formData.append("file_name", "mydoc.pdf");
              formData.append("file", blob, "mydoc.pdf");
              formData.append("annotation", xfdfString);

              let response = await fetch("/savePDF", {
                method: "POST",
                body: formData
              });
              if (response.status == 200)
                window.alert('Save successfully!!');
              else
                window.alert('Save failed= =');
            }
          });
        });

        // // stamp.js
        // const customStampTool = window.createStampTool(instance);

        // const TriangleCreateTool = exports.TriangleCreateToolFactory.initialize(instance.Annotations, instance.Tools, instance.CoreControls);
        // const TriangleAnnotation = exports.TriangleAnnotationFactory.initialize(instance.Annotations, instance.CoreControls);

        // // register the annotation type so that it can be saved to XFDF files
        // instance.docViewer.getAnnotationManager().registerAnnotationType(TriangleAnnotation.prototype.elementName, TriangleAnnotation);
        // // fxn to check if an annotation is a triangle annotation. allows WebViewer UI to be able to style a selected custom triange annotation
        // const isTriangleAnnot = annotation =>
        //   annotation && annotation[exports.TriangleAnnotationFactory.ANNOT_TYPE] && annotation[exports.TriangleAnnotationFactory.ANNOT_TYPE] === exports.TriangleAnnotationFactory.TRIANGLE_ANNOT_ID;
        // const addTriangleTool = () => {
        //   instance.registerTool(
        //     {
        //       toolName: TRIANGLE_TOOL_NAME,
        //       toolObject: new TriangleCreateTool(instance.docViewer),
        //       buttonImage:
        //         '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">' +
        //         '<path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z"/>' +
        //         '<path fill="none" d="M0 0h24v24H0V0z"/>' +
        //         '</svg>',
        //       buttonName: 'triangleToolButton',
        //       tooltip: 'Triangle',
        //     },
        //     TriangleAnnotation,
        //     annotation => isTriangleAnnot(annotation)
        //   );

        //   const triangleButton = {
        //     type: 'toolButton',
        //     toolName: TRIANGLE_TOOL_NAME,
        //   };

        //   instance.setHeaderItems(header => {
        //     header
        //       .getHeader('toolbarGroup-Annotate')
        //       .get('highlightToolGroupButton')
        //       .insertBefore(triangleButton);
        //   });
        //   instance.setToolMode(TRIANGLE_TOOL_NAME);
        // };

        // const addCustomStampTool = () => {
        //   // Register tool
        //   instance.registerTool({
        //     toolName: 'CustomStampTool',
        //     toolObject: customStampTool,
        //     buttonImage: '../../../samples/annotation/custom-annotations/stamp.png',
        //     buttonName: 'customStampToolButton',
        //     tooltip: 'Approved Stamp Tool',
        //   });

        //   // Add tool button in header
        //   instance.setHeaderItems(header => {
        //     header
        //       .getHeader('toolbarGroup-Annotate')
        //       .get('highlightToolGroupButton')
        //       .insertBefore({
        //         type: 'toolButton',
        //         toolName: 'CustomStampTool',
        //       });
        //   });
        //   instance.setToolMode('CustomStampTool');
        // };

        // const removeCustomStampTool = () => {
        //   instance.unregisterTool('CustomStampTool');
        //   instance.setToolMode('AnnotationEdit');
        // };

        // const removeTriangleTool = () => {
        //   instance.unregisterTool(TRIANGLE_TOOL_NAME);
        //   instance.setToolMode('AnnotationEdit');
        // };

        // document.getElementById('custom-stamp').onchange = e => {
        //   if (e.target.checked) {
        //     addCustomStampTool();
        //   } else {
        //     removeCustomStampTool();
        //   }
        // };

        // document.getElementById('custom-triangle-tool').onchange = e => {
        //   if (e.target.checked) {
        //     addTriangleTool();
        //   } else {
        //     removeTriangleTool();
        //   }
        // };

        instance.iframeWindow.document.body.ondragover = e => {
          e.preventDefault();
          return false;
        };

        instance.iframeWindow.document.body.ondrop = e => {
          const scrollElement = instance.docViewer.getScrollViewElement();
          const scrollLeft = scrollElement.scrollLeft || 0;
          const scrollTop = scrollElement.scrollTop || 0;
          dropPoint = { x: e.pageX + scrollLeft, y: e.pageY + scrollTop };
          e.preventDefault();
          return false;
        };

        // create a stamp image copy for drag and drop
        // const sampleImg = document.getElementById('sample-image');
        // const div = document.createElement('div');
        // const img = document.createElement('img');
        // img.id = 'sample-image-copy';
        // div.appendChild(img);
        // div.style.position = 'absolute';
        // div.style.top = '-500px';
        // div.style.left = '-500px';
        // document.body.appendChild(div);
        // const el = sampleImg.getElementsByTagName('img')[0];
        // img.src = el.src;
        // const height = el.height;
        // const drawImage = () => {
        //   const width = (height / img.height) * img.width;
        //   img.style.width = `${width}px`;
        //   img.style.height = `${height}px`;
        //   const c = document.createElement('canvas');
        //   const ctx = c.getContext('2d');
        //   c.width = width;
        //   c.height = height;
        //   ctx.drawImage(img, 0, 0, width, height);
        //   img.src = c.toDataURL();
        // };
        // img.onload = drawImage;

        // document.getElementById('file-open').onchange = e => {
        //   const fileReader = new FileReader();
        //   fileReader.onload = () => {
        //     const result = fileReader.result;
        //     const uploadImg = new Image();
        //     uploadImg.onload = () => {
        //       const imgWidth = 250;
        //       addStamp(result, {}, { width: imgWidth, height: (uploadImg.height / uploadImg.width) * imgWidth });
        //     };
        //     uploadImg.src = result;
        //   };
        //   if (e.target.files && e.target.files.length > 0) {
        //     fileReader.readAsDataURL(e.target.files[0]);
        //   }
        // };
      });
  })(window);
});

async function setupWebViewer(instance) {
  instance.disableElements(['ribbons', 'toolsHeader']);
  document.getElementById('mdlProdSet').addEventListener('shown.bs.modal', function () {
    clearForm("#formProdSet");
    getInput("#formProdSet","prod_set_name").focus();
  });
  $('#btnSaveProdSet').click(async function () {
    let data = getInputValues('#formProdSet');
    if (data.prod_set_name) {
      let response = await fetch("/saveProductSet", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      if (response.status == 200) {
        await initPalette(instance);
        bootstrap.Modal.getInstance(document.getElementById('mdlProdSet')).hide();
      } else
        window.alert('Save failed= =');
    } else {
      window.alert('Please enter your product set name !!');
    }
  });
  await initPalette(instance);
  // instance.enableElements(['bookmarksPanel', 'bookmarksPanelButton']);
  // instance.enableFeatures([instance.Feature.Measurement]);
}

async function initPalette(instance) {
  const addStamp = (imgData, point, rect) => {
    point = point || {};
    rect = rect || {};
    const { Annotations, docViewer, annotManager } = instance;
    const doc = docViewer.getDocument();
    const displayMode = docViewer.getDisplayModeManager().getDisplayMode();
    const page = displayMode.getSelectedPages(point, point);
    if (!!point.x && page.first == null) {
      return; // don't add to an invalid page location
    }
    const pageNumber = page.first !== null ? page.first : docViewer.getCurrentPage();
    const pageInfo = doc.getPageInfo(pageNumber);
    const pagePoint = displayMode.windowToPage(point, pageNumber);
    const zoom = docViewer.getZoom();

    const stampAnnot = new Annotations.StampAnnotation();
    stampAnnot.PageNumber = pageNumber;
    const rotation = docViewer.getCompleteRotation(pageNumber) * 90;
    stampAnnot.Rotation = rotation;
    if (rotation === 270 || rotation === 90) {
      stampAnnot.Width = rect.height / zoom;
      stampAnnot.Height = rect.width / zoom;
    } else {
      stampAnnot.Width = rect.width / zoom;
      stampAnnot.Height = rect.height / zoom;
    }
    stampAnnot.X = (pagePoint.x || pageInfo.width / 2) - stampAnnot.Width / 2;
    stampAnnot.Y = (pagePoint.y || pageInfo.height / 2) - stampAnnot.Height / 2;

    stampAnnot.ImageData = imgData;
    stampAnnot.Author = annotManager.getCurrentUser();

    annotManager.deselectAllAnnotations();
    annotManager.addAnnotation(stampAnnot);
    annotManager.redrawAnnotation(stampAnnot);
    annotManager.selectAnnotation(stampAnnot);
  };
  const palette = document.getElementById('palette');
  for (let pname in productSets) {
    document.getElementById(pname + 'copy').closest('div').remove();
  }
  const response = await fetch("/getProductSets");
  productSets = await response.json();
  palette.innerHTML = '';
  for (let pname in productSets) {
    const div = document.createElement('div');
    const span = document.createElement('span');
    const img = document.createElement('img');
    div.setAttribute('draggable', true);
    div.appendChild(img);
    div.appendChild(span);
    div.className = "prod-item";
    span.textContent = pname;
    img.src = productSets[pname].src;
    img.onload = function () {
      // div.ondragstart = e => {
      //   e.currentTarget.style.opacity = 0.5;
      //   const img = e.currentTarget.getElementsByTagName('img')[0];
      //   const copy = img.cloneNode(true);
      //   copy.id = 'stamp-image-drag-copy';
      //   const el = document.getElementById(prod.name + 'copy');
      //   copy.src = el.src;
      //   copy.style.width = el.width;
      //   copy.style.height = el.height;
      //   copy.style.padding = 0;
      //   copy.style.position = 'absolute';
      //   copy.style.top = '-1000px';
      //   copy.style.left = '-1000px';
      //   document.body.appendChild(copy);
      //   e.dataTransfer.setDragImage(copy, copy.width * 0.5, copy.height * 0.5);
      //   e.dataTransfer.setData('text', '');
      // };
      // div.ondragend = e => {
      //   const img = e.currentTarget.getElementsByTagName('img')[0];
      //   const el = document.getElementById('stamp-image-drag-copy');
      //   addStamp(img.src, dropPoint, el.getBoundingClientRect());
      //   e.currentTarget.style.opacity = 1;
      //   document.body.removeChild(document.getElementById('stamp-image-drag-copy'));
      //   e.preventDefault();
      // };
      div.onclick = e => {
        let img = e.currentTarget.getElementsByTagName('img')[0];
        addStamp(img.src, {}, document.getElementById(pname + 'copy'));

        // // Register tool
        // instance.registerTool({
        //   toolName: `${prod.name}Tool`,
        //   toolObject: customStampTool,
        //   buttonImage: '../../../samples/annotation/custom-annotations/stamp.png',
        //   buttonName: 'customStampToolButton',
        //   tooltip: 'Approved Stamp Tool',
        // });

        // // Add tool button in header
        // instance.setHeaderItems(header => {
        //   header
        //     .getHeader('toolbarGroup-Annotate')
        //     .get('highlightToolGroupButton')
        //     .insertBefore({
        //       type: 'toolButton',
        //       toolName: 'CustomStampTool',
        //     });
        // });
        // instance.setToolMode('CustomStampTool');
      };
      palette.appendChild(div);

      const div2 = document.createElement('div');
      const img2 = document.createElement('img');
      img2.id = pname + 'copy';
      div2.appendChild(img2);
      div2.style.position = 'absolute';
      div2.style.top = '-500px';
      div2.style.left = '-500px';
      document.body.appendChild(div2);
      img2.src = img.src;
      const height = img2.height;
      const drawImage = () => {
        const width = (height / img2.height) * img2.width;
        img2.style.width = `${width}px`;
        img2.style.height = `${height}px`;
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');
        c.width = width;
        c.height = height;
        ctx.fillStyle = "red";
        ctx.drawImage(img2, 0, 0, width, height);
        img2.src = c.toDataURL();
      };
      img2.onload = drawImage;
    }
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

window.createStampTool = instance => {
  const { docViewer, annotManager, Annotations, Tools } = instance;

  // Custom stamp tool constructor that inherits generic annotation create tool
  class CustomStampCreateTool extends Tools.GenericAnnotationCreateTool {
    constructor() {
      // Inherit generic annotation create tool
      super(docViewer, Annotations.StampAnnotation);
      delete this.defaults.StrokeColor;
      delete this.defaults.FillColor;
      delete this.defaults.StrokeThickness;
    }

    // Override mouseLeftDown
    mouseLeftDown(...args) {
      Tools.AnnotationSelectTool.prototype.mouseLeftDown.apply(this, args);
    }

    // Override mouseMove
    mouseMove(...args) {
      Tools.AnnotationSelectTool.prototype.mouseMove.apply(this, args);
    }

    // Override mouseLeftUp
    mouseLeftUp(e) {
      super.mouseLeftDown(e);

      let annotation;
      if (this.annotation) {
        let width = 212;
        let height = 60;
        const rotation = this.docViewer.getCompleteRotation(this.annotation.PageNumber) * 90;
        this.annotation.Rotation = rotation;
        if (rotation === 270 || rotation === 90) {
          const t = height;
          height = width;
          width = t;
        }
        // 'ImageData' can be a bas64 ImageString or an URL. If it's an URL, relative paths will cause issues when downloading
        this.annotation.ImageData = stampImage;
        this.annotation.Width = width;
        this.annotation.Height = height;
        this.annotation.X -= width / 2;
        this.annotation.Y -= height / 2;
        this.annotation.MaintainAspectRatio = true;
        annotation = this.annotation;
      }

      super.mouseLeftUp(e);

      if (annotation) {
        annotManager.redrawAnnotation(annotation);
      }
    }
  }

  return new CustomStampCreateTool();
};
