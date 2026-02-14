document.addEventListener("DOMContentLoaded", () => {
  const savedData = JSON.parse(localStorage.getItem("aboutData"));
  if (savedData) {
    document.getElementById("name").innerText = savedData.name;
    document.getElementById("bio").innerHTML = savedData.bio;
    document.getElementById("contact-text").innerHTML = savedData.contact;
    document.getElementById("messengers").innerHTML = savedData.messengers;
    document.getElementById("work-title").innerText = savedData.workTitle;
    document.getElementById("work-list").innerHTML = savedData.workList;
    document.getElementById("profile-img").src = savedData.imgSrc;
  }
});
