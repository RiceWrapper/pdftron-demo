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
let HWSets = {};
var instance;
var hardwareList = [
  { prod_line: "Commercial Locks", item_no: "FD360D", unit_price: 360, keyway: [] },
  { prod_line: "Commercial Locks", item_no: "FD701", unit_price: 320, keyway: [] },
  { prod_line: "Commercial Locks", item_no: "FD702", unit_price: 300, keyway: [] },
  { prod_line: "Commercial Locks", item_no: "FD761", unit_price: 280, keyway: [] },
  { prod_line: "Commercial Locks", item_no: "FD762", unit_price: 370, keyway: [] },
  { prod_line: "Residential Locks", item_no: "FC3650", unit_price: 200, keyway: [] },
  { prod_line: "Residential Locks", item_no: "FC3750", unit_price: 220, keyway: [] },
  { prod_line: "Residential Locks", item_no: "FC3850", unit_price: 210, keyway: [] },
  { prod_line: "PROMAX Locks", item_no: "PD271", unit_price: 230, keyway: [] },
  { prod_line: "PROMAX Locks", item_no: "PD272", unit_price: 240, keyway: [] }
]
// let productSet = [
//   { name: 'Deadbolt', src: './images/deadbolt.png', items: [] },
//   { name: 'Leverset', src: './images/leverset.png', items: [] }
// ];

