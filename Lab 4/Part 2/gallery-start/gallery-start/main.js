const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

/* Declaring the array of image filenames */
const imageArray = ['images/pic1.jpg', 'images/pic2.jpg', 'images/pic3.jpg', 'images/pic4.jpg', 'images/pic5.jpg'];

/* Declaring the alternative text for each image file */
const altText = [
  'Closeup of a human eye',
  'Rock that looks like a wave',
  'Purple and white pansies',
  'Section of wall from an Egyptian tomb',
  'Large moth on a leaf'
];

/* Looping through images */
for (let i = 0; i < imageArray.length; i++) {
  const newImage = document.createElement('img');
  newImage.setAttribute('src', imageArray[i]);
  newImage.setAttribute('alt', altText[i]);
  thumbBar.appendChild(newImage);

  newImage.addEventListener('click', function() {
    displayedImage.setAttribute('src', imageArray[i]);
    displayedImage.setAttribute('alt', altText[i]);
  });
}

/* Wiring up the Darken/Lighten button */
btn.addEventListener('click', function() {
  const btnClass = btn.getAttribute('class');
  if (btnClass === 'dark') {
    btn.setAttribute('class', 'light');
    btn.textContent = 'Lighten';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  } else {
    btn.setAttribute('class', 'dark');
    btn.textContent = 'Darken';
    overlay.style.backgroundColor = 'rgba(0,0,0,0)';
  }
});
