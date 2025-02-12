const text = "It's an exciting time to be an A.I. engineer.";

const response = await fetch();

const $audioElement = document.querySelector("#speech");
const blobAsURL = URL.createObjectURL(response);
$audioElement.src = blobAsURL;
