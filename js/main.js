var users_Api =
  "http://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture"; // думаю что делать с этим)

const init = () => {
  let usersData = [];
  const usersBlocks = document.querySelector(".users-blocks");

  getUsers(users_Api, usersData);

  document.querySelector(".close").addEventListener("click", closeModal);
  document
    .getElementById("sortAlphabetically")
    .addEventListener("click", () => sortAlphabetically(usersData));
  document
    .getElementById("backSort")
    .addEventListener("click", () => backSort(usersData));

  // usersBlocks.addEventListener("click", () => {
  //   event.target.classList.value === "user" && renderModal(usersData);
  // });
  usersBlocks.addEventListener("click", () => {
    (event.target.classList.value === "peoples-title" ||
      event.target.classList.value === "img-medium") &&
      renderModal(usersData);
  });
};

const getUsers = async (url, usersData) => {
  const cors_Api = "https://cors-anywhere.herokuapp.com/";
  try {
    let response = await fetch(cors_Api + url);
    if (response.ok) {
      let result = await response.json();
      console.log(result);
      okReq(result, usersData);
    } else {
      badReq(response);
    }
  } catch (e) {
    badReq(e);
  }
};

const badReq = (response) => {
  if (response.ok === false) {
    console.log("response status", response.status);
  } else {
    console.log("ERROR HTTP: " + response);
  }
};

function okReq(result, usersData) {
  usersData.push(...result.results);
  renderUsers(usersData);
}

const renderUsers = (usersData) => {
  const usersBlock = document.querySelector(".users-blocks");
  usersBlock.innerHTML = "";
  usersData.forEach((user) => {
    usersBlock.innerHTML += `
      <div class="user" id="${user.location.postcode}">
        <img src="${user.picture.medium}" alt="Аватарка" class="img-medium" />
        <span class="peoples-title">${user.name.title}, ${user.name.first} ${user.name.last}</span>
      </div>
    `;
  });
};

const sortAlphabetically = (usersData) => {
  usersData.sort((a, b) => (a.name.last > b.name.last ? 1 : -1));
  renderUsers(usersData);
};

const backSort = (usersData) => {
  usersData.sort((a, b) => (a.name.last > b.name.last ? -1 : 1));
  renderUsers(usersData);
};

function renderModal(usersData) {
  const modalData = {
    modalWrap: document.querySelector(".peoples-popup"),
    imagesLarge: document.querySelector(".img-large"),
    title: document.querySelector(".popup-title"),
    street: document.querySelector(".people-street"),
    city: document.querySelector(".people-city"),
    state: document.querySelector(".people-state"),
    email: document.querySelector(".people-email"),
    phone: document.querySelector(".people-telephone"),
  };

  modalData.modalWrap.setAttribute("style", "display:block");
  let userCard = event.target.closest(".user");

  usersData.forEach((user) => {
    if (+userCard.id === user.location.postcode) {
      modalData.title.innerHTML = `Full name: ${user.name.title} . ${user.name.first} ${user.name.last}`;
      modalData.city.innerHTML = `City: ${user.location.city}`;
      modalData.state.innerHTML = `State: ${user.location.state}`;
      modalData.email.innerHTML = `Mail: ${user.email}`;
      modalData.street.innerHTML = `street: ${user.location.street}`;
      modalData.phone.innerHTML = user.phone;
      modalData.imagesLarge.src = user.picture.large;
    }
  });
}

const closeModal = () => {
  document.querySelector(".peoples-popup").style.display = "none";
};

init();
