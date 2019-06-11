document.addEventListener("DOMContentLoaded", function() {
  const url = "http://localhost:3000/books/"
  const listUl = document.querySelector("#list")
  const listDiv = document.querySelector("#list-panel")
  const showDiv = document.querySelector("#show-panel")
  let targetBookUsers;

  fetch(url)
  .then(resp => resp.json())
  .then(books => {
    books.forEach(book => {
      listUl.innerHTML += `
        <li data-id="${book.id}"> ${book.title} </li>
      `
    })
  })

  listDiv.addEventListener("click", (e) => {
    showDiv.innerHTML = ""
    if(e.target.tagName === "LI"){
      fetch(`${url}${e.target.dataset.id}`)
      .then(resp => resp.json())
      .then(book => {
        showDiv.innerHTML += `
        <h2 data-book-id="${book.id}"> ${book.title} </h2>
        <img src="${book.img_url}" />
        <p> ${book.description} </p>
        <ul id="users"> </ul>
        <button> Read Book </button>
        `
        targetBookUsers = book.users
        let userUl = showDiv.querySelector("ul")
        let users = book.users
        users.forEach(user => {
          let userLi = document.createElement("li")
          userLi.setAttribute("data-user-id", user.id)
          userLi.innerText = user.username
          userUl.append(userLi)
        })
      })
    }
  })

  showDiv.addEventListener("click", (e) => {
    if(e.target.tagName === "BUTTON") {
      let targetId = document.querySelector(`div#show-panel h2`).dataset.bookId
      let userFound = false
      targetBookUsers.forEach(user => { user.id === 1 ? userFound = true:userFound = false })
      if(userFound === false){
        targetBookUsers = targetBookUsers.concat({id:1, username:"pouros"})
        fetch(`${url}${targetId}`, {
          method:"PATCH",
          headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
          },
          body: JSON.stringify({
            users: targetBookUsers
          })
        })
        .then(resp => resp.json())
        .then(book => {
          let targetUlTag = showDiv.querySelector("ul")
          let newLiTag = document.createElement("li")
          let user = book.users.slice(-1)
          newLiTag.setAttribute("data-user-id", user[0].id)
          newLiTag.innerText = user[0].username
          targetUlTag.append(newLiTag)
        })
      } else {
        alert("You read this already!")
        targetBookUsers.pop()
        fetch(`${url}${targetId}`, {
          method:"PATCH",
          headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
          },
          body: JSON.stringify({
            users: targetBookUsers
          })
        })
        .then(resp => resp.json())
        .then(book => {
          let targetUlTag = showDiv.querySelector("ul")
          targetUlTag.lastChild.remove()
        })
      }
    }
  })

});