$(document).ready(function () {
  let container = document.querySelector('#iconHWSet');
  let matches = container.querySelectorAll('div');
  for (let div of matches) {
    div.addEventListener('click', function (event) {
      if (div.classList.contains('selected')) {
        div.classList.remove('selected');
      } else {
        for (let div2 of matches) {
          div2.classList.remove('selected');
        }
        div.classList.add('selected');
      }
    })
  }

  let selector = document.getElementById("prod_line");
  let prod_lines = hardwareList.filter((v, i) => i === hardwareList.findIndex(v2 => v2.prod_line == v.prod_line));
  for (let pitem of prod_lines) {
    let option = document.createElement('option');
    option.setAttribute("value", pitem.prod_line);
    option.text = pitem.prod_line;
    selector.appendChild(option);
  }
  onProdLineChanged(selector);

  (function (exports) {
    // const TRIANGLE_TOOL_NAME = 'AnnotationCreateTriangle';
    WebViewer({
      path: '@pdftron/WebViewer/public',
      // config: "js/alzkWebviewer.js",
      // custom: JSON.stringify({ message: 'tiger check here' }),
      // disabledElements: ['searchButton']
      css: 'css/index.css'
    }, document.getElementById('viewer'))
      .then(async _instance => {
        instance = _instance;
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

        instance.setAnnotationContentOverlayHandler(annotation => {
          // let hw_set_name = annotation.Subject;
          // let response = await fetch(`/getHWSet?hw_set_name=${hw_set_name}`, {
          //   headers: { 'Content-Type': 'application/json' }
          // });
          // if (response.status == 200) {
          let HWSet = {
            "pname": "Deadbolt-01",
            "src": "./images/deadbolt.png",
            "items": [{
              "prod_line": "Commercial Locks",
              "item_no": "FD360D",
              "unit_price": 360,
              "quantity": 2,
              "total_price": 720
            }]
          }
          // let HWSet = await response.json();
          const div = document.createElement('div');
          const h3 = document.createElement("h3");
          h3.textContent = annotation.Subject;
          const table = document.createElement("table");
          const keys = ["item_no", "quantity", "unit_price", "total_price"];
          let _tr = document.createElement("tr");
          for (let key of keys) {
            let th = document.createElement("th");
            th.textContent = key;
            _tr.appendChild(th);
          }
          table.appendChild(_tr);

          for (let item of HWSet.items) {
            let tr = document.createElement("tr");
            for (let key of keys) {
              let td = document.createElement("td");
              td.textContent = item[key];
              tr.appendChild(td);
            }
            table.appendChild(tr);
          }
          div.appendChild(h3);
          div.appendChild(table);
          return div;
          // }
        });

        // instance.iframeWindow.document.body.ondragover = e => {
        //   e.preventDefault();
        //   return false;
        // };

        // instance.iframeWindow.document.body.ondrop = e => {
        //   const scrollElement = instance.docViewer.getScrollViewElement();
        //   const scrollLeft = scrollElement.scrollLeft || 0;
        //   const scrollTop = scrollElement.scrollTop || 0;
        //   dropPoint = { x: e.pageX + scrollLeft, y: e.pageY + scrollTop };
        //   e.preventDefault();
        //   return false;
        // };

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

function onProdLineChanged(el) {
  if (el.value) {
    let selector = document.getElementById("item_no");
    selector.innerHTML = "";
    let prod_lines = hardwareList.filter((v) => v.prod_line == el.value);
    for (let pitem of prod_lines) {
      let option = document.createElement('option');
      option.setAttribute("value", pitem.item_no);
      option.text = pitem.item_no + ` - $${pitem.unit_price}/per`;
      selector.appendChild(option);
    }
    onItemNoChanged(selector);
  }
}

function onItemNoChanged(el) {
  let item_no = el.value;
  let product = hardwareList.find(x => x.item_no == item_no);
  let unit_price = document.getElementById("unit_price");
  if (product) {
    unit_price.value = product.unit_price;
  } else {
    unit_price.value = 0;
  }
}

function showTab(no) {
  let container = document.querySelector('#mdlHWSet');
  let matches = container.querySelectorAll('div.modal-content');
  for (let match of matches) {
    match.style.display = (match.id == `mdlHWSet${no}`) ? 'block' : "none";
  }
}

async function setupWebViewer(instance) {
  instance.disableElements(['ribbons', 'toolsHeader']);
  document.getElementById('mdlHWSet').addEventListener('shown.bs.modal', function () {
    clearForm("#formHWSet");
    getInput("#formHWSet", "prod_set_name").focus();
  });
  $('#btnSaveHWSet').click(async function () {
    let data = getInputValues('#formHWSet');
    if (data.prod_set_name) {
      let container = document.querySelector('#iconHWSet');
      let match = container.querySelector('div.selected');
      if (match) {
        let tblHWSetDetail = document.getElementById("tblHWSetDetail");
        let trs = tblHWSetDetail.querySelectorAll("tr");
        if (trs.length > 1) {
          let items = [];
          for (let i = 1; i < trs; i++) {
            let tds = trs[i].querySelectorAll("td");
            let item = {};
            item.item_no = tds[1].textContent;
            item.quantity = tds[2].textContent;
            item.unit_price = tds[3].textContent;
            item.total_price = tds[4].textContent;
            items.push(item);
          }
          let icon = match.querySelector('img');
          data.src = icon.src.replace(window.location.href, "./");
          data.items = JSON.stringify(items);
          let response = await fetch("/saveProductSet", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (response.status == 200) {
            await initPalette(instance);
            bootstrap.Modal.getInstance(document.getElementById('mdlHWSet')).hide();
            setTimeout(() => {
              document.getElementById(data.prod_set_name).click();
            }, 1000);
          } else
            window.alert('Save failed= =');
        } else {
          window.alert('Please add a hareware at least !!');
        }
      } else {
        window.alert('Please choose an icon !!');
      }
    } else {
      window.alert('Please enter your product set name !!');
    }
  });
  $('#btnSaveHWSetDetail').click(function () {
    let data = getInputValues('#formHWSetDetail');
    let table = document.getElementById("tblHWSetDetail");
    let tr = document.createElement("tr");
    let keys = ["actions", "item_no", "quantity", "unit_price", "total_price"];
    for (let key of keys) {
      let td = document.createElement("td");
      if (key == "actions") {
        let button = document.createElement("button");
        button.textContent = "Remove";
        button.onclick = function(e) {
          table.removeChild(e.currentTarget.parentNode.parentNode);
        }
        td.appendChild(button);
      } else if (key == "total_price")
        td.textContent = data["quantity"] * data["unit_price"];
      else
        td.textContent = data[key];
      tr.appendChild(td);
    }
    table.appendChild(tr);
    showTab('1');
  });
  await initPalette(instance);
  // instance.enableElements(['bookmarksPanel', 'bookmarksPanelButton']);
  // instance.enableFeatures([instance.Feature.Measurement]);
}

async function initPalette(instance) {
  // const addStamp = (imgData, point, rect) => {
  //   point = point || {};
  //   rect = rect || {};
  //   const { Annotations, docViewer, annotManager } = instance;
  //   const doc = docViewer.getDocument();
  //   const displayMode = docViewer.getDisplayModeManager().getDisplayMode();
  //   const page = displayMode.getSelectedPages(point, point);
  //   if (!!point.x && page.first == null) {
  //     return; // don't add to an invalid page location
  //   }
  //   const pageNumber = page.first !== null ? page.first : docViewer.getCurrentPage();
  //   const pageInfo = doc.getPageInfo(pageNumber);
  //   const pagePoint = displayMode.windowToPage(point, pageNumber);
  //   const zoom = docViewer.getZoom();

  //   const stampAnnot = new Annotations.StampAnnotation();
  //   stampAnnot.PageNumber = pageNumber;
  //   const rotation = docViewer.getCompleteRotation(pageNumber) * 90;
  //   stampAnnot.Rotation = rotation;
  //   if (rotation === 270 || rotation === 90) {
  //     stampAnnot.Width = rect.height / zoom;
  //     stampAnnot.Height = rect.width / zoom;
  //   } else {
  //     stampAnnot.Width = rect.width / zoom;
  //     stampAnnot.Height = rect.height / zoom;
  //   }
  //   stampAnnot.X = (pagePoint.x || pageInfo.width / 2) - stampAnnot.Width / 2;
  //   stampAnnot.Y = (pagePoint.y || pageInfo.height / 2) - stampAnnot.Height / 2;

  //   stampAnnot.ImageData = imgData;
  //   stampAnnot.Author = annotManager.getCurrentUser();

  //   annotManager.deselectAllAnnotations();
  //   annotManager.addAnnotation(stampAnnot);
  //   annotManager.redrawAnnotation(stampAnnot);
  //   annotManager.selectAnnotation(stampAnnot);
  // };
  const addCustomStampTool = (prodSet, img) => {
    const customStampTool = window.createStampTool(instance, prodSet, img);
    // Register tool
    instance.registerTool({
      toolName: `${prodSet.pname}Tool`,
      toolObject: customStampTool,
      buttonImage: '../../../samples/annotation/custom-annotations/stamp.png',
      buttonName: `${prodSet.pname}ToolButton`,
      tooltip: 'Approved Stamp Tool',
    });

    // Add tool button in header
    instance.setHeaderItems(header => {
      header
        .getHeader('toolbarGroup-Annotate')
        .get('highlightToolGroupButton')
        .insertBefore({
          type: 'toolButton',
          toolName: `${prodSet.pname}Tool`,
        });
    });
    instance.setToolMode(`${prodSet.pname}Tool`);
  };
  const removeCustomStampTool = (prodSet) => {
    instance.unregisterTool(`${prodSet.pname}Tool`);
    instance.setToolMode('AnnotationEdit');
  };
  const palette = document.getElementById('palette');
  // for (let pname in HWSets) {
  //   document.getElementById(pname + 'copy').closest('div').remove();
  // }
  const response = await fetch("/getHWSets");
  HWSets = await response.json();
  palette.innerHTML = '';
  for (let pname in HWSets) {
    const div = document.createElement('div');
    const span = document.createElement('span');
    const img = document.createElement('img');
    div.id = pname;
    div.setAttribute('draggable', true);
    div.appendChild(img);
    div.appendChild(span);
    div.className = "hw-item";
    span.innerHTML = `&nbsp;&nbsp;&nbsp;${pname}`;
    img.src = HWSets[pname].src;
    img.onload = function () {

      div.onclick = e => {
        let img = e.currentTarget.getElementsByTagName('img')[0];
        if (e.currentTarget.classList.contains('selected')) {
          e.currentTarget.classList.remove('selected');
          removeCustomStampTool(HWSets[pname]);
        } else {
          let els = document.querySelectorAll('div.selected');
          for (let el of els) el.click();
          e.currentTarget.classList.add('selected');
          addCustomStampTool(HWSets[pname], img);
        }
        // addStamp(img.src, {}, document.getElementById(pname + 'copy'));
      };
      palette.appendChild(div);

      // const div2 = document.createElement('div');
      // const img2 = document.createElement('img');
      // img2.id = pname + 'copy';
      // div2.appendChild(img2);
      // div2.style.position = 'absolute';
      // div2.style.top = '-500px';
      // div2.style.left = '-500px';
      // document.body.appendChild(div2);
      // img2.src = img.src;
      // const height = img2.height;
      // const drawImage = () => {
      //   const width = (height / img2.height) * img2.width;
      //   img2.style.width = `${width}px`;
      //   img2.style.height = `${height}px`;
      //   const c = document.createElement('canvas');
      //   const ctx = c.getContext('2d');
      //   c.width = width;
      //   c.height = height;
      //   ctx.fillStyle = "red";
      //   ctx.drawImage(img2, 0, 0, width, height);
      //   img2.src = c.toDataURL();
      // };
      // img2.onload = drawImage;
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

window.createStampTool = (instance, prodSet, img) => {
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
        let width = 20;
        let height = 20;
        const rotation = this.docViewer.getCompleteRotation(this.annotation.PageNumber) * 90;
        this.annotation.Rotation = rotation;
        if (rotation === 270 || rotation === 90) {
          const t = height;
          height = width;
          width = t;
        }
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        // ctx.drawImage(img.src, 0, 0, width, height);
        // 'ImageData' can be a bas64 ImageString or an URL. If it's an URL, relative paths will cause issues when downloading
        // console.log('tiger load icon:' + prodSet.src.substr(1))
        // this.annotation.ImageData = 'http://localhost:9988' + prodSet.src.substr(1);
        this.annotation.Subject = prodSet.pname;
        this.annotation.ImageData = dataURL;
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