// Infinit Scroll //
window.addEventListener("scroll", function () {
  // const endOfPage =
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
  console.log(
    "scrolling",
    window.innerHeight,
    window.pageYOffset,
    document.body.scrollHeight
  );

  if (endOfPage && currentPage < lastPage) {
    // addCards(currentPage + 1);
    currentPage++;
    getAllPosts(false, currentPage);
  }

  // const scrollHeight = document.documentElement.scrollHeight;
  // const scrollTop = document.documentElement.scrollTop;
  // const clientHeight = document.documentElement.clientHeight;

  // if (scrollTop + clientHeight >= scrollHeight - 40) {
  //   currentPage++;
  //   getAllPosts(false, currentPage);
  // }
});
// Infinit Scroll //

console.log("console ... /");
const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;

function getAllPosts(reload = true, page = 1) {
  toggleLoader(true);
  axios
    .get(baseUrl + `/posts?limit=6&page=${page}`)
    .then((response) => {
      toggleLoader(false);
      console.log(response.data.data);
      lastPage = response.data.meta.last_page;

      if (reload) {
        document.getElementById("posts").innerHTML = "";
      }
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
                  <span onclick="userClicked(${
                    post.author.id
                  })" style="cursor: pointer;">
                    <img
                      src="${post.author.profile_image}"//
                      alt=""
                      class="img-pro border border-3"
                    />
                    <b>${post.author.username}</b>
                  <span>
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
      }

      // let content = response.data.data.map(
      //   (e) =>
      //     `

      //   <div class="post shadow mt-3" >
      //         <div class="card">
      //           <div class="card-header">
      //             <img
      //               src="${e.author.profile_image}"//
      //               alt=""
      //               class="img-pro border border-3"
      //             />
      //             <b>${e.author.name}</b>
      //             <button class="btn btn-secondary" style="float: right;" onclick="editPostOnClick('${encodeURIComponent(
      //               JSON.stringify(e)
      //             )}')">Edit</button>
      //           </div>
      //           <div class="card-body" onClick="postClicked(${
      //             e.id
      //           })" style="cursor: pointer;">
      //             <img src="${e.image}" alt="" class="my-3 rounded" />
      //             <span class="text-secondary">${e.created_at}</span>
      //             <h5 class="card-title">${e.title !== null ? e.title : ""}</h5>
      //             <p class="card-text">
      //               ${e.body}
      //             </p>
      //             <hr />
      //             <div class="">
      //               <svg
      //                 xmlns="http://www.w3.org/2000/svg"
      //                 width="16"
      //                 height="16"
      //                 fill="currentColor"
      //                 class="bi bi-pencil"
      //                 viewBox="0 0 16 16"
      //                 style="cursor: pointer;"
      //               >
      //                 <path
      //                   d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
      //                 />
      //               </svg>
      //               <span class="text-secondary">(${e.comments_count}) Comments
      //                   <span id="post-tags-${e.id}">
      //                   ${e.tags.map(
      //                     (e) => `
      //                   <button class="btn btn-sm rounded-5" style="background-color: gray;color:white;">${e.name}</button>

      //                   `
      //                   )}

      //                   </span>
      //               </span>

      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //   `
      // );
      document.getElementById("posts").innerHTML += content;

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
    })
    .catch((error) => {
      console.error(error);
    });
}
// ==================== Get All Posts =========================

// ===================== user clicked =====================
function userClicked(userid) {
  window.location = `profile.html?id=${userid}`;
}
let token = "";
let user = "";

// // ==================== Logout =========================
// // function logout() {
// //   localStorage.removeItem("token");
// //   localStorage.removeItem("user");
// //   window.reload;
// //   showSuccessAlert("Logged out successfully ..!");
// //   setupUI();
// // }

// // ==================== create New Post =======================
// function createNewPostAlert() {
//   let postid = document.getElementById("post-title-input").value;
//   let isCreate = postid == null || postid == "";
//   let title = document.getElementById("post-title");
//   let body = document.getElementById("post-body");
//   let image = document.getElementById("post-image");

//   console.log(localStorage.getItem("token"));

