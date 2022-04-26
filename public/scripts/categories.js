import { collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const database = getFirestore();

let categories = [];

const tableCategories = document.querySelector("table#table-categories tbody");

const modalCategoriesCreate = new bootstrap.Modal(document.querySelector('#modal-categories-create'), {});
const formCategoriesCreate = document.querySelector("#modal-categories-create #form-categories-create");

const modalCategoriesUpdate = new bootstrap.Modal(document.querySelector("#modal-categories-update"), {});
const formCategoriesUpdate = document.querySelector("#form-categories-update");

function renderCategories() {


    tableCategories.innerHTML = '';

    categories.forEach(async function (item) {

        const tableRow = document.createElement("tr");

        tableRow.innerHTML = `
            <td>
                <div class="d-flex px-2 py-1">
                    <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-sm">${item.idCategorie} ${item.name}</h6>
                    </div>
                </div>
            </td>
            <td>
                <p class="text-xs font-weight-bold mb-0">${item.storage}</p>
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

                const input = formCategoriesUpdate.querySelector(`[name=${prop}]`);

                if (input) {

                    if (input.type === "radio") {

                        formCategoriesUpdate.querySelector(`[name=${prop}][value="${item[prop]}"]`).click();

                    } else {
                        input.value = item[prop];
                    }

                }

            }

            modalCategoriesUpdate.show();

        });

        tableRow.querySelector(".button-delete").addEventListener("click", async (event) => {

            event.preventDefault();

            if (confirm(`Deseja realmente excluir o usuário ${item.name}?`)) {

                await deleteDoc(doc(database, "models", item.id));

                tableRow.remove();

            }

        });

        tableCategories.appendChild(tableRow);

    });

}

onSnapshot(collection(database, "categories"), (data) => {

    categories = [];

    data.forEach(document => {
        console.log(document.data);

        const object = {
            ...document.data(),
            id: document.id,
        };
        categories.push(object);
    });

    renderCategories();

});

formCategoriesCreate.addEventListener("submit", async (event) => {

    event.preventDefault();

    const formData = new FormData(formCategoriesCreate);

    if (!formData.get("idCategorie")) {
        console.error("O id da categoria é obrigatório.");
        return false;
    }

    if (!formData.get("name")) {
        console.error("O nome da categoria é obrigatória.");
        return false;
    }

    if (!formData.get("storage")) {
        console.error("A quantidade em estoque é obrigatória");
        return false;
    }

    await setDoc(doc(database, "categories", uuidv4()), {
        id: formData.get("idCategorie"),
        name: formData.get("name"),
        storage: formData.get("storage")
    });

    modalCategoriesCreate.hide();

});

formCategoriesUpdate.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(formCategoriesUpdate);

    await updateDoc(doc(database, "categories", formData.get("id")), {
        id: formData.get("idCategorie"),
        name: formData.get("name"),
        storage: formData.get("storage")
    });

    modalCategoriesUpdate.hide();

});