import { collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const database = getFirestore();

let users = [];

const tableUsers = document.querySelector("table#table-users tbody");

let modalUsersCreate = null;
const modalUsersCreateElement = document.querySelector('#modal-users-create');

if (modalUsersCreateElement) {
    modalUsersCreate = new bootstrap.Modal(modalUsersCreateElement, {});
}

const formUsersCreate = document.querySelector("#modal-users-create #form-users-create");

let modalUsersUpdate = null;
const modalUsersUpdateElement = document.querySelector("#modal-users-update");

if (modalUsersUpdateElement) {
    modalUsersUpdate = new bootstrap.Modal(modalUsersUpdateElement, {});
}
const formUsersUpdate = document.querySelector("#form-users-update");

function renderUsers() {

    tableUsers.innerHTML = '';

    users.forEach(async function (item) {

        const tableRow = document.createElement("tr");

        tableRow.innerHTML = `
            <td>
                <div class="d-flex px-2 py-1">
                    <div>
                        <img src="${item.photo ? "./assets/img/cameras/" + item.photo : "./assets/img/tesla-model-s.png"}" class="avatar avatar-sm me-3 border-radius-lg" alt="${item.name}">
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">${item.product}</h6>
                    </div>
                </div>
            </td>
            <td>
                <p class="text-xs font-weight-bold mb-0">${item.categorie}</p>
            </td>
            <td class="align-middle text-center text-sm">
                <span class="badge badge-sm ${(item.status === "1") ? "bg-gradient-success" : "bg-gradient-secondary"}">${item.status === "1" ? "Em estoque" : "Esgotado"}</span>
            </td>
            <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">${item.year}</span>
            </td>
            <td class="flex-td">
                <a class="nav-link text-secondary button-edit" href="#" title="Editar">
                    <div class="text-center me-2 d-flex align-items-center justify-content-center">
                        <i class="material-icons opacity-10">edit</i>
                    </div>
                </a>
                <a class="nav-link button-delete" href="#" title="Excluir">
                    <div class="text-center me-2 d-flex align-items-center justify-content-center">
                        <i class="material-icons opacity-10">delete</i>
                    </div>
                </a>
            </td>
        `;

        tableRow.querySelector(".button-edit").addEventListener("click", (e) => {

            e.preventDefault();

            for (let prop in item) {

                const input = formUsersUpdate.querySelector(`[name=${prop}]`);

                if (input) {

                    if (input.type === "radio") {

                        formUsersUpdate.querySelector(`[name=${prop}][value="${item[prop]}"]`).click();

                    } else {
                        input.value = item[prop];
                    }

                }

            }

            modalUsersUpdate.show();

        });

        tableRow.querySelector(".button-delete").addEventListener("click", async (event) => {

            event.preventDefault();

            if (confirm(`Deseja realmente excluir o produto ${item.product}?`)) {

                await deleteDoc(doc(database, "models", item.id));

                tableRow.remove();

            }

        });

        tableUsers.appendChild(tableRow);

    });

}

if (tableUsers) {
    onSnapshot(collection(database, "models"), (data) => {

        users = [];

        data.forEach(document => {
            const object = {
                ...document.data(),
                id: document.id,
            };
            users.push(object);
        });

        renderUsers();

    });

}

if (formUsersCreate) {
    formUsersCreate.addEventListener("submit", async (event) => {

        event.preventDefault();

        const formData = new FormData(formUsersCreate);

        if (!formData.get("product")) {
            console.error("O nome do produto ?? obrigat??rio.");
            return false;
        }

        if (!formData.get("categorie")) {
            console.error("A categoria ?? obrigat??ria.");
            return false;
        }

        if (!formData.get("year")) {
            console.error("O ano de lan??amento ?? obrigat??rio");
            return false;
        }

        if (!formData.get("status")) {
            console.error("O status ?? obrigat??rio.");
            return false;
        }

        await setDoc(doc(database, "models", uuidv4()), {
            product: formData.get("product"),
            categorie: formData.get("categorie"),
            year: formData.get("year"),
            status: formData.get("status"),
            photo: formData.get("photo")
        });

        modalUsersCreate.hide();

    });
}

if(formUsersUpdate){
    formUsersUpdate.addEventListener("submit", async (e) => {
    
        e.preventDefault();
    
        const formData = new FormData(formUsersUpdate);
    
        await updateDoc(doc(database, "models", formData.get("id")), {
            product: formData.get("product"),
            categorie: formData.get("categorie"),
            year: formData.get("year"),
            status: formData.get("status"),
            photo: formData.get("photo")
        });
    
        modalUsersUpdate.hide();
    
    });
}