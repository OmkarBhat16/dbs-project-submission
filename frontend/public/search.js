async function fetchProjects() {
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
    } catch(error) {
        console.error("Error fetching data:", error);
        return;
    }

    let data = JSON.parse(await response.text());
    console.log(data);
    if (data.error == "invalid token format" || data.error == "invalid token") {
        alert("Session Expired. Please login again.");
        window.location.href = "./login.html";
    }
    return data;
}
var globalResponse;
async function fetchData() {
    globalResponse = await fetchProjects();
}

fetchData();

async function displayData(response) {
    if (response == undefined) {
        response = await fetchProjects();
    }

    for (let i in response) {
        i = response.length - i - 1;
        let project = response[i];

        let projectButton = document.createElement("button");
        projectButton.classList.add("project-button");
        projectButton.setAttribute("data-bs-toggle", "modal");
        projectButton.setAttribute("data-bs-target", "#myModal");
        projectButton.setAttribute("type", "button")

        let projectCard = document.createElement("div");
        projectCard.className = "project-card";

        let headerDiv = document.createElement("div");
        headerDiv.className = "header-div";
        let projectName = document.createElement("h3");
        projectName.innerHTML = project.title;
        projectName.classList = "project-title";
        headerDiv.appendChild(projectName);

        let projectId = document.createElement("p");
        projectId.innerHTML = project.project_id;
        projectId.classList = "project-id";
        projectId.style.display = "none";

        let line = document.createElement("hr");

        let dataDiv = document.createElement("div");
        let projectDescription = document.createElement("p");
        projectDescription.innerHTML = project.description;
        projectDescription.classList = "project-description";

        let projectTags = document.createElement("p");
        projectTags.classList = "project-tags";
        projectTags.innerHTML = project.tags;

        projectButton.appendChild(projectCard);
        projectCard.appendChild(headerDiv);
        headerDiv.appendChild(projectId);
        dataDiv.appendChild(line);
        dataDiv.appendChild(projectDescription);
        dataDiv.appendChild(projectTags);
        projectCard.appendChild(dataDiv);
        document.getElementById("search-results").appendChild(projectButton);

        let noResults = document.createElement("h3");
        noResults.innerHTML = "No results found";
        noResults.classList.add("hide");
        noResults.setAttribute("id", "no-results");
        document.getElementById("search-results").appendChild(noResults);
    }
};
displayData();

function search() {
    const search_results = [];
    let input = document.getElementById("searchbar").value;
    console.log(input);
    if (input != "") {
        input = input.toLowerCase();
        let x = Array.from(document.querySelectorAll(".project-button"));
        for (let i = x.length - 1; i >= 0; i--) {
            let title = x[i].querySelectorAll(".project-title");
            title = title[0].innerHTML.toLowerCase();
            let description = x[i].querySelectorAll(".project-description");
            description = description[0].innerHTML.toLowerCase();
            if (title.includes(input) || description.includes(input)) {
                search_results.push(x[i]);
            } else {
                x[i].classList.add("hide");
            }
        }
        if (search_results.length == 0) {
            document.getElementById("no-results").classList.remove("hide");
        } else {
            for (let i in search_results) {
                search_results[i].classList.remove("hide");
            }
            document.getElementById("no-results").classList.add("hide");

        }
    } else {
        document.getElementById("no-results").classList.add("hide");
        let x = Array.from(document.querySelectorAll(".project-button"));
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("hide");
        }
    }
}

var modalInformation;
function buttonClicked(details) {
    var matchingProject;
    for (let i in globalResponse) {
        if (globalResponse[i].project_id == details) {
            matchingProject = globalResponse[i];
            break;
        }
    }

    modalInformation = JSON.stringify(matchingProject);
    console.log(modalInformation);
    document.getElementById("modal-title").innerHTML = matchingProject.title;
    document.getElementById("modal-id").innerHTML = matchingProject.project_id;
    document.getElementById("modal-description").innerHTML = matchingProject.description;
    document.getElementById("project-Status").innerHTML = "Status : " + matchingProject.status;

}

document.addEventListener('DOMContentLoaded',function() {
    document.body.addEventListener('click',
    function(event) {
        let targetElement = event.target;
        do {
            if (targetElement.classList.contains('project-button')) {
                var details = targetElement.querySelector('.project-id').innerHTML;
                buttonClicked(details);
                return;
            }
            targetElement = targetElement.parentNode;
        } while ( targetElement !== document . body );
    });
});

document.getElementById('searchbar').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        search();
    }
});

async function applyProject() {
    console.log(modalInformation);
    let projectId = JSON.parse(modalInformation).project_id;
    let message = document.getElementById("message").value;
    if (message == "" || message == null) {
        alert("Message cannot be empty");
        return;
    }
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
    }

    // Prepare the body content
    let bodyContent = JSON.stringify({
        "project_id": projectId,
        "message": message,
    });

    try {
            let response = await fetch("http://localhost:8080/application/apply", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        return data;

    } catch(error) {
        console.error("Error during fetch:", error);
    }
}

async function apply() {
    targetElement = document.getElementById("apply-button");
    closebutton = document.getElementById("close-btn");
    let response = await applyProject();
    console.log("testing");
    console.log(response)
    if (response.message == 'application created successfully') {
        targetElement.innerHTML = "Applied";
        targetElement.disabled = true;
        closebutton.click();
        alert("Application successful");
    } else if (response.error == "invalid token format" || response.error == "invalid token") {
        alert("Session Expired. Please login again.");
        window.location.href = "./login.html";
    }
}