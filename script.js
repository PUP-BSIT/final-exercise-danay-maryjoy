// Function to fetch and display comments data
const commentsUrl = "back_end.php";

function getComments(sortOrder) {
  fetch(`${commentsUrl}?sort=${sortOrder}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      displayComments(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayComments(comments) {
  const commentsList = document.getElementById("comments_list");
  commentsList.innerHTML = "";

  comments.forEach((comment) => {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment-entry");
    commentDiv.innerHTML = `
          <p id="name_${comment.id}"><strong>${comment.name}:</strong></p>   
          <p id="user_comment_${comment.id}">${comment.user_comment}</p>
          <p><em>commented at: ${comment.created_at}</em></p>
      `;
    commentsList.appendChild(commentDiv);
  });
}

// Add event listener to trigger sorting
document.getElementById("sortOrder").addEventListener("change", function () {
  const sortOrder = document.getElementById("sortOrder").value;
  getComments(sortOrder);
});

function addComment() {
  const addcommentForm = document.getElementById("add_comment_form");

  addcommentForm.addEventListener("submit", function (event) {
    let name = document.getElementById("name_input").value;
    let user_comment = document.getElementById("user_comments_input").value;

    event.preventDefault();

    const commentData = {
      name: name,
      user_comment: user_comment,
    };

    fetch(commentsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify(commentData),
    })
      .then((response) => {
        console.log("comment added:", response);
        getComments(); // Refresh the displayed comments
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });

    document.getElementById("name_input").value = "";
    document.getElementById("user_comments_input").value = "";
  });
}

// Call the addcomment function to enable form submission handling
addComment();

// Load comments data when the page loads with default sorting
document.addEventListener("DOMContentLoaded", function () {
  getComments("desc"); // Default sorting is descending
});