//   document.getElementById("post-modal-title").innerHTML = "Ceat New Post";
//   let formData = new FormData();
//   formData.append("title", title.value);
//   formData.append("body", body.value);
//   formData.append("image", image.files[0]);
//   // let params = {
//   //   title: title.value,
//   //   body: body.value,
//   // };

//   let token = localStorage.getItem("token");
//   let url = ``;
//   if (isCreate) {
//     url = `https://tarmeezacademy.com/api/v1/posts`;
//   } else {
//     formData.append("_method", "put");
//     url = `https://tarmeezacademy.com/api/v1/posts/${postid}`;
//   }
//   axios
//     .post(url, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then((response) => {
//       const modal = document.getElementById("create-post-modal");
//       const modalInstance = bootstrap.Modal.getInstance(modal);
//       modalInstance.hide();
//       showSuccessAlert("New Post Has Been Created");
//       getAllPosts();
//     })
//     .catch((err) => {
//       console.log(err.response.data.message);
//       console.log(err);
//       showSuccessAlert(err.response.data.message + " !!", "danger");
//     });

//   // showSuccessAlert("Created post");
// }

// pagination => هو جلب البوستات على اجزاء وليس جلب كل بوستات الموقع مرة واحدة
// infinit scrolling السحب اللانهائي
// const handleInfiniteScroll = () => {
//   const endOfPage =
//     window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
//   if (endOfPage) {
//     addCards(currentPage + 1);
//   }
// };

// function postClicked(postid) {
//   window.location = `postDetails.html?id=${postid}`;
//   console.log(postid);
//   // let user = getCurrentUser();
// }
// // ==================== Start Edit Post =========================== //
// function editPostOnClick(postObject) {
//   let post = JSON.parse(decodeURIComponent(postObject));
//   document.getElementById("post-modal-title").innerHTML = "Edit Post";
//   document.getElementById("share").innerHTML = "Update";
//   let postModal = new bootstrap.Modal(
//     document.getElementById("create-post-modal"),
//     {}
//   );
//   postModal.toggle();
//   document.getElementById("post-title-input").value = post.id;
//   document.getElementById("post-title").value = post.title;
//   document.getElementById("post-body").value = post.body;
// }
// // ==================== End Edit Post ============================= //
// // ==================== Start Delete Post ========================= //
// function deletePostOnClick(postObject) {
//   let post = JSON.parse(decodeURIComponent(postObject));
//   document.getElementById("delete-post-id-input").value = post.id;
//   console.log(post);

//   let postModal = new bootstrap.Modal(
//     document.getElementById("delete-post-modal"),
//     {}
//   );
//   postModal.toggle();
// }
// function confirmDelete() {
//   let id = document.getElementById("delete-post-id-input").value;

//   const url = `${baseUrl}/posts/${id}`;
//   // axios
//   //   .delete(url, {
//   //     headers: {
//   //       "Content-Type": "multipart/form-data",
//   //       Authorization: `Bearer ${token}`,
//   //     },
//   //   })
//   //   .then((response) => {
//   //     console.log(response);
//   //     // console.log(`Deleted post by id ${post.id}`);
//   //   })
//   //   .catch((error) => {
//   //     console.log(error);
//   //   });
//   let token = localStorage.getItem("token");
//   axios
//     .delete(url, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         authorization: `Bearer ${token}`,
//       },
//     })
//     .then((response) => {
//       console.log(response);
//       showSuccessAlert("Deleted Post");

//       const modal = document.getElementById("create-post-modal");
//       const modalInstance = bootstrap.Modal.getInstance(modal);
//       modalInstance.hide();
//       getAllPosts();
//     })
//     .catch((error) => {
//       console.log(error.message);
//     });
// }
// // ==================== End Delete Post ========================= //

// // ==================== Edit Post =============================
// function addBtnCliked() {
//   document.getElementById("post-modal-title").innerHTML = "Create New Post";
//   document.getElementById("share").innerHTML = "Create";
//   let postModal = new bootstrap.Modal(
//     document.getElementById("create-post-modal"),
//     {}
//   );
//   postModal.toggle();
//   document.getElementById("post-title-input").value = "";
//   document.getElementById("post-title").value = "";
//   document.getElementById("post-body").value = "";
// }

// ==================== Call Function =========================
getAllPosts();
setupUI();
console.log(token);
console.log(user);
