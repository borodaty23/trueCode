const users_Api =
  "http://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture"; // думаю что делать с этим)

const commonVariables = () => {
  const modal = document.querySelector(".modal");
  const louder = document.querySelector(".preLoader");
  const usersBlocks = document.querySelector(".users-blocks");
  return { modal, louder, usersBlocks };
};

const init = () => {
  const usersData = [];
  const { usersBlocks } = commonVariables();
  const sortAlphabeticallyBtn = document.getElementById("sortAlphabetically");
  const backSortBtn = document.getElementById("backSort");

  getUsers(users_Api, usersData);

  sortAlphabeticallyBtn.addEventListener("click", () =>
    sortAlphabetically(usersData)
  );
  backSortBtn.addEventListener("click", () => backSort(usersData));
  usersBlocks.addEventListener("click", (event) => {
    (event.target.classList.value === "peoples-title" ||
      event.target.classList.value === "img-medium") &&
      renderModal(usersData, event);
  });
};

const getUsers = async (url, usersData) => {
  const cors_Api = "https://cors-anywhere.herokuapp.com/";
  try {
    preLouderStart();
    let response = await fetch(cors_Api + url);
    if (response.ok) {
      let result = await response.json();
      preLouderStop();
      console.log(result);
      okReq(result, usersData);
    } else {
      preLouderStop();
      badReq(response);
    }
  } catch (e) {
    badReq(e);
  }
};

const preLouderStart = () => {
  const { louder } = commonVariables();
  louder.setAttribute("style", "display:flex");
};

const preLouderStop = () => {
  const { louder } = commonVariables();
  louder.setAttribute("style", "display:none");
};

const badReq = (response) => {
  if (response.ok === false) {
    console.log("response status", response.status);
  } else {
    console.log("ERROR HTTP: " + response);
  }
};

const okReq = (result, usersData) => {
  usersData.push(...result.results);
  renderUsers(usersData);
};

const renderUsers = (usersData) => {
  const { usersBlocks } = commonVariables();
  usersBlocks.innerHTML = "";
  usersData.forEach((user) => {
    usersBlocks.innerHTML += `
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

const renderModal = (usersData, event) => {
  const { modal } = commonVariables();
  const userCard = event.target.closest(".user");
  const currentUser = usersData.find(
    (user) => userCard.id == user.location.postcode // == потому что из за рандомного апи приходитя ID разных типов
  );

  modal.setAttribute("style", "display:block");

  modal.innerHTML = `
    <div class="modal-content">
      <img src="${currentUser.picture.large}" alt="Аватарка" class="img-large" />
      <span class="close">x</span>
      <p class="modal-title">Full name: ${currentUser.name.title} . ${currentUser.name.first} ${currentUser.name.last}</p>
      <p class="modal-street">street: ${currentUser.location.street}</p>
      <p class="modal-city">City: ${currentUser.location.city}</p>
      <p class="modal-state">State: ${currentUser.location.state}</p>
      <p class="modal-email">Mail: ${currentUser.email}</p>
      <p class="modal-telephone">${currentUser.phone}</p>
    </div>
    `;

  const closeButton = document.querySelector(".close"); // если разместить раньше то querySelector не находит ноду
  closeButton.addEventListener("click", closeModal);
};

const closeModal = () => {
  const { modal } = commonVariables();
  modal.innerHTML = "";
  modal.style.display = "none";
};

init();
