import { collection, getFirestore, onSnapshot } from "firebase/firestore";

const database = getFirestore();

let menus = [];

const asideMenu = document.createElement("aside");

asideMenu.className = "sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-dark";

asideMenu.id = "sidenav-main";

asideMenu.innerHTML = `
  <div class="sidenav-header">
    <i class="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
    <a class="navbar-brand m-0" href=" https://demos.creative-tim.com/material-dashboard/pages/dashboard " target="_blank">
      <img src="./assets/img/hero-camera.png" class="navbar-brand-img h-100" alt="Dashboard Empreeduca" style="background-color: #fff; border-radius: 6px;">
      <span class="ms-1 font-weight-bold text-white">TekPix - Administração</span>
    </a>
  </div>
  <hr class="horizontal light mt-0 mb-2">
`;

const divMenu = document.createElement("div");

divMenu.classList.add("collapse");
divMenu.classList.add("navbar-collapse");
divMenu.classList.add("w-auto");

divMenu.id = "sidenav-collapse-main";

const ulMenu = document.createElement("ul");

ulMenu.className = "navbar-nav";

asideMenu.appendChild(divMenu);

document.body.insertBefore(asideMenu, document.querySelector("#main"));

function renderMenu() {

  ulMenu.innerHTML = '';

  menus.forEach(menu => {

    const liMenu = document.createElement("li");

    const menuHref = menu.href.split("/").pop();
    const url = location.pathname.split("/").pop();

    const classActive = (menuHref === url) ? 'active bg-gradient-primary' : '';

    liMenu.className = "nav-item";

    liMenu.innerHTML = `        
      <a class="nav-link text-white ${classActive}" href="${menu.href}">
        <div class="text-white text-center me-2 d-flex align-items-center justify-content-center">
          <i class="material-icons opacity-10">${menu.icon}</i>
        </div>
        <span class="nav-link-text ms-1">${menu.name}</span>
      </a>
    `;

    ulMenu.appendChild(liMenu);

  });

  divMenu.appendChild(ulMenu);

}

onSnapshot(collection(database, "menus"), (data) => {
  menus = [];
  data.forEach(document => {
    menus.push(document.data());
  });

  renderMenu();

});