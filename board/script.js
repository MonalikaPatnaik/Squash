//Initial references
let colorsRef = document.getElementsByClassName("colors");
let canvas = document.getElementById("canvas");
let backgroundButton = document.getElementById("color-background");
let colorButton = document.getElementById("color-input");
let clearButton = document.getElementById("button-clear");
let eraseButton = document.getElementById("button-erase");
let penButton = document.getElementById("button-pen");
let saveButton = document.getElementById("button-save");
let penSize = document.getElementById("pen-slider");
let toolType = document.getElementById("tool-type");
//eraser = false and drawing=false initially as user hasn't started using both
let erase_bool = false;
let draw_bool = false;
//context for canvas
let context = canvas.getContext("2d");
//Initially mouse X and Y positions are 0
let mouseX = 0;
let mouseY = 0;
//get left and top of canvas
let rectLeft = canvas.getBoundingClientRect().left;
let rectTop = canvas.getBoundingClientRect().top;
//Inital Features
const init = () => {
  context.strokeStyle = "black";
  context.lineWidth = 1;
  //Set canvas height to parent div height
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  //Set range title to pen size
  toolType.innerHTML = "Pen";
  //Set background and color inputs initially
  canvas.style.backgroundColor = "#ffffff";
  backgroundButton.value = "#ffffff";
  penButton.value = context.strokeStyle;
};
//Detect touch device
const is_touch_device = () => {
  try {
    //We try to create TouchEvent (it would fail for desktops and throw error)
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};
//Exact x and y position of mouse/touch
const getXY = (e) => {
  mouseX = (!is_touch_device() ? e.pageX : e.touches?.[0].pageX) - rectLeft;
  mouseY = (!is_touch_device() ? e.pageY : e.touches?.[0].pageY) - rectTop;
};
const stopDrawing = () => {
  context.beginPath();
  draw_bool = false;
};
//User has started drawing
const startDrawing = (e) => {
  //drawing = true
  draw_bool = true;
  getXY(e);
  //Start Drawing
  context.beginPath();
  context.moveTo(mouseX, mouseY);
};
//draw function
const drawOnCanvas = (e) => {
  if (!is_touch_device()) {
    e.preventDefault();
  }
  getXY(e);
  //if user is drawing
  if (draw_bool) {
    //create a line to x and y position of cursor
    context.lineTo(mouseX, mouseY);
    context.stroke();
    if (erase_bool) {
      //destination-out draws new shapes behind the existing canvas content
      context.globalCompositeOperation = "destination-out";
    } else {
      context.globalCompositeOperation = "source-over";
    }
  }
};
//Mouse down/touch start inside canvas
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("touchstart", startDrawing);
//Start drawing when mouse.touch moves
canvas.addEventListener("mousemove", drawOnCanvas);
canvas.addEventListener("touchmove", drawOnCanvas);
//when mouse click stops/touch stops stop drawing and begin a new path
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("touchend", stopDrawing);
//When mouse leaves the canvas
canvas.addEventListener("mouseleave", stopDrawing);
//Button for pen mode
penButton.addEventListener("click", () => {
  //set range title to pen size
  toolType.innerHTML = "Pen";
  erase_bool = false;
});
//Button for eraser mode
eraseButton.addEventListener("click", () => {
  erase_bool = true;
  //set range title to erase size
  toolType.innerHTML = "Eraser";
});
//Adjust Pen size
penSize.addEventListener("input", () => {
  //set width to range value
  context.lineWidth = penSize.value;
});
//Change color
colorButton.addEventListener("change", () => {
  //set stroke color
  context.strokeStyle = colorButton.value;
});
//Change Background
backgroundButton.addEventListener("change", () => {
  canvas.style.backgroundColor = backgroundButton.value;
});
//Clear
clearButton.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.backgroundColor = "#fff";
  backgroundButton.value = "#fff";
});
window.onload = init();
function save2() {
  window.open(canvas.toDataURL('image/png'));
  var gh = canvas.toDataURL('png');

  var a  = document.createElement('a');
  a.href = gh;
  a.download = 'image.png';

  a.click()
}
saveButton.addEventListener("click", () => {
  var gh = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADNQTFRFAAAAPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09EvTTBAAAABB0Uk5TAA8fLz9PX29/j5+vv8/f7/rfIY4AAARsSURBVHja7VvZkusqDAyrAQvQ/3/teZjExrHDZoGrbl0/z0RtLY1oya/X/8+Nh/NHzYuAGPRz9llERET1GACJiIgYngaAkmvNnwTgERHtgwDefngawDofgDkAwPlp4I4AzHQA/gggstk0jF/P7ELQ3wBQPBoBRPRzTyI8P/bBGvh79FMstFXCvDSAt0kHzyBYNv7jj/iAx48DEiwzEfj0AFi/EEw4F+2B/5mfXQsbB4ZDQOKGwM2ioE+4hUdEm3jCjzybRbw4gIXkrxfbySnqCfYhS48rG23fs/wRGYdcGIQv1PsOcIgTkp//xTcs4WbyTEjs67pmFfh8+3+X1s0Jy3z7rxezaZ9EdTjI2MC1MpA37LqN65kjdoJuPmtUUpC40NmvLy2WntM3OcH09RupE8KdMLjefufgBE1gvz2blnj/2pDY7wikSPold9M+dCVSWpDuln1HUMLuCfsHEndP2H+9uO+kJEfVaicNq+zin9udxY6gQcrRlFeNHUG1oCfpjpIjAtmaukQXHRabpJwdMNlFSzZFdL3Dv4WkrlH4lyH6Y6jOgj0BSPUGWV0InrQAztISr2UgahFe1r3XJgHRC9C+qhK3CqC/4H6Sm1XV64ApCKt5NegOgFTGGGPMIlnhx22NA64zhUsppTxVMtcuvY5hcCqX31DhgAu+EgZ+WLjSjoPJvF6mBH5lIFvC7wHBJ7kAAAByjFdkAvdDg0o7/PPByiOCSSIvbfhBo6HExvES/ftwjOs7v7iyoZCl0qhMhHWpDQoX9QvH/xJd+osriAbr9ZktEQONCm3yAD5EEU833YWIlgsA1PD5UwGAGz4DLAAIw0eAeQBs/CTaZi2o8VNYyAIwP2qAHsCSZYGR6xD5xtgPTwGeBzB+I0Xlj+Oajo2kCEK+GRqfg2sWwEAaKhCNLDdsRCkgnwLg8kEeDyDmLQwHoAp3w+EA1kJPPBoAL6lEYnAZmuLtfCwRbToZLwEYNP7X5Vs33NEFuI15BS6U7+auuydmGkoKXI1Kt9RlIZPHIIllLbfzWwboCm2AF480b7WUQkipDWySkhPlg7ggU9apWPFqkWzV2TZC1Am1a1UMltMWW8F6Xve4qpRCX86U3ZQkcEtFF79UKtW8RSJnsvr+IDK7N23HRScH+mrtWQ/RCF3D+DYOaM337bOKftvQ78iKps3fjbDIrkeX22cVLqAKAovVFfD1DzRi/V4AgbWmDMW8ivmO7Qto9FlV/FvGr5xsZilj3/hXI00UTPcKi6PYgkrXR5qnb/72ZuRho03fSF5E1xOGg7qvb5VPz2akTmcbnT48LExDCysycxitdGfRcWUbar2gvj59cDfqyH3NoMpNyt+k5r77t1B+tb/eZNzJtTt1y+4umXM49b9g1AmFUPvloDdzqsppDweA/RuSOoDLv6D7GvRAKPUP5ceo3DWbX4nFXm5iy8ubEfqCWiut22HDDqZcyBuP6zL6s0euLVzbBqunfWbFpTZmhfdjjVFy9seO/6nnH0Mpp/3TjvofAAAAAElFTkSuQmCC"

  var a  = document.createElement('a');
  a.href = gh;
  a.download = 'image.png';

  a.click()
});
