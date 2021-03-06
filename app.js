const main = document.querySelector('.main');
const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const searchForm = document.getElementById("search-form");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
const loader = document.getElementById("loader");
const emptyBox = document.getElementById("empty-box");
const notFound = document.getElementById("not-found-box");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  // hide loader
  toggleItemVisibility(loader.classList, false);

  imagesArea.style.display = "block";
  // show gallery title
  galleryHeader.style.display = "flex";
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  });
};

const getImages = (query) => {
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (!data.hits.length) {
        toggleItemVisibility(loader.classList, false);
        toggleItemVisibility(notFound.classList, true);
        return;
      }
      showImages(data.hits)
    })
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
    element.classList.add("added");
  } else {
    // if image already selected,
    // remove it from array and
    // remove the added class.
    sliders.splice(item, 1);
    element.classList.remove("added");
  }
};

// this will be called to add or remove images
const goBack = () => {
  main.style.display = "none";
  imagesArea.style.display = "block";
  // clear previous interval
  clearInterval(timer);
};

var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // create slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  main.style.display = "block";
  // hide image aria
  imagesArea.style.display = "none";
  // if given duration is negetive, make it positive
  const validDuration = Math.abs(document.getElementById("duration").value);
  const duration = validDuration || 1000;

  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
  // this button will allow you to add or remove image.
  let goBackButton = `<button id="backButton" onclick="goBack()" class="btn btn-primary mb-3">Add or Remove Image</button>`;
  sliderContainer.insertAdjacentHTML("afterbegin", goBackButton);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

// it will execute when form is submitted
let submitForm = (event) => {
  event.preventDefault();
  // remove gallery content first
  gallery.innerHTML = "";
  // hide empty box
  toggleItemVisibility(emptyBox.classList, false);
  // hide not found icon
  toggleItemVisibility(notFound.classList, false);
  // hide main section
  main.style.display = 'none';
  // show loader
  toggleItemVisibility(loader.classList, true);

  main.style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  getImages(search.value);
  sliders.length = 0;
};

sliderBtn.addEventListener("click", function () {
  createSlider();
});

let toggleItemVisibility = (item, isShown) => {
  let loaderClassList = item;
  let addClass = (className) => loaderClassList.add(className);
  let removeClass = (className) => loaderClassList.remove(className);
  if (isShown) {
    removeClass("d-none");
    addClass("d-flex");
  } else {
    removeClass("d-flex");
    addClass("d-none");
  }
};
