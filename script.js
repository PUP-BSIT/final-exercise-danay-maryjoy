const firestoreBaseUrl =
  "https://firestore.googleapis.com/v1/projects/majoy-7852c/databases/(default)/documents";
const commentsCollection = "comment_table";

function getComments(sortOrder) {
  fetch(
    `${firestoreBaseUrl}/${commentsCollection}?orderBy=created_at&sortOrder=${sortOrder}`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const comments = data.documents.map((doc) => {
        const commentData = doc.fields;
        return {
          id: doc.name.split("/").pop(),
          name: commentData.name.stringValue,
          user_comment: commentData.user_comment.stringValue,
          created_at: commentData.created_at.timestampValue,
        };
      });
      displayComments(comments);
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

function addComment(name, user_comment) {
  const commentData = {
    name: { stringValue: name },
    user_comment: { stringValue: user_comment },
    created_at: { timestampValue: new Date().toISOString() },
  };

  fetch(`${firestoreBaseUrl}/${commentsCollection}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: commentData }),
  })
    .then((response) => {
      console.log("comment added:", response);
      getComments("desc"); // Refresh the displayed comments
    })
    .catch((error) => {
      console.error("Error adding comment:", error);
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
    event.preventDefault();

    let name = document.getElementById("name_input").value;
    let user_comment = document.getElementById("user_comments_input").value;

    addComment(name, user_comment);

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
