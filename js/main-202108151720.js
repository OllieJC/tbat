const language_labels = {
  "default": {
    "tbat": "tbat",
    "fullprojectname": "Threat Box Assessment Tool",
    "project": "Project",
    "projectdetails": "Project Details",
    "projectname": "Project Name",
    "threatbox": "Threat Box",
    "report": "Report",
    "threatactors": "Threat Actors",
    "threatactorlibrary": "Threat Actor Library",
    "settings": "Settings",
    "notes": "Notes",
    "open": "Open",
    "openyaml": "Open YAML",
    "export": "Export",
    "exportyaml": "Export YAML",
    "noexport": "No actors to export",
    "loaded_yaml": "Successfully loaded YAML",
    "reset": "Reset",
    "resetcomplete": "Successfully reset",
    "save": "Save",
    "saved": "Saved",
    "welcomemessage": "Welcome to tbat (threat box assessment tool) - a tool for analysing different threat actors.\n\
    Use the menu options to start a new assessment, or use the open function below to view and edit a previous one.\n\n\
    Project details aren't necessary but add context in the exported options.",
    "nofile": "No file selected",
    "toomanyfiles": "Select only one file",
    "actor-groupid": "Group Identifier",
    "intent": "Intent",
    "capability": "Capability",
    "willingness": "Willingness",
    "novelty": "Novelty",
    "intentions": "Intentions",
    "select_intentions": "Select Intentions",
    "select_intent": "Select Intent",
    "select_capability": "Select Capability",
    "select_willingness": "Select Willingness",
    "select_novelty": "Select Novelty",
    "aka": "Also known as:",
    "import_actor": "Import into assessment",
    "new_actor": "New Actor",
    "edit_actor": "Edit Actor",
    "delete_actor": "Delete Actor",
    "deleted_actor_success": "Successfully deleted",
    "view_actor_details": "View actor details",
    "okay": "Okay",
    "close": "Close",
    "last_created": "Last created",
    "last_modified": "Last modified",
    "ttps": "Tactics, techniques and procedures",
    "kill_chain_phase": "Kill chain phase",
    "defense-evasion": "defence evasion",
    "mitigations": "Mitigations",
    "espionage": "Espionage",
    "destructive": "Destructive",
    "disruptive": "Disruptive",
    "cyber-crime": "Cyber-crime",
    "score": "Score",
    "intent-1": "1: Target of Opportunity: $ACTOR targets $ORG simply as a target of opportunity",
    "intent-2": "2: Regional Association: $ACTOR targets $ORG based on its regional area of operations (e.g., North America, Middle East, etc.)",
    "intent-3": "3: Sector Association: $ACTOR targets $ORG based on its association with a specific business sector (e.g., finance, energy, government)",
    "intent-4": "4: Ideology Association: $ACTOR targets $ORG based on its association with a specific ideology (e.g., USG, war, etc.)",
    "intent-5": "5: Target-Specific Data: $ACTOR targets $ORG based on an objective that can only be achieved within $ORG’s network",
    "capability-1": "1: Not Capable: No evidence of operational capability; feasibility unconfirmed",
    "capability-2": "2: Possible Capability: Very limited evidence of operational capability; feasibility confirmed",
    "capability-3": "3: Limited Capability: Some evidence of operational capability; limited sources",
    "capability-4": "4: Credible Capability: Credible evidence of operational capability; moderately confirmed",
    "capability-5": "5: Significant Capability: Significant evidence that $ACTOR previously conducted this type of activity; multiple trusted sources confirmed",
    "willingness-0": "0: Strained diplomatic relations/previous hostilities/significant economic disruption perceived by $ACTOR from $ORG’s operations",
    "willingness-min1": "-1: Moderate relations with the country and moderate economic dependencies between $ACTOR interests and $ORG’s operations",
    "willingness-min2": "-2: Strong diplomatic, economic, and security ties with the country",
    "novelty-0": "0: Custom toolset per campaign with demonstrated living off the land capability",
    "novelty-min1": "-1: Limited availability/high-cost toolset used in multiple campaigns",
    "novelty-min2": "-2: Toolset generally available",
    "githubrepo": "tbat Repository",
  },
  "en-US": {
    "welcomemessage": "Welcome to tbat (threat box assessment tool) - a tool for analyzing different threat actors.\n\
    Use the menu options to start a new assessment, or use the open function below to view and edit a previous one.\n\n\
    Project details aren't necessary but add context in the exported options.",
    "ttps": "Tactics, techniques, and procedures",
  },
};

