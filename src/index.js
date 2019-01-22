// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

let ALLQUOTES = []

document.addEventListener('DOMContentLoaded', () => {

  const quoteContainer = document.querySelector('#quote-list')
  const quoteForm = document.querySelector('#new-quote-form')
  let newQuoteInput = document.querySelector('#new-quote')
  let authorInput = document.querySelector('#author')
  const deleteBtn = document.querySelector('.btn-danger')

  fetch('http://localhost:3000/quotes')
  .then(r => r.json())
  .then(quotesObj => {
    ALLQUOTES = quotesObj
    quoteContainer.innerHTML = renderAllQuotes()
  })


  quoteContainer.addEventListener('click', (e) => {
    let quoteId = event.target.dataset.id
    if (e.target.classList.contains('btn-danger')) {
      fetch(`http://localhost:3000/quotes/${quoteId}`, { method: 'DELETE' })
      document.querySelector(`.quote-card[data-id="${quoteId}"]`).remove()
    } else if (e.target.classList.contains('btn-success')) {
      let foundQuote = ALLQUOTES.find(quote => {
        return quote.id == event.target.dataset.id
      })
      foundQuote.likes++
      fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Action: "application/json"
        },
        body: JSON.stringify({
          "likes": foundQuote.likes
        })
      })
      .then(r => r.json())
      .then(updatedQuote => {
        oldQuoteIndex = ALLQUOTES.indexOf(foundQuote)
        ALLQUOTES[oldQuoteIndex] = updatedQuote
        quoteContainer.innerHTML = renderAllQuotes()
      })
    }
  })

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(newQuoteInput)
    console.log(authorInput)
    fetch('http://localhost:3000/quotes', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Action: "application/json"
      },
      body: JSON.stringify({
        "quote": newQuoteInput.value,
        "likes": 0,
        "author": authorInput.value
      })
    })
    .then(r => r.json())
    .then((newQuoteObj) => {
      ALLQUOTES.push(newQuoteObj)
      quoteContainer.innerHTML = renderAllQuotes(ALLQUOTES)
    })
  })
})

const renderAllQuotes = () => {
  return ALLQUOTES.map((quote) => quotesHTML(quote)).join('')
}

const quotesHTML = (quote) => {
  return `
  <li class='quote-card' data-id="${quote.id}">
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button data-id="${quote.id}" class='btn-success'>Likes: <span>${quote.likes}</span></button>
      <button data-id="${quote.id}" class='btn-danger'>Delete</button>
    </blockquote>
  </li>
  `
}
