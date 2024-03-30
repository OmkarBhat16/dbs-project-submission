async function fetchData() {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
    }
    let response;
    try {
        response = await fetch("http://localhost:8080/projects/all", {
            method: "GET",
            headers: headersList
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }

    let data = JSON.parse(await response.text());

    return data;
}

async function getData(response) {
    if(response == undefined){
        response = await fetchData();
        console.log("from fetchData",response);
    }

    console.log("from search",response);

    for (let i in response) {
        let project = response[i];
        // console.log(project);
        let projectCard = document.createElement("div");
        projectCard.className = "project-card";
        // projectCard,classList.add("modal-dialog modal-dialog-centered modal-dialog-scrollable");
        let projectName = document.createElement("h3");
        // console.log(project.title);
        projectName.innerHTML = project.title;
        projectName.classList = "project-title";
        let line = document.createElement("hr");

        let projectDescription = document.createElement("p");
        projectDescription.innerHTML = project.description;
        projectDescription.classList = "project-description";
        let projectTags = document.createElement("p");
        projectTags.classList = "project-tags";
        projectTags.innerHTML = project.tags;
        projectCard.appendChild(projectName);
        projectCard.appendChild(line);
        projectCard.appendChild(projectDescription);
        projectCard.appendChild(projectTags);
        document.getElementById("search-results").appendChild(projectCard);
    }
    console.log("Display Complete");
};
getData();

function search() {
    const search_results = [];
    let input = document.getElementById("searchbar").value;
    console.log(input);
    if (input != "") {
        input = input.toLowerCase();
        let x = Array.from(document.querySelectorAll(".project-card"));
        console.log("x",typeof x, x);
        for (let i = 0; i < x.length; i++) {
            let title = x[i].querySelectorAll(".project-title");
            title = title[0].innerHTML.toLowerCase();
            let description = x[i].querySelectorAll(".project-description");
            description = description[0].innerHTML.toLowerCase();
            if (title.includes(input) || description.includes(input)) {
                search_results.push(x[i]);
                console.log(x[i]);
                x[i].classList.remove("hide");
            }
            else {
                x[i].classList.add("hide");}
        }
        console.log(search_results);
    } else {
        let x = Array.from(document.querySelectorAll(".project-card"));
        for(let i = 0; i < x.length; i++){
            x[i].classList.remove("hide");
        }
    }
}

