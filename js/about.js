document.addEventListener("DOMContentLoaded", () => {
  const editPhotoBtn = document.getElementById("edit-photo-btn");
  const uploadInput = document.getElementById("upload-profile");
  const profileImg = document.getElementById("profile-img");
  const saveBtn = document.getElementById("save-btn");

  // انتخاب عکس
  editPhotoBtn.addEventListener("click", () => uploadInput.click());
  uploadInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (profileImg.src = reader.result);
      reader.readAsDataURL(file);
    }
  });

  // ذخیره در localStorage
  saveBtn.addEventListener("click", () => {
    const data = {
      name: document.getElementById("name").innerText.trim(),
      bio: document.getElementById("bio").innerHTML,
      contact: document.getElementById("contact-text").innerHTML,
      messengers: document.getElementById("messengers").innerHTML,
      workTitle: document.getElementById("work-title").innerText.trim(),
      workList: document.getElementById("work-list").innerHTML,
      imgSrc: profileImg.src
    };

    localStorage.setItem("aboutData", JSON.stringify(data));
    alert("✅ تغییرات با موفقیت ذخیره شد!");
  });

  // لود اطلاعات قبلی برای ویرایش مجدد
  const savedData = JSON.parse(localStorage.getItem("aboutData"));
  if (savedData) {
    document.getElementById("name").innerText = savedData.name;
    document.getElementById("bio").innerHTML = savedData.bio;
    document.getElementById("contact-text").innerHTML = savedData.contact;
    document.getElementById("messengers").innerHTML = savedData.messengers;
    document.getElementById("work-title").innerText = savedData.workTitle;
    document.getElementById("work-list").innerHTML = savedData.workList;
    profileImg.src = savedData.imgSrc;
  }
});
