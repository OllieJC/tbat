var language_labels = {
  "en-GB": {
    "tbat": "tbat",
    "fullprojectname": "Threat Box Assessment Tool",
    "project": "Project",
    "projectdetails": "Project Details",
    "projectname": "Project Name",
    "threatbox": "Threat Box",
    "visualisation": "Visualisation",
    "threatactors": "Threat Actors",
    "threatactorlibrary": "Threat Actor Library",
    "settings": "Settings",
    "notes": "Notes",
    "open": "Open",
    "openyaml": "Open YAML",
    "export": "Export",
    "exportyaml": "Export YAML",
    "noexport": "No actors to export",
    "save": "Save",
    "saved": "Saved",
    "welcomemessage": "Welcome to tbat (threat box assessment tool) - a tool for analysing different threat actors.\n\
    Use the menu options to start a new assessment, or use the open function below to view and edit a previous one.\n\n\
    Project details aren't necessary but add context in the exported options.",
    "nofile": "No file selected",
    "toomanyfiles": "Select only one file",
    "resetyaml": "Cancel",
    "graph_intent": "Intent",
    "graph_capabaility": "Capability",
  },
  "en-US": {
    "tbat": "tbat",
    "fullprojectname": "Threat Box Assessment Tool",
    "project": "Project",
    "projectdetails": "Project Details",
    "projectname": "Project Name",
    "threatbox": "Threat Box",
    "visualisation": "Visualization",
    "threatactors": "Threat Actors",
    "threatactorlibrary": "Threat Actor Library",
    "settings": "Settings",
    "notes": "Notes",
    "open": "Open",
    "openyaml": "Open YAML",
    "export": "Export",
    "exportyaml": "Export YAML",
    "noexport": "No actors to export",
    "save": "Save",
    "saved": "Saved",
    "welcomemessage": "Welcome to tbat (threat box assessment tool) - a tool for analyzing different threat actors.\n\
    Use the menu options to start a new assessment, or use the open function below to view and edit a previous one.\n\n\
    Project details aren't necessary but add context in the exported options.",
    "nofile": "No file selected",
    "toomanyfiles": "Select only one file",
    "resetyaml": "Cancel",
    "graph_intent": "Intent",
    "graph_capabaility": "Capability",
  },
};

var tbat = {
  "version": 0.1,
  "name": "",
  "notes": "",
  "actors": [],
};

(function () {
  load_labels();
  load_window();
  plot_actors();
  project_details_need_saving();
})()

function project_details_need_saving() {
  var should_save = false;

  const orgname = document.getElementById("inputName").value;
  if (orgname.length > 0) {
    if (tbat.name != orgname) {
      should_save = true;
    }
  }

  const notes = document.getElementById("inputNotes").value;
  if (notes.length > 0) {
    if (tbat.notes != notes) {
      should_save = true;
    }
  }

  const bpds = document.getElementById("btnProjectDetailsSave");
  if (should_save) {
    bpds.classList.remove("disabled");
    bpds.classList.add("btn-primary");
    bpds.classList.remove("btn-secondary");
    bpds.removeAttribute("aria-disabled");
  } else {
    bpds.classList.add("disabled");
    bpds.classList.remove("btn-primary");
    bpds.classList.add("btn-secondary");
    bpds.setAttribute("aria-disabled", "true");
  }
}

function save_project_details() {
  tbat.name = document.getElementById("inputName").value;
  tbat.notes = document.getElementById("inputNotes").value;

  document.getElementById("btnProjectDetailsSave").innerText = load_label("saved");
  project_details_need_saving();

  window.setTimeout(function() {
    document.getElementById("btnProjectDetailsSave").innerText = load_label("save");
  }, 1500);
}

function load_language() {
  var lang = "en-US";

  //if (setting has value, load from setting) {
  //
  //}

  if ("language" in navigator && navigator.language) {
    if (typeof(language_labels[navigator.language]) !== "undefined") {
      lang = navigator.language;
    }
  }

  return lang;
}

function open_yaml(sender) {
  const inputYaml = document.getElementById("inputYaml");

  if (inputYaml.files.length == 0) {
    alert(load_label("nofile"));
  } else if (inputYaml.files.length > 1) {
    alert(load_label("toomanyfiles"));
  } else {
    sender.classList.add("disabled");
    sender.classList.remove("btn-primary");
    sender.classList.add("btn-secondary");
    sender.setAttribute("aria-disabled", "true");

    window.setTimeout(function() {
      const reader = new FileReader();
      reader.onload = loaded_yaml;
      reader.readAsText(inputYaml.files[0]);
      inputYaml.value = "";
    }, 500);
  }
}

