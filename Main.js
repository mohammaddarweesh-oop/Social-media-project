// const baseUrl = "https://tarmeezacademy.com/api/v1";
function setupUI() {
  const token = localStorage.getItem("token");
  if (token === null) {
    // document.getElementById("btn-login").style.visibility = "visible";
    // document.getElementById("btn-register").style.visibility = "visible";
    if (document.getElementById("btn-add-post") != null) {
      document.getElementById("btn-add-post").style.visibility = "hidden";
    }

    document
      .getElementById("container-logout")
      .style.setProperty("display", "none", "important");
    document
      .getElementById("container-login")
      .style.setProperty("display", "flex", "important");
  } else {
    // document.getElementById("btn-login").style.visibility = "hidden";
    // document.getElementById("btn-register").style.visibility = "hidden";
    // document.getElementById("btn-logout").style.visibility = "visible";
    document
      .getElementById("container-logout")
      .style.setProperty("display", "flex", "important");
    document
      .getElementById("container-login")
      .style.setProperty("display", "none", "important");
    if (document.getElementById("btn-add-post") != null) {
      document.getElementById("btn-add-post").style.visibility = "visible";
    }

    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("img-user").src = user.profile_image;
  }
}

// Start register //
function register() {
  console.log("register ");
  let username = document.getElementById("username-reg").value;
  let password = document.getElementById("password-reg").value;
  let name = document.getElementById("name-reg").value;
  let image = document.getElementById("img-reg").files[0];
  let formData = new FormData();
  formData.append("username", username);
  formData.append("name", name);
  formData.append("password", password);
  formData.append("image", image);
  // let params = {
  //   username: username,
  //   name: name,
  //   password: password,
  // };
  // rest api
  axios
    .post(baseUrl + "/register", formData)
    .then((response) => {
      console.log(response.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      token = localStorage.getItem("token");
      user = localStorage.getItem("user");
      console.log(token);
      console.log(user);

      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showSuccessAlert("New User Registered successfully ..!");
      setupUI();
    })
    .catch((err) => {
      console.log(err.response.data.message);
      showSuccessAlert(err.response.data.message, "danger");
    });
}
// End register //

// ==================== Start login ========================= //
let login = () => {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  console.log("username : ", username);
  console.log("password : ", password);
  toggleLoader(true);
  axios
    .post(`${baseUrl}/login`, {
      username: username,
      password: password,
    })
    .then((response) => {
      toggleLoader(false);
      // console.log(response.data.data.token);
      // console.log(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      token = localStorage.getItem("token");
      user = localStorage.getItem("user");
      console.log(token);
      console.log(user);
      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showSuccessAlert("Logged in successfully ..!");
      setupUI();
    })
    .catch((error) => {
      console.log(error.message);
      showSuccessAlert(error.message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
};
// ==================== End login ========================= //

// Start Alert //
function showSuccessAlert(msg, type = "success") {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

  const alert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  alert(msg, type);
  // const alertTrigger = document.getElementById("login");

  // if (alertTrigger) {
  //   alertTrigger.addEventListener("click", () => {
  //     alert(msg, "success");
  //   });
  // }

  // Todo : auto close alert =====================================
  setTimeout(() => {
    const closeAlert = bootstrap.Alert.getOrCreateInstance(
      "#liveAlertPlaceholder"
    );
    // closeAlert.hide();
  }, 1000);
  // ==============================================================
}
// End Alert //
// Start Logout //
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  toggleLoader(true);
  window.reload;
  toggleLoader(false);
  showSuccessAlert("Logged out successfully ..!");
  setupUI();
}
// End Logout //
// get current user
function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}
function profileClicked() {
  const user = getCurrentUser();
  window.location = `profile.html?id=${user.id}`;
}
// ==================== Logout =========================
// function logout() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
//   window.reload;
//   showSuccessAlert("Logged out successfully ..!");
//   setupUI();
// }
// ==================== Start Edit Post =========================== //
function editPostOnClick(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("share").innerHTML = "Update";
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
  document.getElementById("post-title-input").value = post.id;
  document.getElementById("post-title").value = post.title;
  document.getElementById("post-body").value = post.body;
}
// ==================== End Edit Post ============================= //
// ==================== Start Delete Post ========================= //
function deletePostOnClick(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("delete-post-id-input").value = post.id;
  console.log(post);

  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();
}
function confirmDelete() {
  let id = document.getElementById("delete-post-id-input").value;

  const url = `${baseUrl}/posts/${id}`;
  // axios
  //   .delete(url, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //   .then((response) => {
  //     console.log(response);
  //     // console.log(`Deleted post by id ${post.id}`);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  let token = localStorage.getItem("token");
  axios
    .delete(url, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response);
      showSuccessAlert("Deleted Post");

      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      getAllPosts();
    })
    .catch((error) => {
      console.log(error.message);
    });
}
// ==================== End Delete Post ========================= //
// ==================== create New Post =======================
function createNewPostAlert() {
  let postid = document.getElementById("post-title-input").value;
  let isCreate = postid == null || postid == "";
  let title = document.getElementById("post-title");
  let body = document.getElementById("post-body");
  let image = document.getElementById("post-image");

  console.log(localStorage.getItem("token"));

  document.getElementById("post-modal-title").innerHTML = "Ceat New Post";
  let formData = new FormData();
  formData.append("title", title.value);
  formData.append("body", body.value);
  formData.append("image", image.files[0]);
  // let params = {
  //   title: title.value,
  //   body: body.value,
  // };

  let token = localStorage.getItem("token");
  let url = ``;
  if (isCreate) {
    url = `https://tarmeezacademy.com/api/v1/posts`;
  } else {
    formData.append("_method", "put");
    url = `https://tarmeezacademy.com/api/v1/posts/${postid}`;
  }
  toggleLoader(true);
  axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      toggleLoader(false);
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showSuccessAlert("New Post Has Been Created");
      getAllPosts();
    })
    .catch((err) => {
      console.log(err.response.data.message);
      console.log(err);
      showSuccessAlert(err.response.data.message + " !!", "danger");
    });

  // showSuccessAlert("Created post");
}
// ==================== Edit Post =============================
function addBtnCliked() {
  document.getElementById("post-modal-title").innerHTML = "Create New Post";
  document.getElementById("share").innerHTML = "Create";
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-title").value = "";
  document.getElementById("post-body").value = "";
}
// ===================== post clicked
function postClicked(postid) {
  window.location = `postDetails.html?id=${postid}`;
  console.log(postid);

  // let user = getCurrentUser();
}

// ================== Start Loader ==================================== //
function toggleLoader(show = true) {
  document.getElementById("loader").style.visibility = show
    ? "visible"
    : "hidden";
  // document.getElementById("loader").style.visibility = ;
}

// ================== End Loader ==================================== //
setupUI();
