let passwords =
    JSON.parse(
        localStorage.getItem("passwords")
    ) || [];

let masterPassword =
    localStorage.getItem("masterPassword");

if (!masterPassword) {

    masterPassword =
        prompt("Create Master Password");

    localStorage.setItem(
        "masterPassword",
        masterPassword
    );
}

if (
    localStorage.getItem("theme") ===
    "light"
) {
    document.body.classList.add("light");
}

function unlockVault() {

    const pass =
        document.getElementById(
            "masterpassword"
        ).value;

    if (pass === masterPassword) {

        document.getElementById(
            "login"
        ).style.display = "none";

        document.getElementById(
            "vault"
        ).style.display = "block";

        renderPasswords();

    } else {

        alert("Wrong Password");
    }
}

function renderPasswords() {

    const list =
        document.getElementById(
            "passwordList"
        );

    const search =
        document.getElementById(
            "search"
        )?.value.toLowerCase() || "";

    list.innerHTML = "";

    passwords.forEach((item,index)=>{

        if(
            item.website
            .toLowerCase()
            .includes(search)

            ||

            item.username
            .toLowerCase()
            .includes(search)
        ){

            list.innerHTML += `
                <div class="password-card">

                    <h3>
                        ${item.website}
                    </h3>

                    <p>
                        User:
                        ${item.username}
                    </p>

                    <p id="pass-${index}">
                        ••••••••
                    </p>

                    <div class="btn-group">

                        <button
                        onclick="togglePassword(${index})">
                            Show
                        </button>

                        <button
                        onclick="copyPassword('${item.password}')">
                            Copy
                        </button>

                        <button
                        onclick="editPassword(${index})">
                            Edit
                        </button>

                        <button
                        class="danger"
                        onclick="deletePassword(${index})">
                            Delete
                        </button>

                    </div>

                </div>
            `;
        }
    });
}

function addPassword(){

    const website =
        document.getElementById(
            "website"
        ).value;

    const username =
        document.getElementById(
            "username"
        ).value;

    const password =
        document.getElementById(
            "password"
        ).value;

    if(
        !website ||
        !username ||
        !password
    ){
        alert("Fill all fields");
        return;
    }

    passwords.push({
        website,
        username,
        password
    });

    saveVault();

    renderPasswords();

    document.getElementById(
        "website"
    ).value = "";

    document.getElementById(
        "username"
    ).value = "";

    document.getElementById(
        "password"
    ).value = "";
}

function deletePassword(index){

    passwords.splice(index,1);

    saveVault();

    renderPasswords();
}

function editPassword(index){

    document.getElementById(
        "website"
    ).value =
        passwords[index].website;

    document.getElementById(
        "username"
    ).value =
        passwords[index].username;

    document.getElementById(
        "password"
    ).value =
        passwords[index].password;

    passwords.splice(index,1);

    saveVault();

    renderPasswords();
}

function togglePassword(index){

    const pass =
        document.getElementById(
            `pass-${index}`
        );

    if(
        pass.innerText ===
        "••••••••"
    ){

        pass.innerText =
            passwords[index].password;

    }else{

        pass.innerText =
            "••••••••";
    }
}

function copyPassword(password){

    navigator.clipboard
    .writeText(password);

    alert("Copied!");
}

function generatePassword(){

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    let password = "";

    for(
        let i=0;
        i<16;
        i++
    ){

        password +=
            chars[
                Math.floor(
                    Math.random()
                    * chars.length
                )
            ];
    }

    document.getElementById(
        "password"
    ).value = password;
}

function toggleTheme(){

    document.body
    .classList
    .toggle("light");

    localStorage.setItem(
        "theme",
        document.body
        .classList
        .contains("light")
            ? "light"
            : "dark"
    );
}

function exportVault(){

    const data =
        JSON.stringify(
            passwords,
            null,
            2
        );

    const blob =
        new Blob(
            [data],
            {
                type:
                "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;
    a.download =
        "compvault.json";

    a.click();
}

function importVault(event){

    const file =
        event.target.files[0];

    if(!file) return;

    const reader =
        new FileReader();

    reader.onload =
        function(e){

            passwords =
                JSON.parse(
                    e.target.result
                );

            saveVault();

            renderPasswords();
        };

    reader.readAsText(file);
}

function saveVault(){

    localStorage.setItem(
        "passwords",
        JSON.stringify(passwords)
    );
}