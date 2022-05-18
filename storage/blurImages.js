var allImages = document.getElementsByTagName('img');

for(var i = 0; i < allImages.length ; i++) {
  allImages[i].style = "filter:blur(10px)"
}