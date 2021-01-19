let custom = {};
let productSets = [];
// let TigerAnnotation;
// let TigerCreateTool;
// let tigerToolName = 'AnnotationCreateTiger';

window.addEventListener('viewerLoaded', async () => {
  const { docViewer } = readerControl;
  // readerControl.disableElements(['toolbarGroup-View', 'toolbarGroup-Annotate', 'toolbarGroup-Shapes', 'toolbarGroup-Edit']);
  // readerControl.disableElements(['ribbons']);
  readerControl.setToolbarGroup('toolbarGroup-Insert');

  // const tool = new Tools.RubberStampCreateTool(docViewer);
  // const sAnnot = await tool.getStandardStampAnnotations();
  // const cAnnot = await tool.getCustomStampAnnotations();

  // const eAnnot = new Tools.EllipseCreateTool(docViewer);
  // annot.setCustomStamps(productSets[0]);
  // annot.addStamp();

  // Tools.setRubberStamp(annot);

  const tool = docViewer.getTool('AnnotationCreateRubberStamp');
  // tool.setStandardStamps([
  //   '/images/pin.png'
  // ]);

  // productSets = [
  //   { title: "L", subtitle: "", width: 20, height: 20, color: new Annotations.Color(getRandomColor()) },
  //   { title: "D", subtitle: "", width: 20, height: 20, color: new Annotations.Color(getRandomColor()) },
  // ];
  // tool.setCustomStamps(productSets);

  // initTigerAnnotation();

  docViewer.on('documentLoaded', () => {
    // set the tool mode to our tool so that we can start using it right away
    readerControl.setToolMode(triangleToolName);
  });

  custom = JSON.parse(readerControl.getCustomData());
  console.log(custom.message);

  let response = await fetch("/loadDoc");
  let myBlob = await response.blob();
  docViewer.loadDocument(myBlob, { filename: "mydoc.pdf" });
});

window.addEventListener('documentLoaded', () => {
  const docViewer = readerControl.docViewer;
  const annotManager = docViewer.getAnnotationManager();

  readerControl.setHeaderItems(header => {
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

        const request = new XMLHttpRequest();
        request.open("POST", "/save");
        request.send(formData);

        let response = await fetch("/save", {
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
});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function initTriangleAnnotation() {
  const { docViewer } = readerControl;
  const annotManager = docViewer.getAnnotationManager();

  productSets = [
    { title: "L", subtitle: "", width: 20, height: 20, color: new Annotations.Color(getRandomColor()) },
    { title: "D", subtitle: "", width: 20, height: 20, color: new Annotations.Color(getRandomColor()) },
  ];

  const TriangleAnnotation = function () {
    Annotations.MarkupAnnotation.call(this);
    this.Subject = 'Triangle';
    this.vertices = [];
    const numVertices = 3;
    for (let i = 0; i < numVertices; ++i) {
      this.vertices.push({
        x: 0,
        y: 0
      });
    }
  };
  TriangleAnnotation.prototype = new Annotations.MarkupAnnotation();
  TriangleAnnotation.prototype.elementName = 'triangle';
  TriangleAnnotation.prototype.draw = function (ctx, pageMatrix) {
    // the setStyles function is a function on markup annotations that sets up
    // certain properties for us on the canvas for the annotation's stroke thickness.
    this.setStyles(ctx, pageMatrix);

    // first we need to translate to the annotation's x/y coordinates so that it's
    // drawn in the correct location
    ctx.translate(this.X, this.Y);
    ctx.beginPath();
    ctx.moveTo(this.Width / 2, 0);
    ctx.lineTo(this.Width, this.Height);
    ctx.lineTo(0, this.Height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const TriangleCreateTool = function (docViewer) {
    // TriangleAnnotation is the constructor function for our annotation we defined previously
    Tools.GenericAnnotationCreateTool.call(this, docViewer, TriangleAnnotation);
  };
  TriangleCreateTool.prototype = new Tools.GenericAnnotationCreateTool();

  const triangleToolName = 'AnnotationCreateTriangle';

  // register the annotation type so that it can be saved to XFDF files
  annotManager.registerAnnotationType(TriangleAnnotation.prototype.elementName, TriangleAnnotation);

  const triangleTool = new TriangleCreateTool(docViewer);
  readerControl.registerTool({
    toolName: triangleToolName,
    toolObject: triangleTool,
    buttonImage: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">' +
      '<path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z"/>' +
      '<path fill="none" d="M0 0h24v24H0V0z"/>' +
      '</svg>',
    buttonName: 'triangleToolButton',
    tooltip: 'Triangle'
  }, TriangleAnnotation);

  readerControl.setHeaderItems((header) => {
    header.getHeader('toolbarGroup-Shapes').get('freeHandToolGroupButton').insertBefore({
      type: 'toolButton',
      toolName: triangleToolName
    });
  });
}

function initTigerAnnotation() {
  const { docViewer } = readerControl;
  const annotManager = docViewer.getAnnotationManager();

  productSets = [
    { title: "L", subtitle: "", width: 20, height: 20, color: new Annotations.Color(getRandomColor()) },
    { title: "D", subtitle: "", width: 20, height: 20, color: new Annotations.Color(getRandomColor()) },
  ];

  const TigerAnnotation = function () {
    Annotations.MarkupAnnotation.call(this);
    this.Subject = 'Tiger';
    this.vertices = [];
    const numVertices = 3;
    for (let i = 0; i < numVertices; ++i) {
      this.vertices.push({
        x: 0,
        y: 0
      });
    }
  };
  TigerAnnotation.prototype = new Annotations.MarkupAnnotation();
  TigerAnnotation.prototype.elementName = 'tiger';
  TigerAnnotation.prototype.draw = function (ctx, pageMatrix) {
    // the setStyles function is a function on markup annotations that sets up
    // certain properties for us on the canvas for the annotation's stroke thickness.
    this.setStyles(ctx, pageMatrix);

    // first we need to translate to the annotation's x/y coordinates so that it's
    // drawn in the correct location
    ctx.translate(this.X, this.Y);
    ctx.beginPath();
    ctx.arc(this.X, this.Y, 20, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const TigerCreateTool = function (docViewer) {
    // TriangleAnnotation is the constructor function for our annotation we defined previously
    Tools.GenericAnnotationCreateTool.call(this, docViewer, TigerAnnotation);
  };
  TigerCreateTool.prototype = new Tools.GenericAnnotationCreateTool();

  const tigerToolName = 'AnnotationCreateTiger';

  // register the annotation type so that it can be saved to XFDF files
  annotManager.registerAnnotationType(TigerAnnotation.prototype.elementName, TigerAnnotation);

  const tigerTool = new TigerCreateTool(docViewer);
  readerControl.registerTool({
    toolName: tigerToolName,
    toolObject: tigerTool,
    buttonImage: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">' +
      '<path d="M12 7.77L18.39 18H5.61L12 7.77M12 4L2 20h20L12 4z"/>' +
      '<path fill="none" d="M0 0h24v24H0V0z"/>' +
      '</svg>',
    buttonName: 'tigerToolButton',
    tooltip: 'Tiger'
  }, TigerAnnotation);

  readerControl.setHeaderItems((header) => {
    header.getHeader('toolbarGroup-Shapes').get('freeHandToolGroupButton').insertBefore({
      type: 'toolButton',
      toolName: tigerToolName
    });
  });
}