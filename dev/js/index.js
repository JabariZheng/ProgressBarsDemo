var pageClickOrTouch = (function () {
  if ('ontouchstart' in document) {
    return 'touchstart';
  } else {
    return 'click';
  };
})();

function ProgressBars () {
  this.barsWidth = 300;
  this.endPoint = {
    buttons: [11, 22, -38, -42],
    bars: [35, 15, 130, 10, 5, 6],
    limit: 130
  };
  this.selectBarIndex = 0;
  this.init();
};

ProgressBars.prototype.init = function () {
  // append bars list
  let appDom = document.getElementById("bars-list");
  for (let i = 0; i < this.endPoint.bars.length; i++) {
    let _element = this.endPoint.bars[i];
    let newDiv = document.createElement("div");
    let newDivId = `bars-list-${i + 1}`;
    newDiv.className = i == 0 ? 'bars selected' : 'bars';
    newDiv.id = newDivId;
    let newSpan = document.createElement("span");
    newSpan.textContent = `${_element}%`;
    newDiv.appendChild(newSpan);
    newDiv.style.width = `${this.barsWidth}px`;
    let childDiv = document.createElement("div");
    childDiv.style.width = `${_element * this.barsWidth / 100}px`;
    _element < 100 ? childDiv.className = 'progress normal' : childDiv.className = 'progress warning';
    newDiv.appendChild(childDiv);
    appDom.appendChild(newDiv);
  };

  // render select option list
  this.renderSelectOption();
  // render button list
  this.renderButton();
}

ProgressBars.prototype.renderSelectOption = function () {
  let selectDom = document.getElementById("select-bar");
  const { endPoint } = this;
  for (let i = 0; i < endPoint.bars.length; i++) {
    let newOption = document.createElement("option");
    newOption.value = i;
    newOption.textContent = `#progress ${i + 1}`;
    selectDom.appendChild(newOption);
  };
}

ProgressBars.prototype.renderButton = function () {
  const { endPoint } = this;
  let buttonParentDom = document.getElementById("function-button-list");
  for (let i = 0; i < endPoint.buttons.length; i++) {
    let _element = endPoint.buttons[i];
    let button = document.createElement("button");
    button.textContent = `${_element}`;
    button.dataset.type = _element < 0 ? 'sub' : 'add';
    buttonParentDom.appendChild(button);
  };
}

ProgressBars.prototype.editBar = function (type, number) {
  let allBars = document.querySelectorAll(".bars");
  for (let i = 0; i < allBars.length; i++) {
    let _elementBar = allBars[i];
    let spanContext = _elementBar.querySelector('span').textContent;
    if (i == this.selectBarIndex) {
      let barNumber = parseFloat(spanContext);
      let setClassName = '',
        showNumber = 0;
      switch (type) {
        // +
        case 'add':
          setClassName = barNumber + number > 100 ? 'bars warning' : 'bars normal';
          showNumber = barNumber + number > this.endPoint.limit ? this.endPoint.limit : (barNumber + number);
          break;
        // -
        case 'sub':
          setClassName = barNumber + number < 0 ? 'bars warning' : 'bars normal';
          showNumber = barNumber - number < 0 ? 0 : (barNumber - number);
          break;
        default:
          break;
      };
      _elementBar.className = setClassName;
      _elementBar.querySelector('span').textContent = `${showNumber}%`;
      _elementBar.querySelector('.progress').className = `progress ${showNumber > 100 ? 'warning' : 'normal'}`;
      _elementBar.querySelector('.progress').style.width = `${showNumber * this.barsWidth / 100}px`;
      return;
    }
  }
};

var bars = new ProgressBars();

function selectChange () {
  bars.selectBarIndex = event.target.value;
  let allBars = document.querySelectorAll(".bars");
  for (let i = 0; i < allBars.length; i++) {
    i == event.target.value ? allBars[i].className = 'bars selected' : allBars[i].className = 'bars';
  }
}

document.getElementById('function-button-list').addEventListener(pageClickOrTouch, function (event) {
  if (event.target.tagName != "BUTTON") {
    return
  };
  let type = event.target.dataset.type,
    number = Math.abs(event.target.textContent);
  bars.editBar(type, number);
})