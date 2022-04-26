import { collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const database = getFirestore();

let users = [];

const tableUsers = document.querySelector("table#table-users tbody");

const modalUsersCreate = new bootstrap.Modal(document.querySelector('#modal-users-create'), {});
const formUsersCreate = document.querySelector("#modal-users-create #form-users-create");

const modalUsersUpdate = new bootstrap.Modal(document.querySelector("#modal-users-update"), {});
const formUsersUpdate = document.querySelector("#form-users-update");

function renderUsers() {

    tableUsers.innerHTML = '';

    users.forEach(async function(item) {

        const tableRow = document.createElement("tr");
    
        tableRow.innerHTML = `
            <td>
                <div class="d-flex px-2 py-1">
                    <div>
                        <img src="${item.photo ? "./assets/img/cameras/" + item.photo : "./assets/img/tesla-model-s.png"}" class="avatar avatar-sm me-3 border-radius-lg" alt="${item.name}">
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">${item.prdouct}</h6>
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
    
            if (confirm(`Deseja realmente excluir o usuário ${item.name}?`)) {

                await deleteDoc(doc(database, "models", item.id));

                tableRow.remove();

            }
    
        });
    
        tableUsers.appendChild(tableRow);
    
    });

}

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

formUsersCreate.addEventListener("submit", async (event) => {

    event.preventDefault();

    const formData = new FormData(formUsersCreate);

    if (!formData.get("product")) {
        console.error("O nome do produto é obrigatório.");
        return false;
    }

    if (!formData.get("categorie")) {
        console.error("A categoria é obrigatória.");
        return false;
    }

    if (!formData.get("year")) {
        console.error("O ano de lançamento é obrigatório");
        return false;
    }

    if (!formData.get("status")) {
        console.error("O status é obrigatório.");
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