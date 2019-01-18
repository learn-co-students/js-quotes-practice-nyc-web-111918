// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", function(){
  const newQuoteForm = document.querySelector("#new-quote-form")
  const quoteList = document.querySelector("#quote-list")
  const newQuoteInput = document.querySelector("#new-quote")
  const newAuthorInput = document.querySelector("#new-author")
  const editForm = document.querySelector("#edit-form")
  const editQuoteInput = document.querySelector("#edit-quote-input")
  const editAuthorInput = document.querySelector("#edit-author-input")

  let quoteID = 0
  //Initial Fetch
  fetch(`http://localhost:3000/quotes`)
  .then(res => res.json())
  .then(quotes => {
    const quoteListHTML = quotes.map(function(quote){
      return(`
        <li data-id=${quote.id} class='quote-card'>
          <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button data-id=${quote.id} class='btn-success' data-action="like-btn">Likes: <span>${quote.likes}</span></button>
            <button data-id=${quote.id} class='btn-danger'data-action="delete-btn">Delete</button>
            <button data-id=${quote.id} data-action="edit-btn">Edit</button>
          </blockquote>
        </li>
        `)
    }).join("")
    quoteList.innerHTML = quoteListHTML
  }) // End of first fetch

  //LISTENERS
  newQuoteForm.addEventListener("submit", function(e){
    e.preventDefault()
    fetch(`http://localhost:3000/quotes` , {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body:JSON.stringify({
        "quote": newQuoteInput.value,
        "likes": 1,
        "author": newAuthorInput.value
      })
    })
    .then(res => res.json())
    .then(quote => {
      //Add to the DOM
      quoteList.innerHTML += `
        <li data-id=${quote.id} class='quote-card'>
          <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button data-id=${quote.id} class='btn-success' data-action="like-btn">Likes: <span>${quote.likes}</span></button>
            <button data-id=${quote.id} class='btn-danger'data-action="delete-btn">Delete</button>
          </blockquote>
        </li>
        `
        newQuoteInput.value = ""
        newAuthorInput.value = ""
    })


  }) // End of newQuoteForm Listener

  quoteList.addEventListener("click", function(e){
    if (e.target.dataset.action === "like-btn"){
      //Like button functionality
      quoteID = e.target.dataset.id
      let numLikes = parseInt(e.target.innerText.slice(7))
      numLikes++
      // //Update the DB
      fetch(`http://localhost:3000/quotes/${quoteID}`,{
        method: "PATCH",
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body:JSON.stringify({
          "likes": numLikes
        })
      })
      //Update the DOM
      e.target.innerText = `Likes: ${numLikes}`
    } else if (e.target.dataset.action === "delete-btn"){
      //Delete button functionality
      quoteID = e.target.dataset.id
      fetch(`http://localhost:3000/quotes/${quoteID}`, {method: "DELETE"})
      .then(res => res.json())
      .then(() => {
        //find and remove that quote on the DOM
        //by traversing up the dom from target
        e.target.parentElement.parentElement.remove()
      })
    } else if (e.target.dataset.action === "edit-btn") {
      //edit functionality, make form appear
      // quoteID = e.target.dataset.id
      modal.style.display = "block";
      editQuoteInput.value = ""
      editAuthorInput.value = ""

    }
  }) // End of quoteList button checker listener

  editForm.addEventListener("submit", function(e){
    e.preventDefault()


  }) // End of submit edit form listener








  //HELPERS
  var modal = document.getElementById('myModal');
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
})  // End of DOMContentLoaded
