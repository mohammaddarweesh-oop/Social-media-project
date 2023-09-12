const baseUrl = "https://tarmeezacademy.com/api/v1";
function getCurrentUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  return id;
}
setupUI();
// window.addEventListener("scroll", function () {

//   const scrollHeight = document.documentElement.scrollHeight;
//   const scrollTop = document.documentElement.scrollTop;
//   const clientHeight = document.documentElement.clientHeight;

//   if (scrollTop + clientHeight >= scrollHeight - 40) {
//     currentPage++;
//     getAllPosts(false, currentPage);
//   }
// });
function getUserInfo() {
  let user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  let content = `
        <div class="card-body">
        <div class="row">
            <div class="col-2">
            <img
                src="${user.profile_image}"
                alt="no image profile"
                class="rounded-circle img-profile"
                style="width: 120px; height: 120px"
            />
            </div>
            <div
            class="col-4 d-flex flex-column justify-content-evenly"
            >
            <div class="user-main-info">${
              user.email === null ? "default@gmail.com" : user.email
            }</div>
            <div class="user-main-info">${user.name}</div>
            <div class="user-main-info">${user.username}</div>
            </div>
            <div class="col-4">
            <div class="number-info"><span>${user.posts_count}</span>posts</div>
            <div class="number-info"><span>${
              user.comments_count
            }</span>Comments</div>
            </div>
        </div>
        </div>
  `;
  document.getElementById("user-info-data").innerHTML = content;
}
function getUser() {
  const id = getCurrentUserId();
  axios.get(`${baseUrl}/users/${id}`).then((response) => {
    let user = response.data.data;
    console.log("user", user);
    document.getElementById("user-main-email").innerHTML = user.email;
    document.getElementById("user-main-name").innerHTML = user.name;
    document.getElementById("main-info-image").src = user.profile_image;
    document.getElementById("user-main-username").innerHTML = user.username;
    document.getElementById("comments-count").innerHTML = user.comments_count;
    document.getElementById("posts-count").innerHTML = user.posts_count;
    document.getElementById("name-posts").innerHTML = user.username;
  });
}
getUser();

document.getElementById("user-posts").innerHTML = "";
function getAllPosts() {
  let id = getCurrentUserId();
  toggleLoader(true);
  axios
    .get(baseUrl + `/users/${id}/posts`)
    .then((response) => {
      let posts = response.data.data;

      let content = ``;
      for (post of posts) {
        let user = getCurrentUser();
        let isMyPost = user != null && post.author.id == user.id;

        let editButtonContent = ``;
        if (isMyPost) {
          editButtonContent = `
          <button class="btn btn-danger" style="float: right;margin-left: 5px;" onclick="deletePostOnClick('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Delete</button>
          <button class="btn btn-secondary" style="float: right;" onclick="editPostOnClick('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Edit</button>
        
        
        `;
        } else {
          editButtonContent = ``;
        }
        content = `
        
        <div class="post shadow mt-3" >
            <div class="card">
                <div class="card-header">
                <img
                    src="${post.author.profile_image}"//
                    alt=""
                    class="img-pro border border-3"
                />
                <b>${post.author.username}</b>
                ${editButtonContent}
                </div>
                <div class="card-body" onClick="postClicked(${
                  post.id
                })" style="cursor: pointer;">
                <img src="${post.image}" alt="" class="my-3 rounded" />
                <span class="text-secondary">${post.created_at}</span>
                <h5 class="card-title">${
                  post.title !== null ? post.title : ""
                }</h5>
                <p class="card-text">
                    ${post.body}
                </p>
                <hr />
                <div class="">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-pencil"
                    viewBox="0 0 16 16"
                    style="cursor: pointer;"
                    >
                    <path
                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
                    />
                    </svg>
                    <span class="text-secondary">(${
                      post.comments_count
                    }) Comments 
                        <span id="post-tags-${post.id}">
                        ${post.tags.map(
                          (tag) => `
                        <button class="btn btn-sm rounded-5" style="background-color: gray;color:white;">${tag.name}</button>
                        
                        `
                        )}
                        
                        </span>
                    </span>
                    
                </div>
                </div>
            </div>
            </div>
        `;
        document.getElementById("user-posts").innerHTML += content;
      }

      let tags = response.data.data.map((e) => {
        let tagsContent = `
            <button class="btn btn-sm rounded-5" style="background-color: gray;color:white;">${
              e.tags.name !== undefined ? e.tags.name : "Empty Tags"
            }</button>
            `;
        if (e.tags.name !== undefined) {
          document.getElementById(`post-tags-${e.id}`).innerHTML += tagsContent;
          console.log(e.tags.name);
        }
      });
      // document.getElementById(`post-tags-${post.id}`).innerHTML = tags
    })
    .catch((error) => {
      console.error(error.message);
      showSuccessAlert(error.message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
getAllPosts();
