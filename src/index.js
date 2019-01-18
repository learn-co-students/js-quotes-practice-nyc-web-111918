// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", function(){
  const quoteList = document.querySelector("#quote-list")
  const newQuoteForm = document.querySelector("#new-quote-form")

  fetch('http://localhost:3000/quotes')
    .then (res => res.json())
    .then (quotes => {
      quotes.forEach(function(quote){
        quoteList.innerHTML += `
        <li class='quote-card'>
          <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button data-id='${quote.id}' class='btn-success'>Likes: <span>${quote.likes}</span></button>
          <button data-id='${quote.id}' class='btn-danger'>Delete</button>
          </blockquote>
        </li>
        `
      })
    })

  newQuoteForm.addEventListener("submit", function(e){
    e.preventDefault()
    const newQuote = document.querySelector("#new-quote").value
    const newAuthor = document.querySelector("#author").value

    fetch('http://localhost:3000/quotes', {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },

      body: JSON.stringify({
        quote: newQuote,
        author: newAuthor,
        likes: 1,
      })

    })
      .then(res => res.json())
      .then(newEntry => {
        quoteList.innerHTML += `
        <li class='quote-card'>
          <blockquote class="blockquote">
          <p class="mb-0">${newEntry.quote}</p>
          <footer class="blockquote-footer">${newEntry.author}</footer>
          <br>
          <button data-id='${newEntry.id}' class='btn-success'>Likes: <span>${newEntry.likes}</span></button>
          <button data-id='${newEntry.id}' class='btn-danger'>Delete</button>
          </blockquote>
        </li>
        `
      })
    e.target.reset()

  }) // End of Form Submit Listener

  quoteList.addEventListener("click", function(e){
    if (e.target.className === 'btn-success') {
      const editQuoteId = e.target.dataset.id
      const likeAmount = parseInt(e.target.innerText.substr(-1))

      fetch(`http://localhost:3000/quotes/${editQuoteId}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },

        body: JSON.stringify({
          "likes": likeAmount + 1,
        })

      })
      e.target.innerText = `Likes: ${likeAmount + 1}`
    }

    if (e.target.className === 'btn-danger'){
      const deleteQuoteId = e.target.dataset.id
      const quoteToRemove = e.target.parentElement.parentElement

      fetch(`http://localhost:3000/quotes/${deleteQuoteId}`, {
        method: "DELETE",
      })

      quoteToRemove.remove()
    }
  })


}) // End of DOMContentLoaded