function loaded_yaml(event) {
  const loaded_file = jsyaml.load(event.target.result);

  if (typeof(loaded_file.tbat) !== "undefined") {
    if (typeof(loaded_file.tbat.version) !== "undefined") {
      if (loaded_file.tbat.version == "0.1") {
        tbat.name = loaded_file.tbat.name;
        tbat.notes = loaded_file.tbat.notes;
      }
    }
  }

  render_tbat();

  const btnOpen = document.getElementById("btnOpen");
  btnOpen.classList.remove("disabled");
  btnOpen.classList.add("btn-primary");
  btnOpen.classList.remove("btn-secondary");
  btnOpen.removeAttribute("aria-disabled");
}

function render_tbat() {
  document.getElementById("inputName").value = tbat.name;
  document.getElementById("inputNotes").value = tbat.notes;
}

function export_yaml() {
  if (tbat.actors.length == 0) {
    alert(load_label("noexport"));
  } else {
    let type = "text/x-yaml", filename = "tbat.yaml";
    let blob = new Blob([jsyaml.dump({"tbat": tbat})], {type});
    let url = window.URL.createObjectURL(blob);

    let link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();

    window.URL.revokeObjectURL(url);
  }
}

function load_label(label) {
  const lang = load_language();
  return language_labels[lang][label];
}

function load_labels() {
  const lang = load_language();

  const keys = Object.keys(language_labels[lang]);

  for (var i = 0; i < keys.length; i++) {
    document.querySelectorAll("[class='label-" + keys[i] + "']").forEach(function(t) {
      t.innerText = language_labels[lang][keys[i]];
    });
  }
}

function url_hash() {
  var res = "threatbox";

  if ("hash" in location) {
    if (window.location.hash.indexOf('#') > -1) {
      res = window.location.hash.split("#")[1];
    }
  } else if (window.location.href.indexOf('#') > -1) {
    res = window.location.href.split("#")[1];
  }

  if (res.indexOf('?') > -1) {
    res = res.split("?")[0];
  }
  return res;
}

function load_window(s) {

  console.log(s);

  var uh = "threatbox";
  if (typeof(s) !== "undefined") {
    uh = s.href.split("#")[1];
  } else {
    uh = url_hash();
  }

  console.log(uh);

  document.querySelectorAll("[id*='window-']").forEach(function(t) {
    if (t.id.indexOf(uh) > -1) {
      t.classList.remove("window-hidden");
      t.classList.add("window-active");
    } else {
      t.classList.add("window-hidden");
      t.classList.remove("window-active");
    }
  });

  var nav_menus = document.getElementsByClassName("nav");
  for (var i = 0; i < nav_menus.length; i++) {
    document.querySelectorAll("[class*='nav-link']").forEach(function(t) {
      t.classList.remove("active");
    });
    nav_menus[i].querySelector("[href*='" + uh + "']").classList.add("active");
  }
}

function plot_actors() {

  for (var i = 0; i < document.getElementsByClassName("grid-square").length; i++) {
    document.getElementsByClassName("grid-square")[i].innerHTML = "";
  }

  const rows = document.getElementById("threat-actors-table").getElementsByTagName("tr");
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];

    console.log(r);

    if (r.querySelector("[scope='row']")) {
      const form_intent = r.getElementsByClassName("form-intent")[0].value;
      const form_willingness = r.getElementsByClassName("form-willingness")[0].value;
      const form_capability = r.getElementsByClassName("form-capability")[0].value;
      const form_novelty = r.getElementsByClassName("form-novelty")[0].value;

      const overall_intent = parseInt(form_intent) + parseInt(form_willingness);
      const overall_capability = parseInt(form_capability) + parseInt(form_novelty);

      var intent_string = "";
      var capability_string = "";

      switch(overall_intent) {
        case 5:
          intent_string = "five";
          break;
        case 4:
          intent_string = "four";
          break;
        case 3:
          intent_string = "three";
          break;
        case 2:
          intent_string = "two";
          break;
        case 1:
          intent_string = "one";
          break;
        default:
          intent_string = "one";
      }

      switch(overall_capability) {
        case 5:
          capability_string = "five";
          break;
        case 4:
          capability_string = "four";
          break;
        case 3:
          capability_string = "three";
          break;
        case 2:
          capability_string = "two";
          break;
        case 1:
          capability_string = "one";
          break;
        default:
          capability_string = "one";
      }

      if (intent_string !== "zero" && capability_string !== "zero") {
        const actor_class = capability_string + "-" + intent_string;

        var new_actor = document.createElement("p");
        new_actor.innerText = r.getElementsByTagName("td")[0].innerText;

        document.getElementsByClassName(actor_class)[0].appendChild(new_actor);
      }
    }
  }
}