var cti = {};

var tbat = {};

function loadTbat() {
  tbat = {
    "version": 0.1,
    "name": "",
    "notes": "",
    "actors": {},
  };
}

var actorLibaryModal = new bootstrap.Modal(document.getElementById("mainModal"));
var actorModal = new bootstrap.Modal(document.getElementById("actorModal"));
var notificationToast = new bootstrap.Toast(document.getElementById("notificationToast"));

/*var ttpMsnry = new Masonry( '#ttpList', {});
var mitigationMsnry = new Masonry( '#mitigationList', {});*/

(function () {
  loadTbat();
  load_labels();
  load_window();
  project_details_need_saving();
  fetch_cti();
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

function reset() {
  document.getElementById("inputName").value = "";
  document.getElementById("inputNotes").value = "";
  project_details_need_saving();
  loadTbat();
  render_actors();
  plot_actors();
  notification(load_label("reset"), load_label("resetcomplete"));
}

function load_language() {
  var lang = "default";

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

function click_open_yaml() {
  document.getElementById("inputYaml").click();
}

function open_yaml() {
  const inputYaml = document.getElementById("inputYaml");
  const openBtn = document.getElementById("btnOpen");

  if (inputYaml.files.length == 0) {
    notification(load_label("openyaml"), load_label("nofile"));
  } else if (inputYaml.files.length > 1) {
    notification(load_label("openyaml"), load_label("toomanyfiles"));
  } else {
    openBtn.classList.add("disabled");
    openBtn.classList.remove("btn-primary");
    openBtn.classList.add("btn-secondary");
    openBtn.setAttribute("aria-disabled", "true");

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

  var isLoaded = false;

  if (typeof(loaded_file.tbat) !== "undefined") {
    if (typeof(loaded_file.tbat.version) !== "undefined") {
      if (loaded_file.tbat.version == "0.1") {
        tbat.name = loaded_file.tbat.name;
        tbat.notes = loaded_file.tbat.notes;
        tbat.actors = loaded_file.tbat.actors;

        isLoaded = true;
      }
    }
  }

  if (isLoaded) {
    window.setTimeout(render_tbat, 100);
  }

  const btnOpen = document.getElementById("btnOpen");
  btnOpen.classList.remove("disabled");
  btnOpen.classList.add("btn-primary");
  btnOpen.classList.remove("btn-secondary");
  btnOpen.removeAttribute("aria-disabled");
}

function render_tbat() {
  document.getElementById("inputName").value = tbat.name;
  document.getElementById("inputNotes").value = tbat.notes;

  render_actors();
  plot_actors();

  notification(load_label("openyaml"), load_label("loaded_yaml"));
}

function notification(header, text) {
  document.getElementById("notificationHeader").innerText = header;
  document.getElementById("notificationText").innerText = text;
  notificationToast.show();
}

function export_yaml() {
  if (tbat.actors.length == 0) {
    notification(load_label("export"), load_label("noexport"));
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
  if (typeof(language_labels[lang][label]) != "undefined") {
    return language_labels[lang][label];
  }
  return language_labels["default"][label];
}

function load_labels() {
  const keys = Object.keys(language_labels["default"]);

  for (var i = 0; i < keys.length; i++) {
    document.querySelectorAll("[class='label-" + keys[i] + "']").forEach(function(t) {
      t.innerText = load_label(keys[i]);
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

function fetch_cti() {
  fns = ["groups", "mitigations", "ttps"];
  for (var i = 0; i < fns.length; i++) {
    const fn = fns[i];
    fetch(`cti/${fn}.json`)
      .then(response => response.json())
      .then(function(data) {
        if (fn == "ttps") {
          window.setTimeout(load_ttps, 100);
        }
        if (fn == "groups") {
          window.setTimeout(load_threat_groups, 100);
        }
        cti[fn] = data;
      }, fn);
  }
}


function chkExtId(external_id) {
  const n = external_id.toLowerCase().replace(/[^a-z0-9]/gi,'');
  return `chk_${n}`;
}


function load_ttps() {
  document.getElementsByClassName("accordion-body")[0].remove();

  const accBody = document.createElement("div");
  accBody.setAttribute("class", "accordion-body");
  document.getElementById("accTTPList").appendChild(accBody);

  const ttps = Object.keys(cti.ttps);
  for (var i = 0; i < ttps.length; i++) {
    const ttp = ttps[i];
    const t = cti.ttps[ttp];

    const newCheck = document.createElement("div");
    newCheck.setAttribute("class", "form-check");
    newCheck.title = t.name;

    const chkInput = document.createElement("input");
    chkInput.setAttribute("class", "form-check-input ttp-checkboxes");
    chkInput.setAttribute("type", "checkbox");
    chkInput.setAttribute("value", t.external_id);
    const eidVal = chkExtId(t.external_id);
    chkInput.id = eidVal;

    const chkLabel = document.createElement("label");
    chkLabel.setAttribute("class", "form-check-label");
    chkLabel.innerText = `${t.external_id}: ${t.name}`;
    chkLabel.setAttribute("for", eidVal);

    newCheck.appendChild(chkInput);
    newCheck.appendChild(chkLabel);

    accBody.appendChild(newCheck);
  }
}

function load_threat_groups() {
  document.getElementById("actorlibrary").remove();

  const al = document.createElement("div");
  al.id = "actorlibrary";

  document.getElementById("window-threatactorlibrary").appendChild(al);

  const names = Object.keys(cti.groups);
  for (var i = 0; i < names.length; i++) {
    const name = names[i];
    const g = cti.groups[name];

    const newDiv = document.createElement("div");
    newDiv.appendChild(document.createElement("hr"));

    actor_main_div(name, newDiv);

    const addButton = document.createElement("button");
    addButton.setAttribute("class", "btn btn-primary import-actor");
    addButton.setAttribute("data-actor", name);
    addButton.onclick = function(){import_actor(this)};
    addButton.innerText = load_label("import_actor");
    newDiv.appendChild(addButton);

    const viewButton = document.createElement("button");
    viewButton.setAttribute("class", "btn btn-success");
    viewButton.setAttribute("data-actor", name);
    viewButton.onclick = function(){load_actor_details(this)};
    viewButton.innerText = load_label("view_actor_details");

    newDiv.appendChild(viewButton);

    document.getElementById("actorlibrary").appendChild(newDiv);
  }
}

function removeCitations(text) {
  regexp = /\(Citation:.+?\)/g;
  matches = [...text.matchAll(regexp)];
  for (var m = 0; m < matches.length; m++) {
    text = text.replace(matches[m][0], "");
  }
  return text;
}

function actor_main_div(name, div) {
  const g = cti.groups[name];

  const h3 = document.createElement("h3");
  if (g.link != null) {
    const nameLink = document.createElement("a");
    nameLink.innerText = name;
    nameLink.href = g.link;
    nameLink.target = "tbat-actors";
    h3.appendChild(nameLink);
  } else {
    h3.innerText = name;
  }
  div.appendChild(h3);

  if (g.description != null) {
    const p = document.createElement("p");
    p.innerHTML = removeCitations(g.description);
    div.appendChild(p);
  }

  var aliasCounter = 0;
  const aliases = document.createElement("ul");
  for (var a = 0; a < g.aliases.length; a++) {
    const alias = g.aliases[a];
    if (alias != name) {
      const li = document.createElement("li");
      li.innerText = g.aliases[a];
      aliases.appendChild(li);
      aliasCounter += 1;
    }
  }
  if (aliasCounter > 0) {
    const h5 = document.createElement("h5");
    h5.innerText = load_label("aka");
    div.appendChild(h5);
    div.appendChild(aliases);
  }
}

function htmlToText(html) {
  if (typeof(html) != "undefined") {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return removeCitations(tempDiv.innerText);
  }
  return "";
}

function set_imported_actors() {
  const actors = Object.keys(tbat.actors);
  const btns = document.getElementsByClassName("import-actor");
  for (var i = 0; i < btns.length; i++) {
    const btn = btns[i];
    if (actors.indexOf(btn.dataset.actor) > -1) {
      btn.setAttribute("class", "btn btn-secondary import-actor");
      btn.disabled = "disabled";
    } else {
      btn.setAttribute("class", "btn btn-primary import-actor");
      btn.disabled = false;
    }
  }
}

function import_actor(sender) {
  const actorName = sender.attributes["data-actor"].value;
  const actor = cti.groups[actorName];
  if (typeof(actor) != "undefined") {
    tbat.actors[actorName] = {
      "description": htmlToText(actor.description),
      "ttps": actor["attack-patterns"]
    };
  }

  render_actors();
}

function addEle (to, type, content) {
  const e = document.createElement(type);
  e.innerText = content;
  to.appendChild(e);
  return e;
}

function render_actors() {
  const tat = document.getElementById("threat-actors-table");
  tat.getElementsByTagName("tbody")[0].remove();

  const tbody = document.createElement("tbody");

  var counter = 1;

  const actorNames = Object.keys(tbat.actors).sort();
  for (var i = 0; i < actorNames.length; i++) {
    const actorName = actorNames[i];
    const a = tbat.actors[actorName];

    const tr = document.createElement("tr");
    addEle(tr, "th", counter);
    addEle(tr, "td", actorName);

    if (typeof(a.intentions) != "undefined") {
      var langIntentions = [];
      for (var j = 0; j < a.intentions.length; j++) {
        langIntentions.push(load_label(a.intentions[j]));
      }

      addEle(tr, "td", langIntentions.join(", "));
    } else {
      addEle(tr, "td", "");
    }

    for (var vs = 0; vs < 4; vs++) {
      var vts = "";
      const v = ["intent", "willingness", "capability", "novelty"];
      if (typeof(a[v[vs]]) != "undefined") {
        if (a[v[vs]] != "na") {
          vts = a[v[vs]];
        }
      }
      addEle(tr, "td", vts);
    }

    const btnEle = addEle(tr, "td", "");

    const editButton = document.createElement("button");
    editButton.setAttribute("class", "btn btn-primary");
    editButton.setAttribute("data-actor", actorName);
    editButton.onclick = function(){edit_actor(this)};
    editButton.innerText = load_label("edit_actor");
    btnEle.appendChild(editButton);

    const delButton = document.createElement("button");
    delButton.setAttribute("class", "btn btn-warning");
    delButton.setAttribute("data-actor", actorName);
    delButton.onclick = function(){delete_actor(this)};
    delButton.innerText = load_label("delete_actor");
    btnEle.appendChild(delButton);

    tbody.appendChild(tr);

    counter += 1;
  }

  tat.appendChild(tbody);

  set_imported_actors();
}

function clear_actor_modal() {
  document.getElementById("hidActorType").value = "";
  document.getElementById("actorModalLabel").innerText = "";
  document.getElementById("taGroup").value = "";
  document.getElementById("taNotes").value = "";

  const chkIntentions = document.getElementsByName("intentions");
  for (var i = 0; i < chkIntentions.length; i++) {
    chkIntentions[i].checked = false;
  }

  for (var i = 0; i < 4; i++) {
    const v = ["intent", "willingness", "capability", "novelty"];
    document.getElementsByClassName(`form-${v[i]}`)[0].value = "na";
  }

  const chkboxes = document.getElementsByClassName("ttp-checkboxes");
  for (var i = 0; i < chkboxes.length; i++) {
    chkboxes[i].checked = false;
  }
}

function new_actor() {
  clear_actor_modal();
  document.getElementById("hidActorType").value = "new";
  document.getElementById("actorModalLabel").innerText = load_label("new_actor");
  actorModal.show();
}

function edit_actor(sender) {
  clear_actor_modal();

  const actorName = sender.getAttribute("data-actor");

  const a = tbat.actors[actorName];

  document.getElementById("hidActorType").value = "edit";
  document.getElementById("actorModalLabel").innerText = actorName;
  document.getElementById("taGroup").value = actorName;
  document.getElementById("taNotes").value = a.description;

  const chkIntentions = document.getElementsByName("intentions");
  for (var i = 0; i < chkIntentions.length; i++) {
    if (typeof(a.intentions) != "undefined") {
      if (a.intentions.indexOf(chkIntentions[i].value) > -1) {
        chkIntentions[i].checked = true;
      }
    }
  }

  for (var i = 0; i < 4; i++) {
    var vts = "na";
    const v = ["intent", "willingness", "capability", "novelty"];
    if (typeof(a[v[i]]) == "number") {
      vts = a[v[i]];
    }
    document.getElementsByClassName(`form-${v[i]}`)[0].value = vts;
  }

  for (var i = 0; i < a.ttps.length; i++) {
    const eid = chkExtId(a.ttps[i]);
    const chkBox = document.getElementById(eid);
    if (typeof(chkBox) != "undefined") {
      chkBox.checked = true;
    }
  }

  actorModal.show();
}

function delete_actor(sender) {
  const actorName = sender.getAttribute("data-actor");
  delete(tbat.actors[actorName]);

  notification(
    load_label("delete_actor"),
    load_label("deleted_actor_success") + " " + actorName
  );

  render_actors();
  plot_actors();
}

function save_actor() {
  const actorType = document.getElementById("hidActorType").value;

  if (actorType == "edit") {
    const currentActor = document.getElementById("actorModalLabel").innerText;
    delete(tbat.actors[currentActor]);
  }

  const newActor = document.getElementById("taGroup").value;
  tbat.actors[newActor] = {};

  const a = tbat.actors[newActor];
  a.description = document.getElementById("taNotes").value;

  const chkIntentions = document.getElementsByName("intentions");
  a.intentions = [];
  for (var i = 0; i < chkIntentions.length; i++) {
    if (chkIntentions[i].checked) {
      a.intentions.push(chkIntentions[i].value);
    }
  }

  for (var i = 0; i < 4; i++) {
    var vts = "na";
    const v = ["intent", "willingness", "capability", "novelty"];
    const fv = document.getElementsByClassName(`form-${v[i]}`)[0].value;
    if (fv != "na") {
      a[v[i]] = parseInt(fv);
    }
  }

  a.ttps = [];

  const chkboxes = document.getElementsByClassName("ttp-checkboxes");
  for (var i = 0; i < chkboxes.length; i++) {
    if (chkboxes[i].checked) {
      a.ttps.push(chkboxes[i].value);
    }
  }

  render_actors();
  plot_actors();

  actorModal.hide();
}

function load_actor_details(sender) {
  document.getElementById("mainModalDiv").remove();

  const mainModalDiv = document.createElement("div");
  mainModalDiv.id = "mainModalDiv";

  const name = sender.attributes["data-actor"].value;

  actor_main_div(name, mainModalDiv);

  const g = cti.groups[name];

  if (g.created != null) {
    const ch5 = document.createElement("h5");
    ch5.innerText = load_label("last_created");
    mainModalDiv.appendChild(ch5);

    const createdP = document.createElement("p");
    createdP.innerText = g.created;
    mainModalDiv.appendChild(createdP);
  }

  if (g.modified != null) {
    const ch5 = document.createElement("h5");
    ch5.innerText = load_label("last_modified");
    mainModalDiv.appendChild(ch5);

    const modifiedP = document.createElement("p");
    modifiedP.innerText = g.modified;
    mainModalDiv.appendChild(modifiedP);
  }

  if (g["attack-patterns"].length != 0) {
    const apsh5 = document.createElement("h5");
    apsh5.innerText = load_label("ttps");

    const apsCounter = document.createElement("span");
    apsCounter.setAttribute("class", "badge aps-badge bg-primary rounded-pill");
    apsCounter.innerText = g["attack-patterns"].length;
    apsh5.appendChild(apsCounter);

    mainModalDiv.appendChild(apsh5);

    const olaps = document.createElement("ol");
    olaps.setAttribute("class", "list-group list-group-numbered");

    for (var i = 0; i < g["attack-patterns"].length; i++) {
      const liap = document.createElement("li");
      liap.setAttribute("class", "list-group-item d-flex justify-content-between align-items-star");

      const apdiv = document.createElement("div");
      apdiv.setAttribute("class", "ms-2 me-auto");
      apdiv.setAttribute("data-ttp-id", g["attack-patterns"][i]);

      const ttp = cti.ttps[g["attack-patterns"][i]];

      const ttpHeader = document.createElement("div");
      ttpHeader.setAttribute("class", "fw-bold");
      ttpHeader.innerText = ttp.name;
      apdiv.appendChild(ttpHeader);

      if (typeof(ttp.kill_chain_phase) != "undefined") {
        const ttpKCP = document.createElement("div");
        const lbl = load_label("kill_chain_phase");

        var kcp = load_label(ttp.kill_chain_phase);
        if (typeof(kcp) == "undefined") {
          kcp = ttp.kill_chain_phase;
        }

        ttpKCP.innerText = `${lbl}: ${kcp}`;
        apdiv.appendChild(ttpKCP);
      }

      if (typeof(ttp.external_id) != "undefined") {
        const ttpEid = document.createElement("a");
        ttpEid.href = ttp.link;
        ttpEid.target = "mitre-ttp";
        ttpEid.innerText = `MITRE ATT&CK: ${ttp.external_id}`;
        apdiv.appendChild(ttpEid);
      }

      if (ttp["mitigations"].length != 0) {
        const mitHeader = document.createElement("div");
        mitHeader.setAttribute("class", "fw-bold");
        mitHeader.innerText = load_label("mitigations");
        apdiv.appendChild(mitHeader);

        var mitCount = 0;
        const mitUl = document.createElement("ul");
        for (var y = 0; y < ttp.mitigations.length; y++) {
          const m = cti.mitigations[ttp.mitigations[y]];

          if (typeof(m) == "undefined") {
            continue;
          }

          mitCount += 1;

          const mitLi = document.createElement("li");

          const mita = document.createElement("a");
          mita.href = m.link;
          mita.target = "mitre-ttp";
          mita.innerText = `${m.external_id}: ${m.name}`;
          mitLi.appendChild(mita);

          if (typeof(m.description) != "undefined") {
            const md = document.createElement("div");
            md.innerText = removeCitations(m.description);
            mitLi.appendChild(md);
          }
          mitUl.appendChild(mitLi);
        }
        if (mitCount > 0) {
          apdiv.appendChild(mitUl);
        }
      }

      liap.appendChild(apdiv);
      olaps.appendChild(liap);
    }

    mainModalDiv.appendChild(olaps);
  }

  document.getElementById("mainModalBody").appendChild(mainModalDiv);
  document.getElementById("mainModalLabel").innerText = name;

  actorLibaryModal.show();
}

function add_actor() {

}

function commas (int) {
  try
  {
    const parsedInt = parseInt(int);
    if (isNaN(parsedInt)) {
      return int;
    }
    return parsedInt.toLocaleString('en-US');
  }
  catch (err)
  {
    return int;
  }
}

function plot_actors() {

  for (var i = 0; i < document.getElementsByClassName("grid-square").length; i++) {
    document.getElementsByClassName("grid-square")[i].innerHTML = "";
  }

  const actorsList = document.getElementById("actorsList");
  actorsList.innerHTML = "";

  const ttpList = document.getElementById("ttpList");
  ttpList.innerHTML = "";

  var ttpsToShow = {};

  const actorNames = Object.keys(tbat.actors);
  for (var i = 0; i < actorNames.length; i++) {
    const actorName = actorNames[i];
    const a = tbat.actors[actorName];

    const actorDiv = document.createElement("div");
    const actorHeader = document.createElement("h3");
    actorHeader.innerText = actorName;
    actorDiv.appendChild(actorHeader);

    var validCount = 0;
    for (var vs = 0; vs < 4; vs++) {
      var vts = "";
      const v = ["intent", "willingness", "capability", "novelty"];
      if (typeof(a[v[vs]]) != "undefined") {
        if (!isNaN(a[v[vs]])) {
          validCount += 1;
        }
      }
    }
    if (validCount != 4) {
      continue;
    }

    const overall_intent = parseInt(a.intent) + parseInt(a.willingness);
    const overall_capability = parseInt(a.capability) + parseInt(a.novelty);
    const score = overall_intent * overall_capability;

    const scorep = document.createElement("p");
    scorep.innerText = load_label("intent") + ": " + overall_intent;
    scorep.innerText += " " + load_label("capability") + ": " + overall_capability;
    scorep.innerText += " " + load_label("score") + ": " + score;
    actorDiv.appendChild(scorep);

    if (typeof(a.description) != "undefined" && a.description != "") {
      const descp = document.createElement("p");
      descp.innerText = a.description;
      actorDiv.appendChild(descp);
    }

    if (typeof(a.ttps) != "undefined") {
      for (var t = 0; t < a.ttps.length; t++) {
        const ttpName = a.ttps[t];
        if (typeof(ttpsToShow[ttpName]) != "undefined") {
          ttpsToShow[ttpName] += score;
        } else {
          ttpsToShow[ttpName] = score;
        }
      }
    }

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
      new_actor.innerText = actorName;

      document.getElementsByClassName(actor_class)[0].appendChild(new_actor);
      actorsList.appendChild(actorDiv);
    }
  }

  var mitToShow = {};

  const ttpsSorted = Object.entries(ttpsToShow).sort(
    ([,a],[,b]) => a-b || a <= b
  ).reverse();

  for (var i = 0; i < ttpsSorted.length; i++) {
    const t = ttpsSorted[i];
    const ttp = t[0];
    const score = t[1];
    if (score > 0) {
      const cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "report-ttp card-body");
      const ttpObj = cti.ttps[ttp];

      if (typeof(ttpObj.mitigations) != "undefined") {
        for (var m = 0; m < ttpObj.mitigations.length; m++) {
          const ttpMit = ttpObj.mitigations[m];
          if (typeof(mitToShow[ttpMit]) != "undefined") {
            mitToShow[ttpMit] += score;
          } else {
            mitToShow[ttpMit] = score;
          }
        }
      }

      const h3 = document.createElement("h3");
      h3.setAttribute("class", "card-title");
      const ttpLink = document.createElement("a");
      ttpLink.href = ttpObj.link;
      ttpLink.target = "mitre-ttp";
      ttpLink.innerText = ttpObj.external_id;
      h3.appendChild(ttpLink);
      cardDiv.appendChild(h3);

      const hName = document.createElement("h4");
      hName.innerText = ttpObj.name;
      cardDiv.appendChild(hName);

      const pScore = document.createElement("p");
      pScore.innerText = load_label("score") + ": " + commas(score);
      cardDiv.appendChild(pScore);

      //ttpList.appendChild(ttpDiv);

      const ttpDiv = document.createElement("div");
      ttpDiv.setAttribute("class", "");
      const cardBody = document.createElement("div");
      cardBody.setAttribute("class", "card");
      cardBody.appendChild(cardDiv);
      ttpDiv.appendChild(cardBody);
      ttpList.appendChild(ttpDiv);
    }
  }

  const mitsSorted = Object.entries(mitToShow).sort(
    ([,a],[,b]) => a-b || a <= b
  ).reverse();

  const mitList = document.getElementById("mitigationList");
  mitList.innerHTML = "";

  for (var i = 0; i < mitsSorted.length; i++) {
    const mit = mitsSorted[i];
    const mitigation = mit[0];
    const score = mit[1];
    if (score > 0) {
      const m = cti.mitigations[mitigation];
      if (typeof(m) != "undefined") {
        const cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "report-mitigation card-body");

        const h3 = document.createElement("h3");
        h3.setAttribute("class", "card-title");
        const mitLink = document.createElement("a");
        mitLink.href = m.link;
        mitLink.target = "mitre-mitigation";
        mitLink.innerText = m.external_id;
        h3.appendChild(mitLink);
        cardDiv.appendChild(h3);

        const hName = document.createElement("h4");
        hName.innerText = m.name;
        cardDiv.appendChild(hName);

        const pDesc = document.createElement("p");
        pDesc.innerText = m.description;
        cardDiv.appendChild(pDesc);

        const pScore = document.createElement("p");
        pScore.innerText = load_label("score") + ": " + commas(score);
        cardDiv.appendChild(pScore);

        const mitDiv = document.createElement("div");
        mitDiv.setAttribute("class", "");
        const cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card");
        cardBody.appendChild(cardDiv);
        mitDiv.appendChild(cardBody);
        mitList.appendChild(mitDiv);
      }
    }
  }

  /*window.setTimeout(function() {
    ttpMsnry.layout();
    mitigationMsnry.layout();
  }, 100);*/
}
